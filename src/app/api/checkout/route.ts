import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';

// Simple in-memory rate limiter per IP: max 20 checkout creations per 10 minutes
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entry = ipRateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= 20) {
    return true;
  }

  entry.count++;
  return false;
}

// Zod schema for incoming checkout request
const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        color: z.string().default('Default'),
        size: z.string().default('Standard'),
        quantity: z.number().int().positive().max(50),
      })
    )
    .min(1, 'Cart cannot be empty'),
  promoCode: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { items, promoCode, customerEmail } = parseResult.data;

    // 1. CRITICAL SECURITY: Fetch verified prices and stock directly from the database
    // We NEVER trust client-supplied prices!
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (dbProducts.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid collectibles found in database.' },
        { status: 404 }
      );
    }

    const dbProductsMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Validate stock and build server-verified line items
    let calculatedSubtotal = 0;
    const verifiedLineItems: Array<{
      productId: string;
      name: string;
      price: number; // in cents
      quantity: number;
      color: string;
      size: string;
      image: string;
    }> = [];

    for (const item of items) {
      const product = dbProductsMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.productId} does not exist.` },
          { status: 400 }
        );
      }

      if (!product.inStock || product.stockCount < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Collectable "${product.name}" is out of stock or insufficient inventory.`,
          },
          { status: 400 }
        );
      }

      let primaryImage = '';
      try {
        const parsedImages = JSON.parse(product.images);
        primaryImage = parsedImages[0] || '';
      } catch {
        primaryImage = '';
      }

      // Exact database price used here!
      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedLineItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: primaryImage,
      });
    }

    // 3. Server-side discount calculation (GLITCH10 = 10% off)
    let discountAmount = 0;
    const normalizedPromo = promoCode ? promoCode.trim().toUpperCase() : '';
    if (
      normalizedPromo === 'GLITCH10' ||
      normalizedPromo === 'STUDIO10' ||
      normalizedPromo === 'NEOPOP10' ||
      normalizedPromo === 'VIRAL10' ||
      normalizedPromo === 'POP10'
    ) {
      discountAmount = Math.round(calculatedSubtotal * 0.1);
    }

    // Shipping calculation: Free over $45 (4500 cents) or with FREESHIP promo
    let shippingAmount = 0;
    if (calculatedSubtotal < 4500 && normalizedPromo !== 'FREESHIP') {
      shippingAmount = 499; // $4.99
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingAmount);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (req.headers.get('origin') ?? 'http://localhost:3008');

    // 4. Create an Order in the SQLite database
    const pendingOrder = await prisma.order.create({
      data: {
        customerEmail: customerEmail || 'collector@glitchpop.shop',
        customerName: 'GLITCHPOP Collector',
        totalAmount: finalTotal,
        status: 'PENDING',
        items: JSON.stringify(verifiedLineItems),
      },
    });

    // 5. Check if live Stripe Test Mode keys are configured
    if (isStripeConfigured()) {
      // Build Stripe line items from DB prices
      const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = verifiedLineItems.map(
        (item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.name} (${item.color} / ${item.size})`,
              images: item.image ? [item.image] : [],
              metadata: {
                productId: item.productId,
              },
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })
      );

      // Add shipping if applicable
      if (shippingAmount > 0) {
        stripeLineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Reinforced Bubble Mailer Dispatch',
              description: 'Double-walled impact-resistant packaging with card sleeves',
            },
            unit_amount: shippingAmount,
          },
          quantity: 1,
        });
      }

      // Add discount coupon if promo code valid
      const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
      if (discountAmount > 0) {
        try {
          const coupon = await stripe.coupons.create({
            percent_off: 10,
            duration: 'once',
            name: `GLITCHPOP 10% Off Drop Promo (${normalizedPromo})`,
          });
          discounts.push({ coupon: coupon.id });
        } catch {
          // If coupon creation fails, line items are still secure
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: stripeLineItems,
        mode: 'payment',
        discounts: discounts.length > 0 ? discounts : undefined,
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${pendingOrder.id}`,
        cancel_url: `${appUrl}/shop?checkout_cancelled=true`,
        client_reference_id: pendingOrder.id,
        metadata: {
          orderId: pendingOrder.id,
          promoCode: normalizedPromo || 'none',
        },
      });

      // Update Order with session ID
      await prisma.order.update({
        where: { id: pendingOrder.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });
    } else {
      // Offline / Sandbox Test Mode for portfolio preview when placeholder keys are used
      const simulatedSessionId = `cs_test_glitchpop_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      await prisma.order.update({
        where: { id: pendingOrder.id },
        data: {
          stripeSessionId: simulatedSessionId,
          status: 'PAID',
        },
      });

      const sandboxSuccessUrl = `${appUrl}/checkout/success?session_id=${simulatedSessionId}&order_id=${pendingOrder.id}&test_mode=sandbox`;

      return NextResponse.json({
        success: true,
        sessionId: simulatedSessionId,
        url: sandboxSuccessUrl,
        mode: 'sandbox',
        message: 'Stripe Sandbox Test Mode session created with database-verified pricing.',
      });
    }
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
