import Link from 'next/link';

const COLS = [
  {
    h: 'Shop',
    items: [
      { href: '/c/health',  label: 'Health & Strength' },
      { href: '/c/beauty',  label: 'Beauty & Wellness' },
      { href: '/c/hygiene', label: 'Home & Hygiene' },
      { href: '/c/food',    label: 'Food & Drinks' },
      { href: '/c?sale=1',  label: 'Promotions' },
    ],
  },
  {
    h: 'Company',
    items: [
      { href: '/about', label: 'About' },
      { href: '/farms', label: 'Producers' },
      { href: '/journal', label: 'Journal' },
    ],
  },
  {
    h: 'Care',
    items: [
      { href: '/policies/shipping', label: 'Shipping' },
      { href: '/policies/returns',  label: 'Returns' },
      { href: '/contact',           label: 'Contact' },
      { href: '/account',           label: 'Account' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-16 px-5 sm:px-12 pt-14 pb-6">
      <div className="max-w-[1360px] mx-auto grid gap-8 sm:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] mb-8">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2.5 text-white text-[20px] font-bold">
            <span aria-hidden className="w-7 h-7 rounded-full bg-green inline-block" />
            GreenKart
          </span>
          <p className="text-[13px] max-w-[34ch] leading-relaxed">
            One-stop organic shop: certified food, wellness, and natural care from trusted producers.
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {['USDA Organic', 'Non-GMO', 'B-Corp', 'Climate Neutral'].map(c => (
              <span key={c} className="text-[10px] tracking-wider uppercase text-white/75 font-semibold px-2.5 py-1 rounded-full border border-white/15">{c}</span>
            ))}
          </div>
        </div>

        {COLS.map(col => (
          <div key={col.h}>
            <h6 className="text-white text-[12px] font-bold tracking-wider uppercase mb-4">{col.h}</h6>
            {col.items.map(it => (
              <Link key={it.href} href={it.href} className="block text-[13px] py-1 hover:text-green-soft">{it.label}</Link>
            ))}
          </div>
        ))}

        <div>
          <h6 className="text-white text-[12px] font-bold tracking-wider uppercase mb-4">Region</h6>
          <select aria-label="Region" className="w-full bg-white/10 border border-white/15 rounded-full px-3 py-2 text-[13px] text-white">
            <option>United States · USD</option>
            <option>Canada · CAD</option>
            <option>United Kingdom · GBP</option>
            <option>Bangladesh · BDT</option>
          </select>
          <small className="block text-[11px] text-white/55 mt-2">Shipping to 24 states, $50 minimum.</small>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto flex flex-wrap gap-5 justify-between items-center pt-5 border-t border-white/10 text-[11px] text-white/55">
        <small>© 2026 GreenKart Organics · A scaffold demo, not a live retailer.</small>
        <small>
          <Link href="/policies/privacy" className="hover:text-green-soft">Privacy</Link> ·{' '}
          <Link href="/policies/terms" className="hover:text-green-soft">Terms</Link> ·{' '}
          <Link href="/policies/cookies" className="hover:text-green-soft">Cookies</Link>
        </small>
      </div>
    </footer>
  );
}
