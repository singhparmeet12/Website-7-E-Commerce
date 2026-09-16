import { create } from 'zustand';

export interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageSrc: string;
}

interface FlyAnimationStore {
  particles: FlyingParticle[];
  cartBouncing: boolean;
  triggerFly: (startRect: DOMRect | null, imageSrc: string) => void;
  startFlyAnimation: (startRect: DOMRect | null, imageSrc: string) => void;
  removeParticle: (id: string) => void;
  triggerCartBounce: () => void;
}

export const useFlyAnimationStore = create<FlyAnimationStore>((set, get) => ({
  particles: [],
  cartBouncing: false,

  triggerFly: (startRect, imageSrc) => {
    get().startFlyAnimation(startRect, imageSrc);
  },

  startFlyAnimation: (startRect, imageSrc) => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      get().triggerCartBounce();
      return;
    }

    if (!startRect) {
      get().triggerCartBounce();
      return;
    }

    const cartBtn = document.getElementById('nav-cart-btn');
    if (!cartBtn) {
      get().triggerCartBounce();
      return;
    }

    const cartRect = cartBtn.getBoundingClientRect();
    const particleId = `particle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newParticle: FlyingParticle = {
      id: particleId,
      startX: startRect.left + startRect.width / 2 - 24, // center 48px box
      startY: startRect.top + startRect.height / 2 - 24,
      endX: cartRect.left + cartRect.width / 2 - 16,
      endY: cartRect.top + cartRect.height / 2 - 16,
      imageSrc,
    };

    set((state) => ({ particles: [...state.particles, newParticle] }));

    // When particle lands (~650ms), bounce the cart bag icon
    setTimeout(() => {
      get().triggerCartBounce();
      get().removeParticle(particleId);
    }, 700);
  },

  removeParticle: (id) => {
    set((state) => ({
      particles: state.particles.filter((p) => p.id !== id),
    }));
  },

  triggerCartBounce: () => {
    set({ cartBouncing: true });
    setTimeout(() => {
      set({ cartBouncing: false });
    }, 600);
  },
}));
