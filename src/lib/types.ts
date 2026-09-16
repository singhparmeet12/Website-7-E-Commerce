export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in cents
  compareAtPrice?: number | null; // in cents
  categorySlug: string;
  inStock: boolean;
  stockCount: number;
  images: string; // JSON string array
  colors: string; // JSON string array of ProductColor
  sizes: string; // JSON string array of sizes
  tags: string; // JSON string array of tags
  vibes?: string; // JSON string array of vibes
  rarity?: string; // COMMON | RARE | LIMITED | GRAIL
  rating: number;
  reviewsCount: number;
  materials: string;
  dimensions: string;
  careInstructions: string;
  featured: boolean;
  createdAt: string | Date;
}

export interface ParsedProduct extends Omit<Product, 'images' | 'colors' | 'sizes' | 'tags' | 'vibes'> {
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  tags: string[];
  vibes: string[];
  rarity: 'COMMON' | 'RARE' | 'LIMITED' | 'GRAIL' | string;
  categoryName?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  colorTheme: string;
  iconName: string;
  image: string;
  _count?: {
    products: number;
  };
}

export interface CartItem {
  id: string; // composite key: productId + color + size
  productId: string;
  slug: string;
  name: string;
  price: number; // in cents
  image: string;
  color: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export interface WishlistItem {
  id?: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categorySlug: string;
  rating: number;
}

export interface FlyAnimationState {
  isFlying: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageSrc: string;
}
