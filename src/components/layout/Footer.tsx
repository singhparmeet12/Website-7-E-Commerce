'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  LayoutGrid,
  Search,
  Heart,
  ShoppingBag,
  Flame,
  PackageCheck,
  ShieldCheck,
  Box,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';
import { useCartStore } from '@/lib/store/cartStore';
import { SearchModal } from './SearchModal';

const VIBE_LINKS = [
  { name: 'Cybercore', color: 'bg-glitch-cyan text-black' },
  { name: 'Kawaii', color: 'bg-glitch-magenta text-white' },
  { name: 'Y2K Revival', color: 'bg-glitch-lime text-black' },
  { name: 'Grunge', color: 'bg-glitch-yellow text-black' },
  { name: 'Chaotic Good', color: 'bg-glitch-lavender text-black' },
  { name: 'Weirdcore', color: 'bg-white text-black' },
];

export function Footer() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <>
      <footer className="relative border-t-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card pt-12 pb-16 lg:pb-12 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Professional Application Quick Navigation Strip */}
          <div className="mb-12 pb-8 border-b-2 border-black/10 dark:border-white/10">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-glitch-magenta dark:text-glitch-lime block mb-4">
              // APPLICATION NAVIGATION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-lime hover:text-black dark:hover:bg-glitch-lime dark:hover:text-black transition-all shadow-sticker text-xs font-mono font-bold"
              >
                <Home className="w-4 h-4 stroke-[2.2]" />
                <span>HOME</span>
              </Link>

              <Link
                href="/shop"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-magenta hover:text-white dark:hover:bg-glitch-magenta dark:hover:text-white transition-all shadow-sticker text-xs font-mono font-bold"
              >
                <Flame className="w-4 h-4 stroke-[2.2]" />
                <span>GRAIL DROPS</span>
              </Link>

              <Link
                href="/shop"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-cyan hover:text-black dark:hover:bg-glitch-cyan dark:hover:text-black transition-all shadow-sticker text-xs font-mono font-bold"
              >
                <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
                <span>CATALOG</span>
              </Link>

              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-yellow hover:text-black dark:hover:bg-glitch-yellow dark:hover:text-black transition-all shadow-sticker text-xs font-mono font-bold text-left"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
                <span>FIND GRAIL</span>
              </button>

              <Link
                href="/wishlist"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-lavender hover:text-black dark:hover:bg-glitch-lavender dark:hover:text-black transition-all shadow-sticker text-xs font-mono font-bold"
              >
                <Heart className="w-4 h-4 stroke-[2.2]" />
                <span>WISHLIST</span>
              </Link>

              <button
                onClick={openCart}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-gray-50 dark:bg-glitch-dark hover:bg-glitch-lime hover:text-black dark:hover:bg-glitch-lime dark:hover:text-black transition-all shadow-sticker text-xs font-mono font-bold text-left"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>MY STASH</span>
              </button>
            </div>
          </div>

          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1 flex flex-col items-start">
              <div className="inline-block px-3 py-1 bg-glitch-magenta text-white font-display font-black text-xl uppercase rounded-xl border-2 border-black shadow-sticker mb-3">
                GLITCHPOP
              </div>
              <p className="font-sans text-xs text-gray-700 dark:text-gray-300 font-medium mb-4 leading-relaxed">
                Curated collectibles platform for holy grail blind boxes, designer vinyl art toys, phone charms, and cyber desk accessories.
              </p>
              <div className="flex items-center gap-3">
                <GlitchBlobMascot emotion="peeking" size="sm" speechText="STAY WEIRD!" />
              </div>
            </div>

            {/* Drop Categories (Clean, NO EMOJIS) */}
            <div>
              <h4 className="font-mono text-xs font-black uppercase text-glitch-magenta dark:text-glitch-lime tracking-wider mb-3">
                // DROP CATEGORIES
              </h4>
              <ul className="space-y-2 text-xs font-mono font-bold uppercase">
                <li>
                  <Link href="/shop?category=trading-cards" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Cards & Blind Boxes</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=vinyl-toys" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Designer Vinyl Toys</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=phone-charms" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Y2K Phone Charms</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=stickers-patches" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Stickers & Patches</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=plushies-apparel" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Plushies & Wearables</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=desktop-tech" className="hover:text-glitch-magenta transition-colors flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    <span>Desktop & Play Tech</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop By Vibe Chips */}
            <div>
              <h4 className="font-mono text-xs font-black uppercase text-glitch-magenta dark:text-glitch-lime tracking-wider mb-3">
                // SHOP BY VIBE
              </h4>
              <div className="flex flex-wrap gap-2">
                {VIBE_LINKS.map((v) => (
                  <Link
                    key={v.name}
                    href={`/shop?vibe=${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className={`px-2.5 py-1 rounded-lg border-2 border-black font-mono text-[10px] font-black uppercase shadow-sticker transition-transform hover:-translate-y-0.5 ${v.color}`}
                  >
                    #{v.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl border-2 border-black bg-glitch-yellow/20 dark:bg-glitch-yellow/10 font-mono text-xs">
                <span className="font-bold">PROMO CODE:</span> <span className="font-black bg-black text-glitch-yellow px-1 py-0.5 rounded">GLITCH10</span> for 10% off.
              </div>
            </div>

            {/* Verification Badges */}
            <div>
              <h4 className="font-mono text-xs font-black uppercase text-glitch-magenta dark:text-glitch-lime tracking-wider mb-3">
                // BUYER ASSURANCE
              </h4>
              <div className="space-y-2 text-xs font-mono font-bold">
                <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-black bg-white dark:bg-glitch-dark shadow-sticker">
                  <ShieldCheck className="w-4 h-4 text-glitch-lime stroke-[2.5]" />
                  <span>100% AUTHENTIC GUARANTEE</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-black bg-white dark:bg-glitch-dark shadow-sticker">
                  <Box className="w-4 h-4 text-glitch-magenta stroke-[2.5]" />
                  <span>HEAVY BUBBLE WRAP DISPATCH</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl border-2 border-black bg-white dark:bg-glitch-dark shadow-sticker">
                  <PackageCheck className="w-4 h-4 text-glitch-yellow stroke-[2.5]" />
                  <span>FREE COURIER OVER $45</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t-2 border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-black text-black dark:text-white">GLITCHPOP LABS</span>
              <span>© 2026 // ALL RIGHTS RESERVED</span>
            </div>
            <div className="flex items-center gap-4 font-bold text-xs">
              <span className="text-glitch-magenta hover:underline cursor-pointer">PRIVACY</span>
              <span className="text-glitch-blue hover:underline cursor-pointer">SHIPPING FAQS</span>
              <span className="text-glitch-lime hover:underline cursor-pointer">COMMUNITY DISCORD</span>
              <span className="text-glitch-yellow hover:underline cursor-pointer">TIKTOK SHOP</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Global Search Modal for Footer */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
