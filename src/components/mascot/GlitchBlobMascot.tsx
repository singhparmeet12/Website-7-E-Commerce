'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';

export type MascotEmotion = 'idle' | 'happy' | 'celebrating' | 'sad' | 'peeking';

interface GlitchBlobMascotProps {
  emotion?: MascotEmotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechText?: string;
  className?: string;
  interactive?: boolean;
}

const sizeMap = {
  sm: { width: 48, height: 48, viewBox: '0 0 100 100' },
  md: { width: 80, height: 80, viewBox: '0 0 100 100' },
  lg: { width: 140, height: 140, viewBox: '0 0 100 100' },
  xl: { width: 220, height: 220, viewBox: '0 0 100 100' },
};

export function GlitchBlobMascot({
  emotion = 'idle',
  size = 'md',
  speechText,
  className = '',
  interactive = true,
}: GlitchBlobMascotProps) {
  const currentSize = sizeMap[size];
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const blobGradId = `blobGrad_${safeId}`;
  const antennaeGradId = `antennaeGrad_${safeId}`;

  // Motion variants based on emotion
  const blobVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    happy: {
      y: [0, -12, 0, -8, 0],
      scale: [1, 1.08, 1, 1.05, 1],
      rotate: [0, 4, -4, 2, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    celebrating: {
      y: [0, -18, 0],
      rotate: [-5, 5, -5],
      scale: [1, 1.12, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    sad: {
      y: [0, 4, 0],
      scale: [1, 0.95, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    peeking: {
      x: [0, 8, 0],
      rotate: [10, 15, 10],
      transition: {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 px-3 py-1.5 bg-glitch-lime text-black font-mono text-xs font-black rounded-xl border-2 border-black dark:border-white shadow-sticker uppercase tracking-wider text-center max-w-[200px] z-10"
        >
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-glitch-lime" />
        </motion.div>
      )}

      {/* Mascot Animated Vector Body */}
      <motion.div
        variants={blobVariants}
        animate={emotion}
        whileHover={interactive ? { scale: 1.15, rotate: 6 } : undefined}
        whileTap={interactive ? { scale: 0.92 } : undefined}
        className="relative cursor-pointer"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          viewBox={currentSize.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_6px_0_rgba(0,0,0,0.85)] dark:drop-shadow-[0_0_16px_rgba(255,80,180,0.5)]"
        >
          <defs>
            {/* Luminous High-Visibility Holographic Gradient */}
            <linearGradient id={blobGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3399" />
              <stop offset="42%" stopColor="#FFE600" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            <linearGradient id={antennaeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="100%" stopColor="#D4FF00" />
            </linearGradient>
          </defs>

          {/* Outer Sticker Halo for High Contrast in Dark Mode */}
          <path
            d="M50 20C74 20 88 34 88 56C88 78 72 86 50 86C28 86 12 78 12 56C12 34 26 20 50 20Z"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 dark:opacity-95 transition-opacity"
          />

          {/* Glitch Antenna */}
          <path
            d="M50 24V12M50 12L45 15M50 12L55 9"
            stroke="#12081C"
            strokeWidth="4.5"
            strokeLinecap="round"
            className="dark:stroke-white transition-colors"
          />
          <circle
            cx="50"
            cy="10"
            r="5.5"
            fill="#FFE600"
            style={{ fill: `url(#${antennaeGradId})` }}
            stroke="#12081C"
            strokeWidth="3"
            className="dark:stroke-white transition-colors"
          />

          {/* Main Blob Body - Guaranteed Vibrant Fill with Fallback */}
          <path
            d="M50 20C74 20 88 34 88 56C88 78 72 86 50 86C28 86 12 78 12 56C12 34 26 20 50 20Z"
            fill="#FF4081"
            style={{ fill: `url(#${blobGradId})` }}
            stroke="#12081C"
            strokeWidth="4.5"
            className="dark:stroke-black transition-colors"
          />

          {/* Cheek Glows */}
          <ellipse cx="28" cy="62" rx="7" ry="4.5" fill="#FF1493" opacity="0.85" />
          <ellipse cx="72" cy="62" rx="7" ry="4.5" fill="#FF1493" opacity="0.85" />

          {/* Eyes & Mouth Rendered by Emotion */}
          {emotion === 'happy' && (
            <>
              {/* Happy squint eyes (^ ^) */}
              <path
                d="M30 48C33 42 40 42 43 48"
                stroke="#12081C"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M57 48C60 42 67 42 70 48"
                stroke="#12081C"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Big happy open mouth */}
              <path
                d="M42 57Q50 68 58 57"
                stroke="#12081C"
                strokeWidth="4"
                strokeLinecap="round"
                fill="#FFE600"
              />
            </>
          )}

          {emotion === 'celebrating' && (
            <>
              {/* Pixel/Y2K sunglasses */}
              <rect x="24" y="42" width="22" height="14" rx="3" fill="#12081C" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="54" y="42" width="22" height="14" rx="3" fill="#12081C" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="46" y1="48" x2="54" y2="48" stroke="#12081C" strokeWidth="3.5" />
              <rect x="27" y="44" width="4" height="4" fill="#C6FF3D" />
              <rect x="57" y="44" width="4" height="4" fill="#C6FF3D" />
              {/* Big cool grin */}
              <path
                d="M40 62C44 69 56 69 60 62"
                stroke="#12081C"
                strokeWidth="4"
                strokeLinecap="round"
                fill="#FFE600"
              />
            </>
          )}

          {emotion === 'sad' && (
            <>
              {/* Sad eyes (T_T) */}
              <circle cx="36" cy="50" r="4.5" fill="#12081C" />
              <circle cx="64" cy="50" r="4.5" fill="#12081C" />
              <path d="M36 54V62" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
              <path d="M64 54V62" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
              {/* Frown */}
              <path
                d="M43 64C47 60 53 60 57 64"
                stroke="#12081C"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </>
          )}

          {(emotion === 'idle' || emotion === 'peeking') && (
            <>
              {/* Cute large anime eyes */}
              <circle cx="36" cy="50" r="6" fill="#12081C" />
              <circle cx="34" cy="48" r="2.5" fill="#FFFFFF" />
              <circle cx="38" cy="52" r="1.2" fill="#D4FF00" />

              <circle cx="64" cy="50" r="6" fill="#12081C" />
              <circle cx="62" cy="48" r="2.5" fill="#FFFFFF" />
              <circle cx="66" cy="52" r="1.2" fill="#D4FF00" />

              {/* Cute cat smile */}
              <path
                d="M44 58C46 60 48 60 50 58C52 60 54 60 56 58"
                stroke="#12081C"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Holographic Sparkle Stars with Dark Mode Outline */}
          <path
            d="M78 28L80 24L82 28L86 30L82 32L80 36L78 32L74 30L78 28Z"
            fill="#D4FF00"
            stroke="#12081C"
            strokeWidth="1.5"
            className="dark:stroke-white"
          />
          <path
            d="M20 32L21 29L22 32L25 33L22 34L21 37L20 34L17 33L20 32Z"
            fill="#FFE600"
            stroke="#12081C"
            strokeWidth="1.5"
            className="dark:stroke-white"
          />
        </svg>
      </motion.div>
    </div>
  );
}
