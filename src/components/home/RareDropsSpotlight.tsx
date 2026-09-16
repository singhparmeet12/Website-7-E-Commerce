'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ParsedProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';

interface RareDropsSpotlightProps {
  products: ParsedProduct[];
}

export function RareDropsSpotlight({ products }: RareDropsSpotlightProps) {
  const { addItem } = useCartStore();

  // Filter for GRAIL and LIMITED products
  const grails = products.filter((p) => p.rarity === 'GRAIL' || p.rarity === 'LIMITED').slice(0, 3);

  return (
    <section id="rare-drops" className="py-16 md:py-24 border-b-2 border-black dark:border-glitch-border bg-glitch-lavender/10 dark:bg-glitch-card/40 relative overflow-hidden">
      {/* Background neon elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border-2 border-black bg-glitch-magenta text-white font-mono text-xs font-black uppercase shadow-sticker mb-3">
              <Flame className="w-3.5 h-3.5 fill-glitch-yellow text-glitch-yellow" />
              <span>GRAIL VAULT // SERIES 04</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-gray-950 dark:text-white">
              RARE DROPS & <span className="holo-gradient-text">GRAIL SPOTLIGHT</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mt-1">
              Ultra-limited print runs, holographic foil stamping, and serialized collectibles. Once sold out, they do not restock.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-black bg-glitch-lime text-black font-display font-black text-xs uppercase shadow-sticker hover:-translate-y-0.5 transition-all self-start md:self-auto"
          >
            <span>VIEW ALL 30 ITEMS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Grail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {grails.map((item, idx) => {
            const isGrail = item.rarity === 'GRAIL';
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl p-5 border-2 border-black bg-white dark:bg-glitch-card shadow-sticker-lg flex flex-col justify-between overflow-hidden ${
                  isGrail ? 'holo-card' : ''
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4 z-10">
                  <span
                    className={`px-2.5 py-1 rounded-xl border border-black font-mono text-xs font-black uppercase shadow-sticker flex items-center gap-1.5 ${
                      isGrail
                        ? 'bg-glitch-magenta text-white'
                        : 'bg-glitch-lime text-black'
                    }`}
                  >
                    {isGrail ? (
                      <>
                        <Flame className="w-3 h-3 fill-glitch-yellow text-glitch-yellow" />
                        <span>GRAIL TIER</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>LIMITED RUN</span>
                      </>
                    )}
                  </span>

                  <span className="font-mono text-xs font-bold text-gray-500 dark:text-glitch-muted">
                    #{item.categorySlug}
                  </span>
                </div>

                {/* Photo with holographic reflection */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 border-2 border-black bg-gray-100 dark:bg-glitch-dark">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {isGrail && (
                    <div className="absolute inset-0 pointer-events-none holo-shimmer opacity-20" />
                  )}
                </div>

                {/* Item Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xl text-gray-950 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs font-bold text-glitch-yellow bg-black px-2 py-0.5 rounded-lg">
                      <Star className="w-3 h-3 fill-glitch-yellow" />
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-display font-black text-lg text-gray-900 dark:text-white hover:text-glitch-magenta transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                    {item.tagline}
                  </p>
                </div>

                {/* Pull Probability / Specs Badge */}
                <div className="p-3 rounded-xl border border-black/20 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono text-[11px] mb-5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">AUTHENTICITY:</span>
                    <span className="font-bold text-black dark:text-glitch-lime">PSA / FACTORY SEALED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">STOCK LEFT:</span>
                    <span className="font-bold text-glitch-magenta">{item.stockCount} UNITS REMAINING</span>
                  </div>
                </div>

                {/* Stash Button */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex-1 py-2.5 rounded-xl border-2 border-black bg-white dark:bg-glitch-dark hover:bg-glitch-yellow text-center font-display font-black text-xs uppercase shadow-sticker transition-all text-black dark:text-white hover:text-black"
                  >
                    INSPECT
                  </Link>
                  <button
                    onClick={() =>
                      addItem({
                        id: `${item.id}-default`,
                        productId: item.id,
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        image: item.images[0],
                        color: item.colors[0]?.name || 'Standard',
                        size: item.sizes[0] || 'Standard',
                        quantity: 1,
                        maxStock: item.stockCount,
                      })
                    }
                    className="flex-1 py-2.5 rounded-xl border-2 border-black bg-glitch-magenta hover:bg-glitch-lime text-center font-display font-black text-xs uppercase shadow-sticker transition-all text-white hover:text-black"
                  >
                    STASH NOW
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
