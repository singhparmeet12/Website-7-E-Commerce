'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowRight, ShoppingBag, Bookmark, Sparkles } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useFlyAnimationStore } from '@/lib/store/flyAnimationStore';
import { formatPrice } from '@/lib/utils';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, hasHydrated } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const triggerFly = useFlyAnimationStore((state) => state.triggerFly);

  if (!hasHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs uppercase tracking-wider text-gray-400">
        Loading saved grail wishlist...
      </div>
    );
  }

  const handleMoveToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: (typeof items)[0]
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerFly(rect, item.image);

    addItem({
      id: `${item.productId}-wishlist`,
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      color: 'Standard',
      size: 'Standard',
      quantity: 1,
      maxStock: 20,
    });

    removeItem(item.productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-black dark:border-glitch-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-glitch-magenta text-white text-xs font-mono font-black uppercase tracking-wider mb-2 border-2 border-black shadow-sticker">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>SAVED GRAILS</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-gray-950 dark:text-white uppercase tracking-tight">
            WISHLIST & <span className="text-glitch-magenta">SAVED DROPS</span>
          </h1>
          <p className="text-sm font-sans font-medium text-gray-600 dark:text-gray-400 mt-1">
            {items.length} {items.length === 1 ? 'grail' : 'grails'} bookmarked for your next haul.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="px-4 py-2 rounded-xl border-2 border-black bg-white dark:bg-glitch-card text-xs font-mono font-bold text-glitch-magenta hover:bg-glitch-magenta hover:text-white transition-colors shadow-sticker flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Saved</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-glitch-card border-3 border-black shadow-sticker-xl space-y-5 max-w-lg mx-auto">
          <GlitchBlobMascot
            emotion="sad"
            size="lg"
            speechText="EMPTY WISHLIST!"
          />
          <h2 className="font-display font-black text-2xl text-gray-950 dark:text-white uppercase">
            NO GRAILS SAVED YET
          </h2>
          <p className="text-xs font-mono text-gray-500 max-w-sm mx-auto leading-relaxed">
            Browse the pop-culture drop catalog and click the heart icon on any holy grail to save it to your personal vault.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-glitch-lime text-black border-2 border-black font-display font-black text-xs uppercase shadow-sticker hover:bg-glitch-magenta hover:text-white transition-all"
            >
              <span>EXPLORE ALL DROPS</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl p-4 bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border shadow-sticker hover:shadow-sticker-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-glitch-dark border-2 border-black">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-white dark:bg-glitch-dark text-gray-500 hover:text-glitch-magenta border-2 border-black shadow-sticker transition-colors flex items-center justify-center"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white hover:text-glitch-magenta transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="pt-1 font-mono font-black text-base text-gray-900 dark:text-glitch-lime">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t-2 border-black/10 dark:border-white/10">
                  <button
                    onClick={(e) => handleMoveToCart(e, item)}
                    className="w-full h-11 rounded-xl bg-glitch-lime hover:bg-glitch-yellow text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-sticker transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>MOVE TO STASH</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
