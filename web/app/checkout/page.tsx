import CheckoutForm from '@/components/CheckoutForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <>
      <header className="text-center px-5 sm:px-12 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-[11px] tracking-widest uppercase text-muted font-semibold mb-4">
          <a href="/" className="hover:text-green-dark">Home</a> <span className="opacity-50">/</span>{' '}
          <a href="/cart" className="hover:text-green-dark">Bag</a> <span className="opacity-50">/</span> Checkout
        </nav>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">Checkout.</h1>
        <p className="text-muted max-w-[58ch] mx-auto">A single page. No hidden steps, no surprise fees.</p>
      </header>
      <CheckoutForm />
    </>
  );
}
