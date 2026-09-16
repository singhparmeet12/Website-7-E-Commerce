import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const rarity = searchParams.get('rarity');
    const vibe = searchParams.get('vibe');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'featured';

    // Build Prisma where clause
    const where: any = {};

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (rarity && rarity !== 'ALL') {
      where.rarity = rarity;
    }

    if (vibe && vibe.trim() !== '') {
      where.vibes = { contains: vibe.trim() };
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tagline: { contains: search } },
        { tags: { contains: search } },
        { vibes: { contains: search } },
        { rarity: { contains: search } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    // Determine orderBy
    let orderBy: any = { featured: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}
