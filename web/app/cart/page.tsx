import CartView from '@/components/CartView';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your bag', robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <>
      <header className="text-center px-5 sm:px-12 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-[11px] tracking-widest uppercase text-muted font-semibold mb-4">
          <a href="/" className="hover:text-green-dark">Home</a> <span className="opacity-50">/</span> Bag
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">Your bag.</h1>
        <p className="text-muted max-w-[58ch] mx-auto">Review your order. Quantities update immediately.</p>
      </header>
      <CartView />
    </>
  );
}
