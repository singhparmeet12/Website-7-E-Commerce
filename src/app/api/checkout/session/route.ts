import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    if (!sessionId && !orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing session_id or order_id' },
        { status: 400 }
      );
    }

    // Try finding order in DB first
    let order = await prisma.order.findFirst({
      where: {
        OR: [
          sessionId ? { stripeSessionId: sessionId } : {},
          orderId ? { id: orderId } : {},
        ],
      },
    });

    // If order found but pending, and live Stripe is active, check stripe status
    if (order && order.status === 'PENDING' && isStripeConfigured() && sessionId && !sessionId.startsWith('cs_test_koko_')) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'PAID',
              customerEmail: session.customer_details?.email || order.customerEmail,
              customerName: session.customer_details?.name || order.customerName,
            },
          });
        }
      } catch (stripeErr) {
        console.warn('Could not retrieve live stripe session:', stripeErr);
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    let parsedItems = [];
    try {
      parsedItems = JSON.parse(order.items);
    } catch {
      parsedItems = [];
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        createdAt: order.createdAt,
        items: parsedItems,
      },
    });
  } catch (error: any) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order session' },
      { status: 500 }
    );
  }
}
