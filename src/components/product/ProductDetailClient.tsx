'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  Truck,
  Flame,
  Sparkles,
  Box,
} from 'lucide-react';
import { ParsedProduct } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useFlyAnimationStore } from '@/lib/store/flyAnimationStore';
import { ProductCard } from '@/components/shop/ProductCard';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

interface ProductDetailClientProps {
  product: ParsedProduct;
  relatedProducts: ParsedProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addBtnRef = useRef<HTMLButtonElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const triggerFly = useFlyAnimationStore((state) => state.triggerFly);

  const inWishlist = isInWishlist(product.id);
  const currentImage = product.images[selectedImgIdx] || product.images[0];

  const rarity = (product as any).rarity || 'COMMON';
  const vibes: string[] = (product as any).vibes || [];
  const isGrail = rarity === 'GRAIL';
  const isFoil = rarity === 'GRAIL' || rarity === 'RARE';

  const handleAddToCart = () => {
    if (addBtnRef.current) {
      const rect = addBtnRef.current.getBoundingClientRect();
      triggerFly(rect, currentImage);
    }

    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: currentImage,
      color: selectedColor,
      size: selectedSize,
      quantity,
      maxStock: product.stockCount,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-glitch-magenta transition-colors font-bold">
          GLITCHPOP
        </Link>
        <span>//</span>
        <Link href="/shop" className="hover:text-glitch-magenta transition-colors font-bold">
          DROPS
        </Link>
        <span>//</span>
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="hover:text-glitch-magenta transition-colors font-bold capitalize"
        >
          {product.categorySlug.replace('-', ' ')}
        </Link>
        <span>//</span>
        <span className="text-black dark:text-glitch-lime font-black truncate max-w-[240px]">
          {product.name}
        </span>
      </nav>

      {/* Main Split Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column (7 cols): Holographic Product Photography */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-glitch-dark border-3 border-black shadow-sticker-xl ${
              isFoil ? 'holo-card' : ''
            }`}
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />

            {/* Foil shimmer reflection overlay */}
            {isFoil && (
              <div className="absolute inset-0 pointer-events-none holo-shimmer opacity-15" />
            )}

            {/* Rarity Stamp Badge */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {isGrail && (
                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-glitch-magenta to-glitch-lavender text-white font-mono font-black text-xs uppercase border-2 border-black shadow-sticker flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-4 h-4 fill-glitch-yellow text-glitch-yellow" />
                  <span>HOLY GRAIL TIER</span>
                </span>
              )}
              {rarity === 'LIMITED' && (
                <span className="px-3 py-1.5 rounded-xl bg-glitch-lime text-black font-mono font-black text-xs uppercase border-2 border-black shadow-sticker flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>LIMITED RUN DROP</span>
                </span>
              )}
              {product.stockCount <= 5 && (
                <span className="px-2.5 py-1 rounded-lg bg-glitch-yellow text-black font-mono font-black text-xs border-2 border-black uppercase shadow-sticker">
                  URGENT: ONLY {product.stockCount} LEFT!
                </span>
              )}
            </div>
          </div>

          {/* Alternate Angle Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 border-black transition-all flex-shrink-0 shadow-sticker ${
                    selectedImgIdx === idx
                      ? 'ring-3 ring-glitch-magenta -translate-y-1'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Product Info & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="space-y-3 pb-6 border-b-2 border-black dark:border-glitch-border">
            {/* Category, Vibes & Rating */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-glitch-magenta dark:text-glitch-lime">
                  {product.categorySlug.replace('-', ' // ')}
                </span>
                {vibes.map((v, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md border border-black bg-glitch-cyan text-black"
                  >
                    #{v}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 font-mono text-xs font-black bg-black text-glitch-yellow px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-glitch-yellow" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-950 dark:text-white tracking-tight leading-tight uppercase">
              {product.name}
            </h1>

            {/* Price Line */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono font-black text-3xl text-gray-950 dark:text-glitch-lime">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono text-base text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-glitch-lime/20 text-glitch-dark dark:text-glitch-lime border border-glitch-lime/40">
                TAX INCLUDED
              </span>
            </div>

            {/* Description */}
            <p className="font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
              {product.description}
            </p>
          </div>

          {/* Color Finish Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500 font-bold uppercase">Color Variant:</span>
                <span className="font-black text-glitch-magenta dark:text-glitch-lime">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, idx) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border-2 border-black ${
                        isSelected
                          ? 'bg-glitch-magenta text-white shadow-sticker -translate-y-0.5'
                          : 'bg-white dark:bg-glitch-card text-black dark:text-white hover:bg-gray-100 shadow-sticker'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size / Edition Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-gray-500 block">
                Edition / Sizing:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border-2 border-black ${
                      selectedSize === s
                        ? 'bg-glitch-lime text-black shadow-sticker -translate-y-0.5'
                        : 'bg-white dark:bg-glitch-card text-black dark:text-white hover:bg-gray-100 shadow-sticker'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity, Add to Bag & Mascot Reactions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-white dark:bg-glitch-card rounded-xl p-1 border-2 border-black shadow-sticker">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-glitch-border"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-black text-black dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-glitch-border"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <motion.button
                ref={addBtnRef}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 h-12 px-6 rounded-2xl font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 border-black shadow-sticker-lg hover:-translate-y-0.5 ${
                  justAdded
                    ? 'bg-glitch-yellow text-black'
                    : 'bg-glitch-magenta hover:bg-glitch-lime text-white hover:text-black'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>STASHED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <span>ADD TO STASH</span>
                    <span className="opacity-40">•</span>
                    <span className="font-mono">{formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </motion.button>

              {/* Wishlist Button */}
              <button
                onClick={() =>
                  toggleWishlist({
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    image: product.images[0] || currentImage,
                    categorySlug: product.categorySlug,
                    rating: product.rating,
                  })
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-black shadow-sticker transition-all shrink-0 ${
                  inWishlist
                    ? 'bg-glitch-magenta text-white'
                    : 'bg-white dark:bg-glitch-card text-black dark:text-white hover:bg-glitch-lavender hover:text-black'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Mascot reaction on product page */}
            <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-black bg-glitch-yellow/20 dark:bg-glitch-yellow/10">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-glitch-magenta stroke-[2.5]" />
                <span className="font-mono text-xs font-bold">
                  Ships in heavy bubble mailer + collector trading sleeve
                </span>
              </div>
              <GlitchBlobMascot
                emotion={justAdded ? 'celebrating' : 'happy'}
                size="sm"
                speechText={justAdded ? 'NICE HAUL!' : 'READY TO DROP?'}
              />
            </div>
          </div>

          {/* Collector Specifications */}
          <div className="pt-6 border-t-2 border-black dark:border-glitch-border space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-black dark:text-glitch-lime font-black">
              // COLLECTOR SPECIFICATIONS
            </h4>
            <div className="text-xs font-mono space-y-2">
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-gray-500">Materials:</span>
                <span className="text-right font-black text-black dark:text-white">{product.materials}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-gray-500">Dimensions:</span>
                <span className="text-right font-black text-black dark:text-white">{product.dimensions}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-gray-500">Care / Storage:</span>
                <span className="text-right font-black text-black dark:text-white">{product.careInstructions}</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-glitch-lime shrink-0" />
              <span>Free Courier Dispatch over $45 · 100% Legit Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Strip */}
      {relatedProducts.length > 0 && (
        <section className="pt-16 border-t-2 border-black dark:border-glitch-border space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-950 dark:text-white uppercase tracking-tight">
              MORE FROM THIS <span className="text-glitch-magenta">VIBE</span>
            </h2>
            <Link
              href={`/shop?category=${product.categorySlug}`}
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-glitch-magenta hover:underline font-bold"
            >
              <span>View All in {product.categorySlug.replace('-', ' ')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel, idx) => (
              <ProductCard key={rel.id} product={rel} index={idx} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
