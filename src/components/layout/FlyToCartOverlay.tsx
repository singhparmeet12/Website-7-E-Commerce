'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlyAnimationStore } from '@/lib/store/flyAnimationStore';

export function FlyToCartOverlay() {
  const particles = useFlyAnimationStore((state) => state.particles);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => {
          const midX = (particle.startX + particle.endX) / 2;
          const midY = Math.min(particle.startY, particle.endY) - 60;

          return (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.startX,
                y: particle.startY,
                scale: 1,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [particle.startX, midX, particle.endX],
                y: [particle.startY, midY, particle.endY],
                scale: [1, 1.25, 0.25],
                opacity: [1, 1, 0.2],
                rotate: [0, -15, 20],
              }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-14 h-14 rounded-2xl overflow-hidden border-2 border-black bg-white dark:bg-glitch-card shadow-sticker-pink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={particle.imageSrc}
                alt="Adding collectible grail"
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
