'use client';

import React, { useState } from 'react';
import { Send, Check, Sparkles, Copy } from 'lucide-react';
import { GlitchBlobMascot } from '@/components/mascot/GlitchBlobMascot';

export function GlitchNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('GLITCH10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-glitch-lime border-b-2 border-black text-glitch-dark relative overflow-hidden">
      {/* Halftone / polka dot background */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border-3 border-black bg-white p-8 sm:p-12 shadow-sticker-xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Text & Mascot */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border-2 border-black bg-glitch-magenta text-white font-mono text-xs font-black uppercase shadow-sticker">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EARLY ACCESS GRAIL RADAR</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight leading-tight">
              NEVER MISS A <span className="text-glitch-magenta">LIMITED DROP</span> AGAIN.
            </h2>

            <p className="font-sans text-sm sm:text-base text-gray-700 font-medium">
              Join 42,000+ collectors. Get 10-minute early drop passwords, blind box restock pings, and exclusive secret discount codes.
            </p>

            {/* Promo Code Copy Pill */}
            <div className="flex items-center gap-3 pt-1">
              <span className="font-mono text-xs font-bold text-gray-600">SECRET SIGNUP CODE:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-black bg-glitch-yellow hover:bg-black hover:text-glitch-yellow text-black font-mono text-xs font-black shadow-sticker transition-all"
              >
                <span>GLITCH10</span>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Right Mascot & Form */}
          <div className="flex flex-col items-center w-full md:w-auto md:min-w-[340px]">
            <div className="mb-2">
              <GlitchBlobMascot
                emotion={submitted ? 'celebrating' : 'happy'}
                size="md"
                speechText={submitted ? 'YOU ARE ON THE LIST!' : 'JOIN THE CREW!'}
              />
            </div>

            {submitted ? (
              <div className="w-full p-4 rounded-2xl border-2 border-black bg-glitch-lime text-center font-display font-black text-sm uppercase shadow-sticker text-black">
                🎉 WELCOME TO THE GLITCHPOP SQUAD! CHECK YOUR INBOX FOR YOUR 10% VOUCHER.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-black bg-gray-50 text-black font-sans text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white shadow-sticker font-bold"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl border-2 border-black bg-glitch-magenta hover:bg-black text-white hover:text-glitch-lime font-display font-black text-xs uppercase shadow-sticker transition-all flex items-center justify-center gap-2"
                >
                  <span>JOIN</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
