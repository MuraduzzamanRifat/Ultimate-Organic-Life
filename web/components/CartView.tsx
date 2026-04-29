'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-store';
import { fmtMoney } from '@/lib/format';
import { computeTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/totals';
import type { ProductSummary } from '@/types';

export default function CartView() {
  const { lines, hydrated, setQty, remove } = useCart();
  const [products, setProducts] = useState<Record<string, ProductSummary>>({});

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

  const items = lines
    .map(l => ({ product: products[l.id], qty: l.qty }))
    .filter((x): x is { product: ProductSummary; qty: number } => Boolean(x.product));

  const subtotal = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const t = computeTotals(subtotal);

  if (!hydrated) {
    return <div className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20 text-center text-muted py-16">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20">
        <div className="card p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Your bag is empty.</h2>
          <p className="text-muted mb-6">Browse the catalogue — we have organic food, beauty, hygiene and supplements.</p>
          <Link href="/c" className="btn btn-green inline-flex">Shop everything →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-12 items-start">
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="text-left text-[11px] tracking-widest uppercase text-muted font-bold p-4">Item</th>
              <th className="text-left text-[11px] tracking-widest uppercase text-muted font-bold p-4 hidden sm:table-cell">Unit</th>
              <th className="text-left text-[11px] tracking-widest uppercase text-muted font-bold p-4">Qty</th>
              <th className="text-right text-[11px] tracking-widest uppercase text-muted font-bold p-4">Total</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {items.map(({ product, qty }) => (
              <tr key={product.id} className="border-t border-rule-soft">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/p/${product.slug}`}>
                      <Image src={product.image} alt="" width={64} height={64} className="rounded-sm object-cover" />
                    </Link>
                    <div>
                      <Link href={`/p/${product.slug}`} className="font-semibold text-ink hover:text-green-dark">{product.title}</Link>
                      <small className="block text-[11px] tracking-widest uppercase text-muted font-semibold">{product.subcat} · {product.weight}</small>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] hidden sm:table-cell">{fmtMoney(product.price)}</td>
                <td className="p-4">
                  <div className="inline-flex items-center bg-surface rounded-full px-1">
                    <button onClick={() => setQty(product.id, qty - 1)} className="w-8 h-8 text-ink font-semibold" aria-label="Decrease">−</button>
                    <input
                      type="number" min={1} max={product.image ? 999 : 999}
                      value={qty}
                      onChange={e => setQty(product.id, Math.max(1, Number(e.target.value) || 1))}
                      className="w-10 text-center bg-transparent text-[13px] border-0"
                      aria-label="Quantity"
                    />
                    <button onClick={() => setQty(product.id, qty + 1)} className="w-8 h-8 text-ink font-semibold" aria-label="Increase">+</button>
                  </div>
                </td>
                <td className="p-4 text-right font-bold text-green-dark">{fmtMoney(product.price * qty)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => remove(product.id)} className="text-[10px] tracking-widest uppercase text-muted font-semibold hover:text-danger" aria-label="Remove">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="card p-7 lg:sticky lg:top-24 self-start">
        <h3 className="text-[12px] tracking-widest uppercase font-bold pb-3.5 mb-4 border-b border-rule">Order summary</h3>
        <div className="flex justify-between py-1.5 text-sm text-muted"><span>Subtotal</span><b>{fmtMoney(t.subtotal)}</b></div>
        <div className="flex justify-between py-1.5 text-sm text-muted"><span>Shipping</span><b>{t.shipping === 0 ? 'Free' : fmtMoney(t.shipping)}</b></div>
        <p className="text-[12px] text-green-dark font-semibold bg-green-pale px-3.5 py-2.5 rounded-sm my-3">
          {t.freeShipping
            ? 'Complimentary delivery applied.'
            : `Add ${fmtMoney(t.awayFromFreeShipping)} for complimentary delivery.`}
        </p>
        <div className="flex justify-between py-1.5 text-sm text-muted"><span>Estimated tax</span><b>{fmtMoney(t.tax)}</b></div>
        <div className="flex justify-between py-3.5 mt-2 border-t border-rule font-bold text-[20px] text-green-dark"><span>Total</span><b>{fmtMoney(t.total)}</b></div>
        <div className="flex flex-col gap-2.5 mt-2">
          <Link href="/checkout" className="btn btn-green w-full">Proceed to checkout →</Link>
          <Link href="/c" className="btn btn-outline w-full">Continue shopping</Link>
        </div>
        <p className="text-center text-[10px] tracking-widest uppercase text-muted font-semibold mt-5">
          Secure · <span className="px-2 py-0.5 border border-rule rounded">Visa</span> <span className="px-2 py-0.5 border border-rule rounded">MC</span> <span className="px-2 py-0.5 border border-rule rounded">Amex</span> <span className="px-2 py-0.5 border border-rule rounded">bKash</span>
        </p>
      </aside>
    </div>
  );
}
