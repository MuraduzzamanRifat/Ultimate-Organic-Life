import { prisma } from './db';
import type { ProductDetail, ProductSummary, SortKey } from '@/types';

function toSummary(p: any): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    price: p.price,
    oldPrice: p.oldPrice,
    currency: p.currency,
    weight: p.weight,
    origin: p.origin,
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
    category: {
      id: p.category.id,
      slug: p.category.slug,
      name: p.category.name,
      tint: p.category.tint,
    },
    subcat: p.subcat,
    image: p.images?.[0]?.url ?? '',
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export type ListFilters = {
  cat?: string;          // category slug
  q?: string;            // search query
  sale?: boolean;
  sort?: SortKey;
  take?: number;
  skip?: number;
};

export async function listProducts(f: ListFilters = {}): Promise<{ items: ProductSummary[]; total: number }> {
  const where: any = { isActive: true };
  if (f.cat)  where.category  = { slug: f.cat };
  if (f.sale) where.oldPrice  = { not: null };
  if (f.q) {
    const q = f.q;
    where.OR = [
      { title:    { contains: q } },
      { subtitle: { contains: q } },
      { subcat:   { contains: q } },
      { origin:   { contains: q } },
    ];
  }

  const orderBy =
    f.sort === 'newest'     ? { createdAt: 'desc' as const } :
    f.sort === 'price-asc'  ? { price:     'asc'  as const } :
    f.sort === 'price-desc' ? { price:     'desc' as const } :
    f.sort === 'rating'     ? { rating:    'desc' as const } :
                              [{ featured: 'desc' as const }, { createdAt: 'desc' as const }];

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy,
      take: f.take ?? 60,
      skip: f.skip ?? 0,
      include: { category: true, images: { orderBy: { position: 'asc' }, take: 1 } },
    }),
    prisma.product.count({ where }),
  ]);

  return { items: rows.map(toSummary), total };
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images:   { orderBy: { position: 'asc' } },
      tags:     true,
    },
  });
  if (!p) return null;
  return {
    ...toSummary({ ...p, images: p.images.length ? p.images : [{ url: '', alt: '' }] }),
    description: p.description,
    story: p.story,
    producer: p.producer,
    producerSince: p.producerSince,
    producerQuote: p.producerQuote,
    stock: p.stock,
    tags: p.tags.map(t => t.label),
    images: p.images.map(i => i.url),
  };
}

export async function getRelated(productId: string, categoryId: string, limit = 4) {
  const rows = await prisma.product.findMany({
    where: { categoryId, NOT: { id: productId }, isActive: true },
    orderBy: { rating: 'desc' },
    take: limit,
    include: { category: true, images: { orderBy: { position: 'asc' }, take: 1 } },
  });
  return rows.map(toSummary);
}

/** Used by the cart drawer + cart page to hydrate a list of cart line ids. */
export async function getProductsByIds(ids: string[]): Promise<ProductSummary[]> {
  if (!ids.length) return [];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { category: true, images: { orderBy: { position: 'asc' }, take: 1 } },
  });
  return rows.map(toSummary);
}
