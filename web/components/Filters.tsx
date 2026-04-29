'use client';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const CATS = [
  { key: 'all',     label: 'All',                 href: '/c' },
  { key: 'health',  label: 'Health & Strength',   href: '/c/health' },
  { key: 'beauty',  label: 'Beauty & Wellness',   href: '/c/beauty' },
  { key: 'hygiene', label: 'Home & Hygiene',      href: '/c/hygiene' },
  { key: 'food',    label: 'Food & Drinks',       href: '/c/food' },
];

export function ShopSidebar({ activeSlug }: { activeSlug: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const sale = params.get('sale') === '1';

  function setParam(name: string, value: string | null) {
    const sp = new URLSearchParams(params);
    if (value === null) sp.delete(name); else sp.set(name, value);
    const qs = sp.toString();
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`));
  }

  return (
    <aside className="card p-5 sticky top-24 self-start">
      <h6 className="text-[10px] tracking-widest uppercase text-ink font-bold pb-3 mb-3 border-b border-rule">Categories</h6>
      <div className="flex flex-col">
        {CATS.map(c => (
          <Link
            key={c.key}
            href={c.href}
            className={`flex justify-between px-3 py-2 rounded-sm text-[13px] font-medium transition-colors ${activeSlug === c.key ? 'bg-green-pale text-green-dark font-bold' : 'text-ink-2 hover:bg-green-pale hover:text-green-dark'}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <h6 className="text-[10px] tracking-widest uppercase text-ink font-bold pb-3 mb-3 mt-6 border-b border-rule">Filters</h6>
      <label className="flex items-center gap-2 text-[13px] text-ink-2 py-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={sale}
          onChange={e => setParam('sale', e.target.checked ? '1' : null)}
          className="accent-green"
        />
        On sale only
      </label>

      <h6 className="text-[10px] tracking-widest uppercase text-ink font-bold pb-3 mb-3 mt-6 border-b border-rule">Delivery</h6>
      <p className="text-[12px] text-muted leading-relaxed">Free shipping on orders over $50. Carbon-neutral courier.</p>
    </aside>
  );
}

const SORTS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price · Low to high' },
  { value: 'price-desc', label: 'Price · High to low' },
  { value: 'rating',     label: 'Rating' },
];

export function ShopHeader({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const sort = params.get('sort') ?? 'featured';

  function setSort(v: string) {
    const sp = new URLSearchParams(params);
    if (v === 'featured') sp.delete('sort'); else sp.set('sort', v);
    const qs = sp.toString();
    router.push(`${pathname}${qs ? '?' + qs : ''}`);
  }

  return (
    <header className="flex justify-between items-center gap-4 flex-wrap mb-5">
      <span className="text-[13px] text-muted font-medium">{total} item{total === 1 ? '' : 's'}</span>
      <label className="inline-flex items-center gap-2.5 text-[12px] text-muted font-medium">
        Sort by
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-paper border border-rule rounded-full pl-3.5 pr-7 py-1.5 text-[13px] text-ink"
        >
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
    </header>
  );
}
