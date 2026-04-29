/**
 * Shared types — the shapes returned by the API for product lists/detail.
 * Keep these aligned with /lib/queries.ts.
 */
export type CategoryRef = {
  id: string;
  slug: string;
  name: string;
  tint: string | null;
};

export type ProductSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  weight: string;
  origin: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  category: CategoryRef;
  subcat: string;
  image: string;     // primary image URL
};

export type ProductDetail = ProductSummary & {
  description: string;
  story: string | null;
  producer: string | null;
  producerSince: string | null;
  producerQuote: string | null;
  stock: number;
  tags: string[];
  images: string[];
};

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
