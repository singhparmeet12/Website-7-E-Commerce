'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, RotateCcw, Sparkles, Flame, Search } from 'lucide-react';
import { ParsedProduct, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/shop/ProductCard';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

interface ShopPageClientProps {
  initialProducts: ParsedProduct[];
  categories: Category[];
}

const RARITY_OPTIONS = ['ALL', 'GRAIL', 'LIMITED', 'RARE', 'COMMON'];

const SORT_OPTIONS = [
  { id: 'featured', label: '★ Featured Grails' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated Drops' },
  { id: 'newest', label: 'Latest Dispatches' },
];

export function ShopPageClient({ initialProducts, categories }: ShopPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mobile bottom-sheet state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedRarity = searchParams.get('rarity') || 'ALL';
  const selectedVibe = searchParams.get('vibe') || '';
  const selectedSort = searchParams.get('sort') || 'featured';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const maxPriceParam = searchParams.get('maxPrice');
  const [priceMax, setPriceMax] = useState<number>(
    maxPriceParam ? parseInt(maxPriceParam) : 30000
  );
  const searchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Keep searchTerm in sync with URL query
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Debounced sync from input to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== searchQuery) {
        updateUrl({ search: searchTerm.trim() ? searchTerm.trim() : null });
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || (key === 'category' && val === 'all') || (key === 'rarity' && val === 'ALL')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (catSlug: string) => {
    updateUrl({ category: catSlug === selectedCategory ? 'all' : catSlug });
  };

  const handleRaritySelect = (rarity: string) => {
    updateUrl({ rarity: rarity === selectedRarity ? 'ALL' : rarity });
  };

  const handleSortChange = (sortId: string) => {
    updateUrl({ sort: sortId });
  };

  const handleToggleInStock = () => {
    updateUrl({ inStock: inStockOnly ? null : 'true' });
  };

  const handlePriceChange = (newMax: number) => {
    setPriceMax(newMax);
    updateUrl({ maxPrice: newMax < 30000 ? newMax.toString() : null });
  };

  const handleClearAll = () => {
    setPriceMax(30000);
    setSearchTerm('');
    router.replace('/shop', { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
          return false;
        }
        if (selectedRarity !== 'ALL') {
          const r = (product as any).rarity || 'COMMON';
          if (r !== selectedRarity) return false;
        }
        if (selectedVibe) {
          const vList = (product.vibes || []).map((v) => v.toLowerCase().replace(/\s+/g, '-'));
          const rawVibes = (product.vibes || []).map((v) => v.toLowerCase());
          const target = selectedVibe.toLowerCase();
          const matchVibe = vList.includes(target) || rawVibes.some((v) => v.includes(target.replace('-', ' ')));
          if (!matchVibe) return false;
        }
        const effectiveQuery = (searchTerm || searchQuery).trim().toLowerCase();
        if (effectiveQuery) {
          const matchName = product.name.toLowerCase().includes(effectiveQuery);
          const matchDesc = product.description.toLowerCase().includes(effectiveQuery);
          const matchVibe = (product.vibes || []).some((v) => v.toLowerCase().includes(effectiveQuery));
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(effectiveQuery));
          const matchCat = product.categorySlug.toLowerCase().includes(effectiveQuery);
          const matchRarity = ((product as any).rarity || '').toLowerCase().includes(effectiveQuery);
          if (!matchName && !matchDesc && !matchVibe && !matchTag && !matchCat && !matchRarity) return false;
        }
        if (product.price > priceMax) {
          return false;
        }
        if (inStockOnly && !product.inStock) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'price-asc') return a.price - b.price;
        if (selectedSort === 'price-desc') return b.price - a.price;
        if (selectedSort === 'rating') return b.rating - a.rating;
        if (selectedSort === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    initialProducts,
    selectedCategory,
    selectedRarity,
    selectedVibe,
    searchQuery,
    searchTerm,
    priceMax,
    inStockOnly,
    selectedSort,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedRarity !== 'ALL' ? 1 : 0) +
    (selectedVibe ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceMax < 30000 ? 1 : 0) +
    (searchQuery || searchTerm.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      {/* Page Header */}
      <div className="mb-10 pb-8 border-b-2 border-black dark:border-glitch-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-glitch-magenta text-white text-xs font-mono font-black uppercase tracking-wider mb-2 border-2 border-black shadow-sticker">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTIBLE VAULT</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-gray-950 dark:text-white uppercase tracking-tight">
              {selectedCategory === 'all'
                ? 'ALL 30 POP-CULTURE GRAILS'
                : categories.find((c) => c.slug === selectedCategory)?.name || 'DROP ARCHIVE'}
            </h1>
            <p className="text-xs sm:text-sm font-sans font-medium text-gray-600 dark:text-gray-400 mt-1">
              Displaying {filteredProducts.length} of {initialProducts.length} verified collectibles.
            </p>
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-glitch-lime text-black border-2 border-black font-display font-black text-xs shadow-sticker"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-glitch-magenta text-white flex items-center justify-center font-mono text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="relative inline-block">
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-9 bg-white dark:bg-glitch-card rounded-xl border-2 border-black font-mono text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer shadow-sticker"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    className="bg-white dark:bg-glitch-card text-black dark:text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Dedicated Neo-Pop Search Bar */}
        <div className="space-y-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUrl({ search: searchTerm.trim() ? searchTerm.trim() : null });
            }}
            className="relative flex items-center w-full"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-glitch-magenta">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search desired item by name, vibe (cybercore, y2k...), tag, or keyword..."
              className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border font-display font-bold text-sm sm:text-base text-gray-950 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sticker focus:outline-none focus:ring-2 focus:ring-glitch-magenta transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    updateUrl({ search: null });
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-glitch-dark text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 rounded-xl bg-glitch-lime hover:bg-glitch-yellow text-black font-display font-black text-xs sm:text-sm uppercase border-2 border-black shadow-sticker transition-all"
              >
                SEARCH
              </button>
            </div>
          </form>

          {/* Quick Filter Keyword Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 text-xs">
            <span className="font-mono text-[11px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
              QUICK SEARCH:
            </span>
            {['Blind Box', 'Vinyl Grail', 'Trading Card', 'Charm', 'Keycap', 'Plush', 'Cybercore', 'Kawaii'].map((tag) => {
              const isActive = (searchTerm || searchQuery).toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setSearchTerm('');
                      updateUrl({ search: null });
                    } else {
                      setSearchTerm(tag);
                      updateUrl({ search: tag });
                    }
                  }}
                  className={`px-3 py-1 rounded-xl font-mono text-[11px] font-bold border-2 border-black whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-glitch-yellow text-black shadow-sticker -translate-y-0.5'
                      : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-300 hover:bg-glitch-yellow hover:text-black shadow-xs'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pt-1">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-tight shrink-0 transition-all border-2 border-black ${
              selectedCategory === 'all'
                ? 'bg-glitch-lime text-black shadow-sticker -translate-y-0.5'
                : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 shadow-sticker'
            }`}
          >
            All Drops ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-tight shrink-0 transition-all border-2 border-black ${
                selectedCategory === cat.slug
                  ? 'bg-glitch-lime text-black shadow-sticker -translate-y-0.5'
                  : 'bg-white dark:bg-glitch-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 shadow-sticker'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active Filter Chips */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              <span className="text-[11px] font-mono font-bold text-gray-400">
                ACTIVE FILTERS:
              </span>

              {(searchQuery || searchTerm.trim()) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-glitch-lime text-black font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <Search className="w-3.5 h-3.5" />
                  <span>SEARCH: &ldquo;{searchTerm || searchQuery}&rdquo;</span>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      updateUrl({ search: null });
                    }}
                    aria-label="Remove search filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-glitch-yellow text-black font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <span>CATEGORY: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                  <button onClick={() => handleCategorySelect('all')} aria-label="Remove category filter">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedRarity !== 'ALL' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-glitch-magenta text-white font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <span>RARITY: {selectedRarity}</span>
                  <button onClick={() => handleRaritySelect('ALL')} aria-label="Remove rarity filter">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedVibe && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-glitch-cyan text-black font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <span>VIBE: #{selectedVibe}</span>
                  <button onClick={() => updateUrl({ vibe: null })} aria-label="Remove vibe filter">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-glitch-lime text-black font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <span>IN STOCK ONLY</span>
                  <button onClick={handleToggleInStock} aria-label="Remove in stock filter">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {priceMax < 30000 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-glitch-card text-black dark:text-white font-mono text-xs font-bold border-2 border-black shadow-sticker">
                  <span>UNDER {formatPrice(priceMax)}</span>
                  <button onClick={() => handlePriceChange(30000)} aria-label="Reset max price filter">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-glitch-magenta hover:underline ml-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET ALL</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Desktop Sticky Sidebar (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-7 sticky top-24 self-start p-5 rounded-3xl bg-white dark:bg-glitch-card border-2 border-black shadow-sticker">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-glitch-border">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-black dark:text-white">
              DROP FILTERS
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-mono font-bold text-glitch-magenta hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Rarity Tier Selector */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-black uppercase text-glitch-magenta dark:text-glitch-lime">
              // RARITY TIER
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {RARITY_OPTIONS.map((r) => {
                const isSelected = selectedRarity === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRaritySelect(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all border-2 border-black ${
                      isSelected
                        ? 'bg-glitch-magenta text-white shadow-sticker -translate-y-0.5'
                        : 'bg-gray-50 dark:bg-glitch-dark text-black dark:text-white hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-gray-500">MAX BUDGET</span>
              <span className="text-black dark:text-glitch-lime font-black">
                {formatPrice(priceMax)}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={priceMax}
              onChange={(e) => handlePriceChange(parseInt(e.target.value))}
              className="w-full accent-glitch-magenta cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>$10</span>
              <span>$300</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t-2 border-black/10 dark:border-white/10">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="font-mono text-xs font-bold text-black dark:text-white">
                In Stock Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={handleToggleInStock}
                className="w-4 h-4 rounded accent-glitch-magenta cursor-pointer"
              />
            </label>
          </div>

          {/* GlitchBlob Mascot in Sidebar */}
          <div className="pt-4 border-t-2 border-black/10 dark:border-white/10 flex flex-col items-center">
            <GlitchBlobMascot emotion="peeking" size="sm" speechText="HUNT EM ALL!" />
          </div>
        </aside>

        {/* Products Grid (9 Cols) */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-glitch-card border-3 border-black shadow-sticker-xl space-y-4">
              <GlitchBlobMascot emotion="sad" size="md" speechText="NO MATCHES!" />
              <h3 className="font-display font-black text-xl text-black dark:text-white uppercase">
                {searchTerm || searchQuery ? (
                  <>NO COLLECTIBLES MATCH &ldquo;{searchTerm || searchQuery}&rdquo;</>
                ) : (
                  'NO COLLECTIBLES MATCH YOUR FILTER'
                )}
              </h3>
              <p className="text-xs font-mono text-gray-500 max-w-sm mx-auto">
                {searchTerm || searchQuery
                  ? 'Try searching by a different name, vibe, or click one of our popular collectible categories below:'
                  : 'Try widening your budget or clearing the rarity and vibe selections.'}
              </p>
              {(searchTerm || searchQuery) && (
                <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-md mx-auto">
                  {['Blind Box', 'Vinyl', 'Trading Card', 'Charm', 'Keycap', 'Plush'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSearchTerm(kw);
                        updateUrl({ search: kw });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-glitch-yellow hover:bg-glitch-lime text-black font-mono text-xs font-bold border-2 border-black shadow-sticker transition-transform hover:-translate-y-0.5"
                    >
                      Search &ldquo;{kw}&rdquo;
                    </button>
                  ))}
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 rounded-2xl bg-glitch-lime text-black font-display font-black text-xs uppercase border-2 border-black shadow-sticker hover:bg-glitch-magenta hover:text-white transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative z-10 bg-white dark:bg-glitch-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl border-t-3 border-black"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="font-display font-black text-base uppercase text-black dark:text-white">
                  DROP FILTERS
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-xl border-2 border-black bg-white text-black"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Rarity */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-black uppercase text-glitch-magenta">
                  RARITY TIER
                </h4>
                <div className="flex flex-wrap gap-2">
                  {RARITY_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRaritySelect(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-black ${
                        selectedRarity === r ? 'bg-glitch-magenta text-white' : 'bg-white text-black'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>Max Budget</span>
                  <span className="font-black text-glitch-magenta">{formatPrice(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="w-full accent-glitch-magenta"
                />
              </div>

              {/* Apply */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-glitch-lime text-black border-2 border-black font-display font-black text-xs uppercase shadow-sticker"
              >
                APPLY FILTERS ({filteredProducts.length} GRAILS)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
