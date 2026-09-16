'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Zap, ArrowRight, Star, ShieldCheck, Search } from 'lucide-react';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

export function HeroCollage() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        return { hours: (prev.hours + 23) % 24, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b-2 border-black dark:border-glitch-border bg-gradient-to-b from-glitch-lavender/15 via-transparent to-transparent">
      {/* Decorative Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A9FF_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Column: Headline, Vibes & Mascots */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Live Drop Alert Sticker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-black bg-glitch-yellow text-black font-mono text-xs font-black uppercase shadow-sticker transform -rotate-1 hover:rotate-0 transition-transform">
              <span className="w-2.5 h-2.5 rounded-full bg-glitch-magenta animate-ping" />
              <span>SERIES 04 DROP LIVE</span>
              <span className="opacity-40">|</span>
              <span>
                ENDS IN {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            {/* Giant Glitch / Chrome Heading */}
            <div className="relative">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-gray-950 dark:text-white uppercase select-none">
                Y2K POP <br />
                <span className="holo-gradient-text glitch-hover inline-block">CULTURE</span> <br />
                <span className="text-glitch-magenta">HOLY GRAILS.</span>
              </h1>

              {/* Floating Sticker Stamp */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 12 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="hidden sm:flex absolute -top-4 right-4 md:right-16 flex-col items-center justify-center w-20 h-20 rounded-full bg-glitch-lime border-2 border-black shadow-sticker-lg text-black font-mono font-black text-[10px] uppercase text-center leading-tight select-none pointer-events-none"
              >
                <Star className="w-4 h-4 fill-black" />
                <span>100%</span>
                <span>LEGIT</span>
              </motion.div>
            </div>

            {/* Subtext */}
            <p className="font-sans text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium max-w-xl leading-relaxed">
              Unbox blind boxes, hunt rare trading cards, style your phone with Y2K acrylic charms, and build your desk shrine with authentic designer vinyl toys.
            </p>

            {/* Quick Hero Search Bar */}
            <div className="w-full max-w-xl space-y-2 pt-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearch.trim()) {
                    router.push(`/shop?search=${encodeURIComponent(heroSearch.trim())}`);
                  }
                }}
                className="relative flex items-center w-full"
              >
                <Search className="w-5 h-5 absolute left-4 text-glitch-magenta pointer-events-none stroke-[2.5]" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search desired item by name, vibe (e.g. 'blind box', 'vinyl', 'charm')..."
                  className="w-full pl-12 pr-28 sm:pr-32 py-3.5 rounded-2xl bg-white dark:bg-glitch-card border-2 border-black dark:border-glitch-border font-display font-bold text-xs sm:text-sm text-gray-950 dark:text-white placeholder:text-gray-400 shadow-sticker focus:outline-none focus:ring-2 focus:ring-glitch-magenta transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-glitch-lime hover:bg-glitch-yellow text-black font-display font-black text-xs uppercase border-2 border-black shadow-sticker transition-all"
                >
                  SEARCH
                </button>
              </form>

              {/* Popular Search Suggestions */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                <span className="font-mono text-[10px] font-bold text-gray-500 uppercase shrink-0">
                  POPULAR:
                </span>
                {['Blind Box', 'Vinyl Grail', 'Trading Card', 'Charm', 'Keycap'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      router.push(`/shop?search=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-glitch-card hover:bg-glitch-yellow hover:text-black text-gray-700 dark:text-gray-300 font-mono text-[10px] font-bold border border-black/20 dark:border-white/10 shadow-xs whitespace-nowrap transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons + GlitchBlob Mascot */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-2xl bg-glitch-magenta hover:bg-glitch-yellow text-white hover:text-black font-display font-black text-base uppercase border-2 border-black shadow-sticker-lg hover:-translate-y-1 hover:shadow-sticker-xl transition-all flex items-center gap-2"
              >
                <span>EXPLORE ALL 30 GRAILS</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                href="#vibes"
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-glitch-card hover:bg-glitch-lime text-black dark:text-white hover:text-black font-display font-black text-base uppercase border-2 border-black dark:border-glitch-border shadow-sticker hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-glitch-magenta" />
                <span>SHOP BY VIBE</span>
              </Link>

              {/* Mascot Peeking near Hero CTAs */}
              <div className="ml-2 hidden sm:block">
                <GlitchBlobMascot emotion="happy" size="sm" speechText="NO REPLICAS!" />
              </div>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs font-black">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10">
                <ShieldCheck className="w-4 h-4 text-glitch-lime" />
                <span>VERIFIED AUTHENTIC</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10">
                <Flame className="w-4 h-4 text-glitch-magenta" />
                <span>LIMITED RUNS ONLY</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10">
                <Zap className="w-4 h-4 text-glitch-yellow" />
                <span>RESTOCK NOTIFS</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Sticker Collage Cards */}
          <div className="lg:col-span-5 relative w-full overflow-hidden sm:overflow-visible py-4 sm:py-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[480px] mx-auto h-[400px] sm:h-[500px]">
              
              {/* Back Card 1: Trading Card Grail (Rotated -6deg) */}
              <Link href="/products/secret-rare-holographic-cyber-dragon" className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: -12 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-2 left-0 sm:left-2 w-52 sm:w-68 rounded-2xl p-2.5 sm:p-3 bg-white dark:bg-glitch-card border-2 border-black shadow-sticker-lg cursor-pointer z-10 holo-card"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black mb-2.5">
                    <Image
                      src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
                      alt="Cyber Void Dragon Secret Rare Foil"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-glitch-magenta text-white font-mono font-black text-[9px] border border-black uppercase shadow-sticker">
                      GRAIL #01
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs line-clamp-1">Cyber Void Dragon</h4>
                      <span className="font-mono text-[10px] text-gray-500">1st Edition • PSA 10 Gem</span>
                    </div>
                    <span className="font-mono font-black text-sm text-glitch-magenta">$120</span>
                  </div>
                </motion.div>
              </Link>

              {/* Foreground Card 2: Designer Vinyl Toy (Rotated +5deg) */}
              <Link href="/products/cyberpunk-mecha-rabbit-vinyl-art-toy" className="block">
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: 12 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="absolute top-24 sm:top-32 right-0 w-56 sm:w-72 rounded-2xl p-2.5 sm:p-3 bg-white dark:bg-glitch-card border-2 border-black shadow-sticker-xl cursor-pointer z-20"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-black mb-2.5 bg-gray-50">
                    <Image
                      src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
                      alt="Mecha Usagi Vinyl Art Figure"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-glitch-lime text-black font-mono font-black text-[9px] border border-black uppercase shadow-sticker">
                      LIMITED // 250 PCS
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs line-clamp-1">Mecha Usagi Vinyl Art Figure</h4>
                      <span className="font-mono text-[10px] text-glitch-magenta font-bold">#Cybercore</span>
                    </div>
                    <span className="font-mono font-black text-sm text-glitch-dark dark:text-glitch-lime">$78</span>
                  </div>
                </motion.div>
              </Link>

              {/* Bottom Card 3: Y2K Phone Charm Sticker (Rotated -3deg) */}
              <Link href="/products/liquid-metallic-tamagotchi-phone-charm" className="block">
                <motion.div
                  initial={{ opacity: 0, y: 50, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: -3 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute bottom-2 left-2 sm:left-8 w-52 sm:w-64 rounded-2xl p-2 sm:p-2.5 bg-glitch-yellow border-2 border-black shadow-sticker-lg cursor-pointer z-15"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-black flex-shrink-0 bg-white">
                      <Image
                        src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80"
                        alt="Mini Tamagotchi Liquid Shaker Phone Charm"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-black text-[8px] sm:text-[9px] uppercase px-1 rounded bg-black text-glitch-yellow">
                        BESTSELLER
                      </span>
                      <h4 className="font-display font-bold text-xs text-black line-clamp-1 mt-0.5">
                        Mini Tamagotchi Shaker
                      </h4>
                      <span className="font-mono font-black text-xs text-black">$16</span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Floating Holographic Sticker Pin */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 right-2 sm:right-12 z-25 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-glitch-cyan text-black font-mono font-black text-[10px] sm:text-xs border-2 border-black shadow-sticker uppercase"
              >
                100% BLIND BOX PROBABILITY
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
