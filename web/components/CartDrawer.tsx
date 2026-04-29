'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { fmtMoney } from '@/lib/format';
import { computeTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/totals';
import { useEffect, useState } from 'react';
import type { ProductSummary } from '@/types';

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, hydrated } = useCart();
  const [products, setProducts] = useState<Record<string, ProductSummary>>({});

  // Hydrate cart-line product details from API whenever lines change.
  useEffect(() => {
    if (!hydrated) return;
    const ids = lines.map(l => l.id).filter(id => !products[id]);
    if (!ids.length) return;
    fetch('/api/products/by-ids?ids=' + encodeURIComponent(ids.join(',')))
      .then(r => r.json())
      .then((rows: ProductSummary[]) => {
        const next = { ...products };
        for (const p of rows) next[p.id] = p;
        setProducts(next);
      })
      .catch(() => {});
  }, [lines, hydrated, products]);

  // Lock body scroll when open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  // Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const items = lines
    .map(l => ({ product: products[l.id], qty: l.qty }))
    .filter((x): x is { product: ProductSummary; qty: number } => Boolean(x.product));

  const subtotal = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const totals = computeTotals(subtotal);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[990] bg-ink/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden
      />
      <aside
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-screen w-full max-w-[400px] z-[1000] bg-paper text-ink flex flex-col shadow-2xl transition-transform duration-500 ease ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex justify-between items-center px-6 py-5 border-b border-rule">
          <span className="text-[15px] font-bold">
            Your bag {totals.subtotal > 0 && <em className="not-italic ml-2 px-2 py-0.5 bg-green text-white text-xs rounded-full">{items.reduce((s, i) => s + i.qty, 0)}</em>}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-surface hover:bg-green-pale hover:text-green-dark text-ink text-xs font-semibold inline-flex items-center justify-center"
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-center text-muted py-16 italic">Your bag is empty.</p>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="grid grid-cols-[52px_1fr_auto] gap-3.5 items-center py-3.5 border-b border-rule-soft">
                <Link href={`/p/${product.slug}`} onClick={() => setOpen(false)}>
                  <Image src={product.image} alt="" width={52} height={52} className="rounded-sm object-cover" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/p/${product.slug}`} onClick={() => setOpen(false)}>
                    <strong className="block text-[13px] text-ink font-semibold truncate">{product.title}</strong>
                  </Link>
                  <span className="block text-[11px] text-muted">{qty} × {fmtMoney(product.price)}</span>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                    <button onClick={() => setQty(product.id, qty - 1)} className="w-6 h-6 rounded-full border border-rule hover:border-green hover:text-green-dark inline-flex items-center justify-center" aria-label="Decrease">−</button>
                    <span className="min-w-[14px] text-center font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="w-6 h-6 rounded-full border border-rule hover:border-green hover:text-green-dark inline-flex items-center justify-center" aria-label="Increase">+</button>
                    <button onClick={() => remove(product.id)} className="ml-auto text-muted text-[10px] tracking-widest uppercase font-semibold hover:text-danger">Remove</button>
                  </div>
                </div>
                <b className="text-[14px] text-green-dark font-bold">{fmtMoney(product.price * qty)}</b>
              </div>
            ))
          )}
        </div>

        <footer className="px-6 py-5 border-t border-rule">
          {/* Free-shipping progress */}
          <div className="mb-4">
            <p className="text-[11px] text-muted mb-2">
              {totals.freeShipping
                ? <span className="text-green-dark font-bold">Free shipping unlocked.</span>
                : <span><strong className="text-green-dark font-semibold">{fmtMoney(totals.awayFromFreeShipping)}</strong> from free shipping</span>}
            </p>
            <div className="h-1.5 bg-rule rounded-full overflow-hidden">
              <div
                className="h-full bg-green transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-baseline mb-4 text-[13px] text-muted">
            <span>Subtotal</span>
            <b className="text-green-dark text-[20px] font-bold">{fmtMoney(subtotal)}</b>
          </div>
          <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-ink w-full mb-2">View bag</Link>
          <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-green w-full">Checkout →</Link>
          <p className="text-center text-[11px] text-muted mt-3">Secure checkout · Encrypted at rest</p>
        </footer>
      </aside>
    </>
  );
}
