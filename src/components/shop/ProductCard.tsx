'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Plus, Check, Star, Sparkles, Flame } from 'lucide-react';
import { ParsedProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useFlyAnimationStore } from '@/lib/store/flyAnimationStore';

interface ProductCardProps {
  product: ParsedProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const triggerFly = useFlyAnimationStore((state) => state.triggerFly);

  const inWishlist = isInWishlist(product.id);

  const primaryImage =
    product.images[0] ||
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonRef.current) {
      triggerFly(buttonRef.current.getBoundingClientRect(), primaryImage);
    }

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: primaryImage,
      color: product.colors[0]?.name || 'Standard',
      size: product.sizes[0] || 'Standard',
      quantity: 1,
      maxStock: product.stockCount,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: primaryImage,
      categorySlug: product.categorySlug,
      rating: product.rating,
    });
  };

  const rarity = (product as any).rarity || 'COMMON';
  const vibes: string[] = (product as any).vibes || [];

  const getRarityBadge = () => {
    switch (rarity) {
      case 'GRAIL':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-gradient-to-r from-glitch-magenta to-glitch-lavender text-white font-mono font-black text-[8px] sm:text-[9px] uppercase border border-black shadow-sticker flex items-center gap-0.5 sm:gap-1">
            <Flame className="w-2.5 h-2.5 fill-glitch-yellow text-glitch-yellow" /> GRAIL
          </span>
        );
      case 'LIMITED':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-glitch-lime text-black font-mono font-black text-[8px] sm:text-[9px] uppercase border border-black shadow-sticker flex items-center gap-0.5 sm:gap-1">
            <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> LIMITED
          </span>
        );
      case 'RARE':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-glitch-cyan text-black font-mono font-black text-[8px] sm:text-[9px] uppercase border border-black shadow-sticker">
            RARE
          </span>
        );
      default:
        return (
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white text-black font-mono font-black text-[8px] sm:text-[9px] uppercase border border-black shadow-sticker">
            NEW
          </span>
        );
    }
  };

  const isFoil = rarity === 'GRAIL' || rarity === 'RARE';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-xl sm:rounded-2xl p-2 sm:p-3.5 transition-all duration-300 border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-card shadow-sticker hover:shadow-sticker-lg hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
        isFoil ? 'hover:border-glitch-magenta dark:hover:border-glitch-lime' : ''
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 bg-gray-100 dark:bg-glitch-dark border-2 border-black">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered && secondaryImage !== primaryImage
                ? 'opacity-0 scale-105'
                : 'opacity-100 scale-100 group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {secondaryImage !== primaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {isFoil && (
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                isHovered ? 'opacity-35' : 'opacity-0'
              } holo-shimmer`}
            />
          )}
        </Link>

        {/* Top Badges (Rarity & Stock) */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {getRarityBadge()}
          {product.stockCount <= 8 && (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-glitch-yellow text-black font-mono font-black text-[8px] border border-black uppercase shadow-sticker">
              ONLY {product.stockCount} LEFT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from stash' : 'Add to stash'}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all z-20 border-2 border-black shadow-sticker ${
            inWishlist
              ? 'bg-glitch-magenta text-white'
              : 'bg-white text-black hover:bg-glitch-lavender'
          }`}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 z-20">
          <motion.button
            ref={buttonRef}
            onClick={handleQuickAdd}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-[11px] font-black tracking-wider uppercase transition-all border-2 border-black shadow-sticker ${
              justAdded
                ? 'bg-glitch-magenta text-white shadow-sticker-pink'
                : 'bg-glitch-lime hover:bg-glitch-yellow text-black'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span className="hidden xs:inline">ADDED</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>STASH</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Card Body Information */}
      <div className="flex-1 flex flex-col justify-between pt-0.5 sm:pt-1">
        <div>
          {/* Category & Vibe Pills */}
          <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-glitch-magenta dark:text-glitch-lime truncate max-w-[90px] sm:max-w-none">
              {product.categorySlug.replace('-', ' ')}
            </span>
            {vibes.length > 0 && (
              <span className="hidden sm:inline-block font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                #{vibes[0]}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display font-bold text-xs sm:text-sm text-gray-900 dark:text-white leading-snug hover:text-glitch-magenta transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="hidden sm:block text-xs text-gray-500 dark:text-glitch-muted line-clamp-1 mt-0.5 font-medium">
            {product.tagline}
          </p>
        </div>

        {/* Pricing Line & Rating */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2.5 mt-1.5 sm:mt-2.5 border-t-2 border-black/10 dark:border-white/10">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-black text-xs sm:text-base text-gray-900 dark:text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="hidden sm:inline font-mono text-[10px] text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-[11px] font-bold text-black dark:text-glitch-yellow">
            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-glitch-yellow text-black dark:text-glitch-yellow" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
