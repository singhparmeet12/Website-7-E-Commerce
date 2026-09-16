import { prisma } from '@/lib/prisma';
import { parseProduct } from '@/lib/utils';
import { HeroCollage } from '@/components/home/HeroCollage';
import { VibeFilter } from '@/components/home/VibeFilter';
import { HomeProductGallery } from '@/components/home/HomeProductGallery';
import { GlitchNewsletter } from '@/components/home/GlitchNewsletter';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch products and categories from SQLite database
  const [rawProducts, rawCategories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const allProducts = rawProducts.map(parseProduct);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Y2K Sticker Hero with Angled Cards & Mascot */}
      <HeroCollage />

      {/* 2. Shop By Vibe Filter with Dynamic Shuffle */}
      <VibeFilter products={allProducts} />

      {/* 3. Complete Catalog Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <HomeProductGallery
          products={allProducts}
          categories={rawCategories as any}
        />
      </section>

      {/* 5. Early Access Newsletter & Discount Code */}
      <GlitchNewsletter />
    </div>
  );
}
