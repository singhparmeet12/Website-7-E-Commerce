import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { parseProduct } from '@/lib/utils';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Product Not Found — Kōko',
    };
  }

  return {
    title: `${product.name} — Kōko Joyful Homeware`,
    description: product.tagline || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Kōko`,
      description: product.tagline,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const rawProduct = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!rawProduct) {
    notFound();
  }

  // Fetch related products from the same category
  const rawRelated = await prisma.product.findMany({
    where: {
      categorySlug: rawProduct.categorySlug,
      NOT: { id: rawProduct.id },
    },
    take: 4,
  });

  const product = parseProduct(rawProduct);
  const relatedProducts = rawRelated.map(parseProduct);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
