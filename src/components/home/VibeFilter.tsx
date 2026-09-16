'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { ParsedProduct } from '@/lib/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { GlitchBlobMascot, MascotEmotion } from '@/components/mascot/GlitchBlobMascot';

interface VibeFilterProps {
  products: ParsedProduct[];
}

const VIBES = [
  { id: 'all', name: 'ALL VIBES', color: 'bg-black text-white dark:bg-white dark:text-black', speech: 'SHOWING EVERYTHING!', emotion: 'happy' as MascotEmotion },
  { id: 'cybercore', name: '#Cybercore', color: 'bg-glitch-cyan text-black', speech: 'CYBER ENERGETIC!', emotion: 'celebrating' as MascotEmotion },
  { id: 'kawaii', name: '#Kawaii', color: 'bg-glitch-magenta text-white', speech: 'KAWAII OVERLOAD (◕‿◕)', emotion: 'happy' as MascotEmotion },
  { id: 'y2k', name: '#Y2K', color: 'bg-glitch-lime text-black', speech: 'PURE 2000s NOSTALGIA!', emotion: 'celebrating' as MascotEmotion },
  { id: 'grunge', name: '#Grunge', color: 'bg-glitch-yellow text-black', speech: 'DARK & MOODY AESTHETIC!', emotion: 'idle' as MascotEmotion },
  { id: 'chaotic-good', name: '#Chaotic Good', color: 'bg-glitch-lavender text-black', speech: 'MAXIMUM CHAOS ✨', emotion: 'peeking' as MascotEmotion },
  { id: 'weirdcore', name: '#Weirdcore', color: 'bg-white text-black border-dashed', speech: 'STAY STRANGE...', emotion: 'sad' as MascotEmotion },
];

export function VibeFilter({ products }: VibeFilterProps) {
  const [selectedVibe, setSelectedVibe] = useState('all');

  const currentVibeObj = useMemo(() => {
    return VIBES.find((v) => v.id === selectedVibe) || VIBES[0];
  }, [selectedVibe]);

  const filteredProducts = useMemo(() => {
    if (selectedVibe === 'all') return products;
    const target = selectedVibe.toLowerCase();
    return products.filter((p) => {
      const vibes = (p.vibes || []).map((v) => v.toLowerCase().replace(/\s+/g, '-'));
      const rawVibes = (p.vibes || []).map((v) => v.toLowerCase());
      return vibes.includes(target) || rawVibes.some((v) => v.includes(target.replace('-', ' ')));
    });
  }, [products, selectedVibe]);

  return (
    <section id="vibes" className="py-16 md:py-24 border-b-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Mascot */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border-2 border-black bg-glitch-lime text-black font-mono text-xs font-black uppercase shadow-sticker mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MOOD CURATION ENGINE</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-gray-950 dark:text-white">
              SHOP BY <span className="text-glitch-magenta">VIBE</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mt-1">
              Forget boring product categories. Filter by your actual current dopamine aesthetic.
            </p>
          </div>

          {/* Interactive Mascot Reacting to Vibe Selection */}
          <div className="flex items-center gap-3">
            <GlitchBlobMascot
              emotion={currentVibeObj.emotion}
              size="md"
              speechText={currentVibeObj.speech}
            />
          </div>
        </div>

        {/* Vibe Selection Chips Horizontal Scroll */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar mb-8">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex-shrink-0 select-none ${
                  isSelected
                    ? `${vibe.color} shadow-sticker-lg -translate-y-1 scale-105`
                    : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-glitch-border hover:shadow-sticker'
                }`}
              >
                {vibe.name}
              </button>
            );
          })}
        </div>

        {/* Products Count Indicator */}
        <div className="flex items-center justify-between font-mono text-xs font-bold text-gray-500 dark:text-gray-400 mb-6 px-1">
          <span>
            MATCHING GRAILS: <span className="text-glitch-magenta font-black">{filteredProducts.length}</span> ITEMS
          </span>
          <span className="hidden sm:inline">CLICK A CARD TO INSPECT RARITY & STATS</span>
        </div>

        {/* Product Grid with Framer Motion Layout Shuffle */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          <AnimatePresence>
            {filteredProducts.slice(0, 12).map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <ProductCard product={product} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
