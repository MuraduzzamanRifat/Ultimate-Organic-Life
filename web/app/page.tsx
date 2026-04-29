import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { listProducts } from '@/lib/queries';

export const revalidate = 60; // ISR every minute

const TILES = [
  { slug: 'health',  label: 'Health & Strength', desc: 'Supplements, tinctures, collagen', tint: 'border-green' },
  { slug: 'beauty',  label: 'Beauty & Wellness', desc: 'Skincare, hair, essential oils',   tint: 'border-rose' },
  { slug: 'hygiene', label: 'Home & Hygiene',    desc: 'Oral care, soap, deodorants',      tint: 'border-sky' },
  { slug: 'food',    label: 'Food & Drinks',     desc: 'Honey, tea, oil, superfoods',      tint: 'border-green' },
];

export default async function HomePage() {
  const { items: featured } = await listProducts({ sort: 'featured', take: 8 });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-surface px-5 sm:px-12 pt-9 pb-16 overflow-hidden">
        <div aria-hidden className="absolute -top-16 -left-[4%] w-[68%] h-[115%] bg-green rounded-[0_0_90%_28%/0_0_40%_20%] z-0" />
        <div className="relative z-10 max-w-[1360px] mx-auto">
          <div className="bg-paper rounded-xl p-6 sm:p-9 grid sm:grid-cols-[1.2fr_1fr] gap-8 items-center shadow-lg max-w-[920px]">
            <Image
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&q=85&auto=format&fit=crop"
              alt="A family on a green hillside at golden hour."
              width={900} height={900}
              className="rounded-full border-[6px] border-green-pale aspect-square object-cover w-full max-w-[260px] mx-auto"
              priority
            />
            <div>
              <p className="eyebrow">Certified organic · 24 states</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-green-dark leading-tight mb-3.5">
                Wellness starts<br />with what you eat.
              </h1>
              <p className="text-[14.5px] text-ink-2 mb-5 leading-relaxed">
                Organic food, herbal supplements, and clean personal care — delivered.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/c" className="btn btn-green">Shop everything →</Link>
                <Link href="/contact" className="btn btn-outline">Ask a specialist</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TILES.map(t => (
            <Link key={t.slug} href={`/c/${t.slug}`} className={`card p-7 border-t-4 ${t.tint} card-hover flex flex-col gap-1.5`}>
              <strong className="text-[16px] text-ink">{t.label}</strong>
              <small className="text-[12px] text-muted">{t.desc}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 mt-12">
        <header className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured this week</h2>
          <Link href="/c" className="text-[13px] font-semibold text-green-dark hover:text-ink">View all →</Link>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Advisor banner */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-12 mt-14 mb-16">
        <div className="bg-gradient-to-r from-green to-green-dark text-white rounded-xl p-6 sm:p-7 grid sm:grid-cols-[72px_1fr_auto] gap-5 items-center shadow-pop">
          <Image
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85&auto=format&fit=crop"
            alt=""
            width={72} height={72}
            className="w-[72px] h-[72px] object-cover rounded-full border-[3px] border-white/30"
          />
          <div>
            <h3 className="text-white text-[20px] font-bold mb-1">Need advice?</h3>
            <p className="text-white/90 text-[13.5px] m-0 max-w-[60ch]">
              Our in-house specialists will help you choose. Mon–Fri, 10am–6pm ET.
            </p>
          </div>
          <Link href="/contact" className="btn btn-white whitespace-nowrap">Ask a question →</Link>
        </div>
      </section>
    </>
  );
}
