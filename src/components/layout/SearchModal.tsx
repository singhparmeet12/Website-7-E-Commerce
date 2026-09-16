'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  price: number;
  categorySlug: string;
  images: string;
  rarity?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Holographic Trading Card',
  'Cyber Demon Vinyl',
  'Y2K Star Acrylic Charm',
  'Mecha Blind Box',
  'Pixel Ghost Keycap',
  'Glow Matrix Display',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-white dark:bg-glitch-card rounded-2xl border-2 border-black dark:border-glitch-border shadow-sticker-xl overflow-hidden z-10"
          >
            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(query);
              }}
              className="flex items-center px-5 py-4 border-b-2 border-black dark:border-glitch-border bg-glitch-lime/20 dark:bg-glitch-dark gap-3"
            >
              <Search className="w-5 h-5 text-glitch-magenta flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search blind boxes, vinyl grails, charms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent font-display font-bold text-sm text-glitch-dark dark:text-white placeholder:text-gray-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-gray-400 hover:text-black dark:hover:text-white"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {loading && <Loader2 className="w-4 h-4 animate-spin text-glitch-magenta flex-shrink-0" />}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border-2 border-black bg-white dark:bg-glitch-dark text-gray-700 dark:text-gray-300 hover:bg-glitch-magenta hover:text-white transition-colors shadow-sticker"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Content Area */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
              {!query.trim() && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-glitch-magenta dark:text-glitch-lime block">
                    ★ TRENDING GRAILS & SEARCHES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white dark:bg-glitch-dark text-black dark:text-white border-2 border-black dark:border-glitch-border hover:bg-glitch-yellow hover:text-black transition-transform hover:-translate-y-0.5 shadow-sticker"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results List */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-glitch-magenta dark:text-glitch-lime block mb-2">
                    FOUND COLLECTIBLES ({results.length})
                  </span>
                  {results.map((product) => {
                    let firstImage = '';
                    try {
                      const imgs = JSON.parse(product.images);
                      firstImage = imgs[0];
                    } catch {
                      firstImage = '';
                    }

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black dark:border-glitch-border bg-white dark:bg-glitch-dark hover:bg-glitch-lime/20 dark:hover:bg-glitch-lime/10 transition-all group shadow-sticker"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-glitch-dark border border-black flex-shrink-0">
                          {firstImage && (
                            <Image
                              src={firstImage}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white group-hover:text-glitch-magenta transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-gray-500 dark:text-glitch-muted capitalize">
                            {product.categorySlug.replace('-', ' ')}
                          </span>
                        </div>
                        <span className="font-mono font-black text-sm text-glitch-dark dark:text-glitch-lime">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {query.trim() && !loading && results.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <GlitchBlobMascot emotion="sad" size="sm" speechText="NO MATCHES FOUND!" />
                  <p className="font-display font-bold text-sm text-gray-900 dark:text-white">
                    No grails found matching &ldquo;{query}&rdquo;
                  </p>
                  <p className="font-mono text-xs text-gray-500">
                    Try searching: vinyl, cards, sticker, charm, or plush.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit(query)}
                    className="px-4 py-2 rounded-xl bg-glitch-lime text-black font-display font-black text-xs uppercase border-2 border-black shadow-sticker hover:bg-glitch-yellow transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Search Entire Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* View All in Catalog Footer */}
              {query.trim() && results.length > 0 && (
                <div className="pt-3 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-gray-500 hidden sm:inline">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold">↵ Enter</kbd> to search all
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit(query)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-glitch-lime hover:bg-glitch-yellow text-black font-display font-black text-xs uppercase border-2 border-black shadow-sticker transition-all flex items-center justify-center gap-2"
                  >
                    <span>View All Results in Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
