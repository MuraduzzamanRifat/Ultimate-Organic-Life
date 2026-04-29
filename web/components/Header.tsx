import Link from 'next/link';
import CartButton from './CartButton';
import SearchBox from './SearchBox';

const NAV = [
  { href: '/c/health',  label: 'Health & Strength' },
  { href: '/c/beauty',  label: 'Beauty & Wellness' },
  { href: '/c/hygiene', label: 'Home & Hygiene' },
  { href: '/c/food',    label: 'Food & Drinks' },
];

export default function Header() {
  return (
    <>
      {/* Top strip */}
      <div className="bg-ink text-white text-[12.5px]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-12 py-2 flex flex-wrap justify-between gap-4">
          <span><span className="text-green-soft mr-2">●</span>Free delivery on orders over $50 · Carbon-neutral courier</span>
          <span className="hidden sm:flex gap-3 opacity-80">
            <Link href="/store-locator">Store locator</Link><span>·</span>
            <Link href="/track">Track order</Link><span>·</span>
            <Link href="/contact">Help</Link>
          </span>
        </div>
      </div>

      {/* Main row */}
      <header className="sticky top-0 z-30 bg-paper border-b border-rule">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-12 py-4 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto] items-center gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="GreenKart home">
            <span aria-hidden className="inline-flex">
              <svg width={42} height={42} viewBox="0 0 48 48">
                <circle cx={24} cy={24} r={22} fill="#72b93e" />
                <path d="M24 12 C 16 18, 16 30, 24 38 C 32 30, 32 18, 24 12 Z" fill="#fff" />
                <path d="M24 12 L 24 38" stroke="#72b93e" strokeWidth={1.5} />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <b className="text-[22px] font-semibold text-ink">Green<strong className="font-extrabold text-green-dark">Kart</strong></b>
              <small className="text-[10px] tracking-wider text-muted font-medium">created to care</small>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-green-pale inline-flex items-center justify-center" aria-hidden>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#72b93e" strokeWidth={1.8}>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.2 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
              </svg>
            </span>
            <span className="leading-tight">
              <small className="block text-[11px] text-muted font-medium">Place a quick order</small>
              <b className="text-[16px] text-green-dark font-bold">+1 800 123 4567</b>
            </span>
          </div>

          <SearchBox />

          <div className="flex items-center gap-2.5 justify-end">
            <Link href="/account" className="w-10 h-10 rounded-full bg-surface text-ink inline-flex items-center justify-center hover:bg-green-pale hover:text-green-dark transition-colors" aria-label="Account">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} />
              </svg>
            </Link>
            <CartButton />
          </div>
        </div>

        {/* Category chip nav */}
        <nav aria-label="Categories" className="bg-gradient-to-r from-green-pale to-paper border-t border-rule-soft">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-12 py-3 flex gap-2 flex-wrap">
            <Link href="/c" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] font-semibold text-ink hover:bg-paper hover:text-green-dark transition-colors">All</Link>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] font-semibold text-ink hover:bg-paper hover:text-green-dark transition-colors">
                {n.label}
              </Link>
            ))}
            <Link href="/c?sale=1" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] font-bold text-white bg-green hover:bg-green-dark transition-colors ml-auto">
              Promotions
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
