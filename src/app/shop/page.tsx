import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { parseProduct } from '@/lib/utils';
import { ShopPageClient } from '@/components/shop/ShopPageClient';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [rawProducts, rawCategories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const parsedProducts = rawProducts.map(parseProduct);

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent-cobalt" />
          <p className="font-mono text-xs uppercase tracking-wider text-studio-500">
            Initializing hardware catalog...
          </p>
        </div>
      }
    >
      <ShopPageClient
        initialProducts={parsedProducts}
        categories={rawCategories as any}
      />
    </Suspense>
  );
}
