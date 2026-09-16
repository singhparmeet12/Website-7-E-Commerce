'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Sun, Moon, Menu, X, ArrowRight, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useFlyAnimationStore } from '@/lib/store/flyAnimationStore';
import { SearchModal } from './SearchModal';

const NAV_LINKS = [
  { name: 'DROPS', href: '/#products' },
  { name: 'TRADING CARDS', href: '/shop?category=trading-cards' },
  { name: 'VINYL TOYS', href: '/shop?category=vinyl-toys' },
  { name: 'PHONE CHARMS', href: '/shop?category=phone-charms' },
  { name: 'STICKERS', href: '/shop?category=stickers-patches' },
  { name: 'PLUSHIES', href: '/shop?category=plushies-apparel' },
  { name: 'DESK TECH', href: '/shop?category=desktop-tech' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openCart, getItemCount, hasHydrated: cartHydrated } = useCartStore();
  const { items: wishlistItems, hasHydrated: wishlistHydrated } = useWishlistStore();
  const cartBouncing = useFlyAnimationStore((state) => state.cartBouncing);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = cartHydrated ? getItemCount() : 0;
  const totalWishlistCount = wishlistHydrated ? wishlistItems.length : 0;

  return (
    <>
      {/* Top Ticker Marquee - Clean, no emojis */}
      <div className="w-full bg-glitch-lime text-glitch-dark font-mono text-[11px] font-black uppercase tracking-wider py-1.5 px-4 overflow-hidden border-b-2 border-black flex items-center justify-between select-none">
        <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 fill-black" /> USE CODE 'GLITCH10' FOR 10% OFF</span>
          <span>•</span>
          <span>LIMITED BLIND BOX SERIES 04 RESTOCKED</span>
          <span>•</span>
          <span>WORLDWIDE HOLOGRAPHIC DISPATCH</span>
          <span>•</span>
          <span>AUTHENTIC COLLECTIBLES ONLY // NO BOOTLEGS</span>
          <span>•</span>
          <span>FREE SHIPPING OVER $45</span>
          <span>•</span>
          <span>NEW DROPS EVERY FRIDAY 12:00 PM EST</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full glass-nav border-b-2 border-black dark:border-glitch-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border text-glitch-dark dark:text-white shadow-sticker"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <Link href="/" className="group flex items-center gap-2 select-none">
              <div className="px-3 py-1.5 bg-glitch-magenta text-white font-display font-black text-lg tracking-tight uppercase rounded-xl border-2 border-black shadow-sticker transform group-hover:scale-105 transition-all">
                GLITCHPOP
              </div>
              <span className="hidden xl:inline-block font-mono text-[10px] tracking-widest text-glitch-muted dark:text-glitch-lime font-bold uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                v2.0
              </span>
            </Link>
          </div>

          {/* Center: Clean, Sleek Straight Line Navigation (NO EMOJIS, NO WRAP) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap border-2 ${
                    isActive
                      ? 'bg-glitch-lime text-black border-black shadow-sticker'
                      : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-glitch-lime hover:bg-white dark:hover:bg-glitch-card'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Wishlist, Cart & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Button / Quick Search Bar Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-200 hover:border-glitch-magenta hover:bg-glitch-yellow hover:text-black dark:hover:bg-glitch-yellow dark:hover:text-black transition-all text-xs font-mono font-bold shadow-sticker group"
              aria-label="Open search dialog"
              title="Search collectibles (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-glitch-magenta group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-sans font-bold text-xs text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-black">
                Search items...
              </span>
              <span className="sm:hidden font-mono text-[10px] tracking-wider">
                SEARCH
              </span>
              <kbd className="hidden md:inline-block text-[10px] px-1 py-0.5 rounded bg-black/10 dark:bg-white/15 border border-black/20 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card text-gray-800 dark:text-white hover:bg-glitch-lavender hover:text-black transition-all shadow-sticker"
              aria-label="View saved wishlist"
            >
              <Heart className="w-4 h-4" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-glitch-magenta border-2 border-black font-mono font-black text-[9px] text-white flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <motion.button
              id="nav-cart-btn"
              onClick={openCart}
              animate={cartBouncing ? { scale: [1, 1.25, 0.9, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-glitch-lime text-black border-2 border-black font-display font-black text-xs transition-all shadow-sticker hover:-translate-y-0.5"
              aria-label="Open shopping stash"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">STASH</span>
              <span className="w-4 h-4 rounded-full bg-glitch-magenta border border-black font-mono font-black text-[9px] text-white flex items-center justify-center">
                {totalCartCount}
              </span>
            </motion.button>

            {/* Light / Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card text-gray-800 dark:text-white hover:bg-glitch-cyan hover:text-black transition-all shadow-sticker"
                aria-label="Toggle color theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-glitch-yellow" />
                ) : (
                  <Moon className="w-4 h-4 text-glitch-magenta" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-dark px-4 py-5 shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-glitch-yellow text-black font-display font-black text-xs uppercase border-2 border-black shadow-sticker mb-1 hover:bg-glitch-lime transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-glitch-magenta" />
                    <span>SEARCH ALL 30 COLLECTIBLES...</span>
                  </div>
                  <span className="font-mono text-[10px] bg-black/10 px-1.5 py-0.5 rounded border border-black/20 font-bold">
                    FIND
                  </span>
                </button>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider border-2 transition-all ${
                      pathname === link.href
                        ? 'bg-glitch-lime text-black border-black shadow-sticker'
                        : 'bg-white dark:bg-glitch-card border-black dark:border-glitch-border text-gray-800 dark:text-white shadow-sticker'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
