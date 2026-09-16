'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, Box, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

export function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  const clearCart = useCartStore((state) => state.clearCart);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();

    // GLITCHPOP holographic confetti burst (magenta, lime, yellow, electric blue, lavender)
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#C6FF3D', '#FFE600', '#3D7EFF', '#C9A9FF'],
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF2E93', '#C6FF3D', '#FFE600'],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3D7EFF', '#C9A9FF', '#FF2E93'],
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [clearCart]);

  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId && !orderId) {
        setLoading(false);
        return;
      }

      try {
        const query = sessionId ? `session_id=${sessionId}` : `order_id=${orderId}`;
        const res = await fetch(`/api/checkout/session?${query}`);
        const data = await res.json();
        if (data.success) {
          setOrderData(data.order);
        }
      } catch (err) {
        console.error('Error loading order summary:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [sessionId, orderId]);

  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-10">
      {/* Celebration Header & Mascot */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <GlitchBlobMascot
            emotion="celebrating"
            size="xl"
            speechText="GRAIL HAUL ACQUIRED!"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-glitch-lime text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-sticker">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PAYMENT VERIFIED & ORDER QUEUED</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-gray-950 dark:text-white uppercase tracking-tight">
          HOLY GRAILS <span className="text-glitch-magenta">UNLOCKED!</span>
        </h1>

        <p className="text-sm font-sans text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
          Your pop-culture collectibles have been locked in and reserved. A receipt and tracking telemetry have been sent to your email.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-glitch-card border-3 border-black shadow-sticker-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-black dark:border-glitch-border gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-400 block">
              // DISPATCH REFERENCE
            </span>
            <span className="font-mono text-xs font-black text-black dark:text-glitch-lime">
              {orderData ? orderData.id : orderId || sessionId || 'GLITCH-ORDER-VERIFIED'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-black bg-glitch-yellow px-3 py-1.5 rounded-xl border-2 border-black shadow-sticker self-start sm:self-auto">
            <Truck className="w-3.5 h-3.5" />
            <span>EST. DELIVERY: {estimatedDelivery}</span>
          </div>
        </div>

        {/* Line Items List */}
        {orderData && orderData.items && (
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-glitch-magenta dark:text-glitch-lime font-black">
              // RESERVED COLLECTIBLE UNITS
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 py-2 border-b border-black/10 dark:border-white/10 last:border-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-glitch-dark border-2 border-black flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-sm text-black dark:text-white">
                      {item.name}
                    </h4>
                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} · {item.color} · {item.size}
                    </p>
                  </div>
                  <span className="font-mono font-black text-sm text-black dark:text-glitch-lime">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-black dark:border-glitch-border flex justify-between items-center text-base font-black text-black dark:text-white">
              <span>TOTAL SETTLEMENT</span>
              <span className="font-mono text-xl text-glitch-magenta">{formatPrice(orderData.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* Bubble mailer note */}
        <div className="p-4 rounded-2xl bg-glitch-lime/20 dark:bg-glitch-lime/10 border-2 border-black text-xs font-mono text-black dark:text-white flex items-center gap-3">
          <Box className="w-5 h-5 text-glitch-magenta shrink-0" />
          <span>
            Packed with double-walled heavy bubble wrap and authentic protective trading card sleeves. No bent corners, guaranteed.
          </span>
        </div>
      </div>

      {/* Return to Shop Action */}
      <div className="text-center pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-glitch-magenta hover:bg-glitch-lime text-white hover:text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-sticker transition-all"
        >
          <span>CONTINUE HUNTING FOR GRAILS</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
