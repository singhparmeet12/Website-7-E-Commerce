import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product, ParsedProduct } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function parseProduct(product: Product): ParsedProduct {
  let images: string[] = [];
  let colors: { name: string; hex: string }[] = [];
  let sizes: string[] = [];
  let tags: string[] = [];
  let vibes: string[] = [];

  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
  } catch {
    images = ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'];
  }

  try {
    colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors || [];
  } catch {
    colors = [{ name: 'Default', hex: '#FF2E93' }];
  }

  try {
    sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes || [];
  } catch {
    sizes = ['Standard'];
  }

  try {
    tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags || [];
  } catch {
    tags = [];
  }

  try {
    vibes = typeof product.vibes === 'string' ? JSON.parse(product.vibes) : (product.vibes as any) || [];
  } catch {
    vibes = [];
  }

  return {
    ...product,
    images,
    colors,
    sizes,
    tags,
    vibes,
    rarity: product.rarity || 'COMMON',
  };
}
