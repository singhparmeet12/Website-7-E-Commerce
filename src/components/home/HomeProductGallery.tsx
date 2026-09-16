'use client';

import React, { useState, useMemo } from 'react';
import { ParsedProduct, Category } from '@/lib/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { Search, ArrowUpDown, Sparkles, Filter } from 'lucide-react';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

interface HomeProductGalleryProps {
  products: ParsedProduct[];
  categories: Category[];
}

export function HomeProductGallery({ products, categories }: HomeProductGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.categorySlug === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.vibes || []).some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8" id="products">
      {/* GLITCHPOP Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-black dark:border-glitch-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border-2 border-black bg-glitch-magenta text-white font-mono text-xs font-black uppercase shadow-sticker mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL DROP REPOSITORY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-gray-950 dark:text-white">
            COMPLETE <span className="text-glitch-cyan">CATALOG</span>
          </h2>
          <p className="text-sm font-sans font-medium text-gray-600 dark:text-gray-400 mt-1">
            Displaying {filteredProducts.length} of {products.length} authentic drops.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grails, vibes, blind boxes..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border text-xs font-display font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-glitch-magenta w-52 sm:w-64 shadow-sticker transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border text-xs font-mono font-bold text-gray-800 dark:text-white focus:outline-none cursor-pointer shadow-sticker"
            >
              <option value="featured">★ Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated Grails</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase whitespace-nowrap transition-all border-2 border-black select-none ${
            selectedCategory === 'all'
              ? 'bg-glitch-lime text-black shadow-sticker -translate-y-0.5'
              : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-glitch-border shadow-sticker'
          }`}
        >
          All Drops ({products.length})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = products.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase whitespace-nowrap transition-all border-2 border-black select-none ${
                isSelected
                  ? 'bg-glitch-lime text-black shadow-sticker -translate-y-0.5'
                  : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-glitch-border shadow-sticker'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-black dark:border-glitch-border rounded-3xl p-8 bg-white dark:bg-glitch-card shadow-sticker space-y-4">
          <GlitchBlobMascot emotion="sad" size="md" speechText="NOTHING IN THIS BOX!" />
          <p className="font-display font-black text-base text-gray-900 dark:text-white uppercase">
            No grails found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl border-2 border-black bg-glitch-yellow font-mono text-xs font-black uppercase shadow-sticker hover:bg-black hover:text-glitch-yellow transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
