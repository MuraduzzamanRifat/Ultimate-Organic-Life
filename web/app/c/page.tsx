import { listProducts } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';
import { ShopSidebar, ShopHeader } from '@/components/Filters';
import type { SortKey } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shop everything' };
export const revalidate = 30;

type SP = { sort?: SortKey; sale?: string; q?: string };

export default async function ShopAllPage({ searchParams }: { searchParams: SP }) {
  const { items, total } = await listProducts({
    sort: searchParams.sort,
    sale: searchParams.sale === '1',
    q: searchParams.q,
  });

  return (
    <>
      <header className="text-center px-5 sm:px-12 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-[11px] tracking-widest uppercase text-muted font-semibold mb-4">
          <a href="/" className="hover:text-green-dark">Home</a> <span className="opacity-50">/</span> Shop
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">{searchParams.q ? `Results for “${searchParams.q}”` : 'The catalogue.'}</h1>
        <p className="text-muted max-w-[58ch] mx-auto">Organic food, wellness, beauty and hygiene from small producers.</p>
      </header>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20 grid sm:grid-cols-[260px_1fr] gap-6 sm:gap-10 items-start">
        <ShopSidebar activeSlug="all" />
        <div>
          <ShopHeader total={total} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {items.length === 0 && <p className="text-center text-muted py-16 italic">No products match your filters.</p>}
        </div>
      </section>
    </>
  );
}
