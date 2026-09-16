import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET' },
      { status: 400 }
    );
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const orderId = session.client_reference_id || session.metadata?.orderId;
    const stripeSessionId = session.id;

    try {
      // Find the corresponding pending order
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            orderId ? { id: orderId } : {},
            { stripeSessionId: stripeSessionId },
          ],
        },
      });

      if (order) {
        // Mark as PAID
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            customerEmail: session.customer_details?.email || order.customerEmail,
            customerName: session.customer_details?.name || order.customerName,
            shippingAddress: session.shipping_details
              ? JSON.stringify(session.shipping_details)
              : null,
          },
        });

        // Decrement product stock counts
        try {
          const items = JSON.parse(order.items);
          for (const item of items) {
            if (item.productId && item.quantity) {
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  stockCount: {
                    decrement: item.quantity,
                  },
                },
              });
            }
          }
        } catch (stockErr) {
          console.error('Error updating inventory counts:', stockErr);
        }

        console.log(`✓ Order ${order.id} marked as PAID.`);
      }
    } catch (dbError) {
      console.error('Database error in Stripe webhook handler:', dbError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
