import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProduct, getRelated } from '@/lib/queries';
import { fmtMoney, discountPct } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import PdpBuy from '@/components/PdpBuy';
import PdpGallery from '@/components/PdpGallery';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'Product not found' };
  return {
    title: p.title,
    description: p.subtitle ?? p.description.slice(0, 160),
    openGraph: { images: [p.image] },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();

  const related = await getRelated(p.id, p.category.id);
  const off = discountPct(p.price, p.oldPrice);

  // JSON-LD product schema
  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.title,
    image: p.images.length ? p.images : [p.image],
    description: p.description,
    brand: { '@type': 'Brand', name: p.producer ?? 'GreenKart' },
    offers: {
      '@type': 'Offer',
      priceCurrency: p.currency,
      price: p.price.toFixed(2),
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: p.reviewCount
      ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount }
      : undefined,
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="max-w-[1360px] mx-auto px-5 sm:px-12 pt-5 text-[11px] tracking-widest uppercase text-muted font-semibold">
        <Link href="/" className="hover:text-green-dark">Home</Link>{' '}
        <span className="opacity-50">/</span>{' '}
        <Link href="/c" className="hover:text-green-dark">Shop</Link>{' '}
        <span className="opacity-50">/</span>{' '}
        <Link href={`/c/${p.category.slug}`} className="hover:text-green-dark">{p.category.name}</Link>{' '}
        <span className="opacity-50">/</span>{' '}
        {p.title}
      </nav>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 py-6 sm:py-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-16 items-start">
        <PdpGallery images={p.images.length ? p.images : [p.image]} title={p.title} />

        <div className="lg:sticky lg:top-24 card p-7 sm:p-8 flex flex-col gap-4">
          <p className="text-[12px] text-muted font-medium inline-flex items-center gap-2.5">
            <span className="text-ochre tracking-widest">★★★★★</span>
            <span>{p.rating.toFixed(1)} · {p.reviewCount} review{p.reviewCount === 1 ? '' : 's'}</span>
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">{p.title}</h1>
          {p.subtitle && <p className="text-muted italic text-[15px]">{p.subtitle}</p>}

          <div className="py-3.5 border-y border-rule-soft flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-green-dark">{fmtMoney(p.price)}</span>
            {p.oldPrice && (
              <>
                <s className="text-muted text-[17px] font-medium">{fmtMoney(p.oldPrice)}</s>
                <span className="text-[11px] font-bold tracking-wider uppercase bg-danger text-white px-2.5 py-1 rounded-full">−{off}%</span>
              </>
            )}
          </div>

          {p.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map(t => (
                <span key={t} className="text-[11px] font-semibold text-green-dark px-3 py-1.5 bg-green-pale rounded-full">{t}</span>
              ))}
            </div>
          )}

          <p className="text-[14.5px] text-ink-2 m-0">{p.description}</p>

          <dl className="grid grid-cols-2 gap-3 sm:gap-5 p-5 bg-surface rounded-sm">
            <div><dt className="text-[10px] tracking-widest uppercase text-muted font-bold">Origin</dt><dd className="text-[14px] font-medium m-0">{p.origin}</dd></div>
            <div><dt className="text-[10px] tracking-widest uppercase text-muted font-bold">Weight</dt><dd className="text-[14px] font-medium m-0">{p.weight}</dd></div>
            <div><dt className="text-[10px] tracking-widest uppercase text-muted font-bold">Producer</dt><dd className="text-[14px] font-medium m-0">{p.producer}</dd></div>
            <div><dt className="text-[10px] tracking-widest uppercase text-muted font-bold">Stock</dt><dd className="text-[14px] font-medium text-green-dark m-0">{p.stock} in this batch</dd></div>
          </dl>

          <PdpBuy productId={p.id} stock={p.stock} />

          {p.producer && (
            <figure className="grid grid-cols-[40px_1fr] gap-3.5 p-4 bg-green-pale rounded-sm m-0">
              <span aria-hidden className="w-10 h-10 rounded-full bg-paper text-green-dark inline-flex items-center justify-center text-lg">❦</span>
              <figcaption className="flex flex-col gap-0.5">
                <strong className="text-[13px] text-ink font-bold">{p.producer}</strong>
                <small className="text-[10px] tracking-widest uppercase text-muted font-semibold">{p.producerSince}</small>
                {p.producerQuote && <q className="text-[13px] text-ink-2 italic mt-1.5">{p.producerQuote}</q>}
              </figcaption>
            </figure>
          )}

          <details className="border-b border-rule-soft py-2" open>
            <summary className="cursor-pointer text-[12px] font-bold tracking-wider uppercase text-ink py-2.5 flex justify-between">
              About this product <span className="text-green-dark">›</span>
            </summary>
            <div className="text-[14px] text-ink-2 pb-3.5 leading-relaxed">{p.story ?? p.description}</div>
          </details>
          <details className="border-b border-rule-soft py-2">
            <summary className="cursor-pointer text-[12px] font-bold tracking-wider uppercase text-ink py-2.5 flex justify-between">
              Delivery &amp; returns <span className="text-green-dark">›</span>
            </summary>
            <div className="text-[14px] text-ink-2 pb-3.5 leading-relaxed">
              Free delivery on orders over $50. Ships within 48 hours. Returns accepted within 14 days for non-perishables.
            </div>
          </details>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-16 sm:pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
