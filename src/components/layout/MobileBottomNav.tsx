'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { SearchModal } from './SearchModal';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const { openCart, getItemCount, hasHydrated: cartHydrated } = useCartStore();
  const { items: wishlistItems, hasHydrated: wishlistHydrated } = useWishlistStore();

  const totalCartCount = cartHydrated ? getItemCount() : 0;
  const totalWishlistCount = wishlistHydrated ? wishlistItems.length : 0;

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-glitch-card/95 backdrop-blur-md border-t-2 border-black dark:border-glitch-border py-1.5 px-3 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.15)]"
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            pathname === '/'
              ? 'text-glitch-magenta dark:text-glitch-lime font-black'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[9px] uppercase tracking-wider">HOME</span>
        </Link>

        {/* Catalog */}
        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            pathname === '/shop'
              ? 'text-glitch-magenta dark:text-glitch-lime font-black'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[9px] uppercase tracking-wider">CATALOG</span>
        </Link>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[9px] uppercase tracking-wider">SEARCH</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-0.5 p-1 transition-colors ${
            pathname === '/wishlist'
              ? 'text-glitch-magenta dark:text-glitch-lime font-black'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[9px] uppercase tracking-wider">SAVED</span>
          {totalWishlistCount > 0 && (
            <span className="absolute 0 top-0.5 right-1 w-4 h-4 rounded-full bg-glitch-magenta border border-black font-mono font-black text-[8px] text-white flex items-center justify-center">
              {totalWishlistCount}
            </span>
          )}
        </Link>

        {/* Cart Bag */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-0.5 p-1 text-gray-800 dark:text-white hover:text-glitch-magenta transition-colors"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          <span className="font-mono text-[9px] uppercase tracking-wider font-bold">STASH</span>
          {totalCartCount > 0 && (
            <span className="absolute 0 top-0.5 right-1 w-4 h-4 rounded-full bg-glitch-lime text-black border border-black font-mono font-black text-[8px] flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Global Search Modal for Bottom Bar */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
