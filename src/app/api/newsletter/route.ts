import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0]?.message || 'Invalid email' },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already part of the NEOPOP VIP Lab! Use code NEOPOP10 at checkout.",
        discountCode: 'NEOPOP10',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to the NEOPOP VIP Lab! Here is your 10% code: NEOPOP10 ⚡🎉',
      discountCode: 'NEOPOP10',
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}
