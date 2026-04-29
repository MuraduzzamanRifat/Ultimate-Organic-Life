import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { listProducts } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';
import { ShopSidebar, ShopHeader } from '@/components/Filters';
import type { SortKey } from '@/types';
import type { Metadata } from 'next';

type Params = { slug: string };
type SP = { sort?: SortKey; sale?: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return { title: 'Category' };
  return {
    title: cat.name,
    description: `Shop ${cat.name.toLowerCase()} — certified-organic, from small producers.`,
  };
}

export const revalidate = 30;

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map(c => ({ slug: c.slug }));
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) notFound();

  const { items, total } = await listProducts({
    cat: params.slug,
    sort: searchParams.sort,
    sale: searchParams.sale === '1',
  });

  return (
    <>
      <header className="text-center px-5 sm:px-12 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-[11px] tracking-widest uppercase text-muted font-semibold mb-4">
          <a href="/" className="hover:text-green-dark">Home</a>{' '}
          <span className="opacity-50">/</span>{' '}
          <a href="/c" className="hover:text-green-dark">Shop</a>{' '}
          <span className="opacity-50">/</span>{' '}
          {cat.name}
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">{cat.name}.</h1>
        <p className="text-muted max-w-[58ch] mx-auto">
          {total} item{total === 1 ? '' : 's'} in the {cat.name.toLowerCase()} category. Certified, traceable, delivered.
        </p>
      </header>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20 grid sm:grid-cols-[260px_1fr] gap-6 sm:gap-10 items-start">
        <ShopSidebar activeSlug={params.slug} />
        <div>
          <ShopHeader total={total} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {items.length === 0 && <p className="text-center text-muted py-16 italic">Nothing here yet.</p>}
        </div>
      </section>
    </>
  );
}
