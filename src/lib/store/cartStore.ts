import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types';

export const FREE_SHIPPING_THRESHOLD = 4500; // $45.00 in cents
export const STANDARD_SHIPPING_FEE = 499; // $4.99 in cents

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercentage: number; // e.g. 10 for 10%
  hasHydrated: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  setHasHydrated: (state: boolean) => void;

  // Computed helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: '',
      discountPercentage: 0,
      hasHydrated: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (itemData) => {
        const compositeId = `${itemData.productId}-${itemData.color}-${itemData.size}`;
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === compositeId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const currentQty = updated[existingIndex].quantity;
            const newQty = Math.min(currentQty + itemData.quantity, itemData.maxStock || 99);
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: newQty,
            };
            return { items: updated, isOpen: true };
          } else {
            return {
              items: [...state.items, { ...itemData, id: compositeId }],
              isOpen: true,
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxStock || 99),
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: '', discountPercentage: 0 });
      },

      applyPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();
        if (
          normalized === 'GLITCH10' ||
          normalized === 'STUDIO10' ||
          normalized === 'NEOPOP10' ||
          normalized === 'VIRAL10' ||
          normalized === 'POP10'
        ) {
          set({ promoCode: normalized, discountPercentage: 10 });
          return { success: true, message: '10% GLITCHPOP drop discount applied!' };
        } else if (normalized === 'FREESHIP') {
          set({ promoCode: normalized, discountPercentage: 0 });
          return { success: true, message: 'Free Bubble Mailer dispatch unlocked!' };
        } else {
          return { success: false, message: 'Invalid code. Use GLITCH10 for 10% off.' };
        }
      },

      removePromoCode: () => {
        set({ promoCode: '', discountPercentage: 0 });
      },

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const percent = get().discountPercentage;
        return Math.round((subtotal * percent) / 100);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        const promo = get().promoCode;
        if (subtotal === 0) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD || promo === 'FREESHIP') {
          return 0;
        }
        return STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'glitchpop_cart_v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercentage: state.discountPercentage,
      }),
    }
  )
);
