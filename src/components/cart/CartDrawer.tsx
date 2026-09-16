'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, Loader2, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getItemCount,
    hasHydrated,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!hasHydrated) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
        promoCode: promoCode || undefined,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Checkout error. Please verify items.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('An error occurred contacting Stripe. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white dark:bg-glitch-card flex flex-col border-l-3 border-black shadow-sticker-xl"
            >
              {/* Header */}
              <div className="p-5 border-b-2 border-black dark:border-glitch-border bg-glitch-lime/20 dark:bg-glitch-dark flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-glitch-magenta text-white border-2 border-black flex items-center justify-center font-mono shadow-sticker">
                    <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg text-black dark:text-white uppercase tracking-tight">
                      COLLECTOR STASH
                    </h2>
                    <p className="text-[11px] font-mono font-bold text-glitch-magenta dark:text-glitch-lime">
                      {itemCount} {itemCount === 1 ? 'GRAIL RESERVED' : 'GRAILS RESERVED'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-xl border-2 border-black bg-white dark:bg-glitch-dark text-black dark:text-white hover:bg-glitch-magenta hover:text-white transition-colors shadow-sticker"
                  aria-label="Close stash"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Free Courier Dispatch Progress Bar */}
              <div className="px-5 py-3 bg-glitch-yellow/25 dark:bg-glitch-yellow/10 border-b-2 border-black dark:border-glitch-border space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>
                    {freeShippingRemaining === 0 ? (
                      <span className="text-black dark:text-glitch-lime font-black flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> FREE BUBBLE MAILER DISPATCH UNLOCKED!
                      </span>
                    ) : (
                      <span className="text-gray-800 dark:text-gray-300">
                        Add <strong className="text-glitch-magenta font-black">{formatPrice(freeShippingRemaining)}</strong> for Free Courier
                      </span>
                    )}
                  </span>
                  <span className="text-black dark:text-white font-black">{shippingPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white dark:bg-glitch-dark border border-black overflow-hidden">
                  <motion.div
                    className="h-full bg-glitch-magenta"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <GlitchBlobMascot
                      emotion="sad"
                      size="lg"
                      speechText="YOUR STASH IS EMPTY!"
                    />
                    <h3 className="font-display font-black text-lg text-black dark:text-white uppercase">
                      NO GRAILS COLLECTED YET
                    </h3>
                    <p className="text-xs font-sans text-gray-600 dark:text-gray-400 max-w-xs font-medium">
                      Explore blind boxes, designer vinyl toys, holographic cards, and Y2K charms.
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-3 rounded-2xl bg-glitch-lime text-black border-2 border-black font-display font-black text-xs uppercase shadow-sticker hover:bg-glitch-magenta hover:text-white transition-all"
                    >
                      HUNT FOR GRAILS
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3 rounded-2xl border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-dark shadow-sticker"
                    >
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-gray-100 dark:bg-glitch-card flex-shrink-0 border border-black">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display font-bold text-xs text-black dark:text-white leading-tight line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-glitch-magenta transition-colors p-0.5"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[11px] font-mono text-gray-500 dark:text-glitch-muted mt-0.5">
                            {item.color} // {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border-2 border-black rounded-lg bg-white dark:bg-glitch-card shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center font-black hover:bg-gray-100 dark:hover:bg-glitch-border"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                            <span className="w-6 text-center font-mono font-black text-xs text-black dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center font-black hover:bg-gray-100 dark:hover:bg-glitch-border"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>

                          <span className="font-mono font-black text-sm text-black dark:text-glitch-lime">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Arcade Receipt Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card space-y-3.5">
                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Use code GLITCH10"
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-glitch-dark text-xs font-mono font-bold text-black dark:text-white placeholder:text-gray-400 focus:outline-none border-2 border-black"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-glitch-yellow hover:bg-black text-black hover:text-glitch-yellow border-2 border-black font-display font-black text-xs uppercase shadow-sticker transition-all"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Promo Message */}
                  {promoMsg && (
                    <p
                      className={`text-xs font-mono font-bold ${
                        promoMsg.isError ? 'text-glitch-magenta' : 'text-emerald-600 dark:text-glitch-lime'
                      }`}
                    >
                      {promoMsg.text}
                    </p>
                  )}
                  {promoCode && (
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-black dark:text-glitch-lime bg-glitch-lime/20 px-3 py-1.5 rounded-xl border border-black">
                      <span>✦ CODE APPLIED: {promoCode} (-10%)</span>
                      <button onClick={removePromoCode} className="text-glitch-magenta hover:underline text-[11px] font-black">
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Cost Summary in Arcade Receipt Style */}
                  <div className="p-3 rounded-2xl border-2 border-dashed border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">HAUL SUBTOTAL:</span>
                      <span className="font-black text-black dark:text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-glitch-magenta font-black">
                        <span>DISCOUNT (10%):</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500">COURIER DISPATCH:</span>
                      <span className="font-black text-black dark:text-white">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t-2 border-black/10 dark:border-white/10 text-sm font-black text-black dark:text-glitch-lime">
                      <span>TOTAL PAYABLE:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 rounded-2xl bg-glitch-magenta hover:bg-glitch-lime text-white hover:text-black font-display font-black text-sm uppercase tracking-wider transition-all border-2 border-black shadow-sticker-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                        <span>PREPARING STRIPE VAULT...</span>
                      </>
                    ) : (
                      <>
                        <span>VERIFIED CHECKOUT</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-500 text-center font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-glitch-lime" />
                    <span>STRIPE SSL ENCRYPTED GATEWAY</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
