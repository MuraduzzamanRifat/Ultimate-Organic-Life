'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { fmtMoney } from '@/lib/format';
import { computeTotals } from '@/lib/totals';
import type { ProductSummary } from '@/types';

type Ship = 'standard' | 'express';
type Pay  = 'COD' | 'BKASH' | 'NAGAD' | 'CARD';

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, hydrated, clear } = useCart();
  const [products, setProducts] = useState<Record<string, ProductSummary>>({});
  const [ship, setShip] = useState<Ship>('standard');
  const [pay,  setPay]  = useState<Pay>('COD');
  const [submitting, setSubmitting] = useState(false);

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
      }).catch(() => {});
  }, [lines, hydrated, products]);

  const items = useMemo(
    () => lines.map(l => ({ product: products[l.id], qty: l.qty }))
               .filter((x): x is { product: ProductSummary; qty: number } => Boolean(x.product)),
    [lines, products],
  );
  const subtotal = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const t = computeTotals(subtotal, { express: ship === 'express' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get('email')),
      phone: String(fd.get('phone') ?? ''),
      ship: {
        fullName: `${fd.get('firstName')} ${fd.get('lastName')}`,
        line1:    String(fd.get('line1')),
        line2:    String(fd.get('line2') ?? ''),
        city:     String(fd.get('city')),
        state:    String(fd.get('state')),
        zip:      String(fd.get('zip')),
        country:  String(fd.get('country') ?? 'US'),
        phone:    String(fd.get('phone') ?? ''),
      },
      shippingMethod: ship,
      paymentMethod: pay,
      items: items.map(({ product, qty }) => ({ id: product.id, qty })),
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Order failed');
      const { number } = await res.json();
      clear();
      router.push(`/thanks/${number}`);
    } catch {
      alert('Sorry — order could not be placed. Try again in a moment.');
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20">
        <div className="card p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Your bag is empty.</h2>
          <Link href="/c" className="btn btn-green inline-flex">Shop the catalogue →</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-[1360px] mx-auto px-5 sm:px-12 pb-20 grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-16 items-start">
      <div className="card p-7 sm:p-9">
        {/* 01 Contact */}
        <Step n="01" title="Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="email" label="Email" type="email" required autoComplete="email" />
            <Field name="phone" label="Phone (WhatsApp ok)" type="tel" autoComplete="tel" />
          </div>
        </Step>

        {/* 02 Shipping */}
        <Step n="02" title="Shipping">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="firstName" label="First name" required autoComplete="given-name" />
            <Field name="lastName" label="Last name"  required autoComplete="family-name" />
          </div>
          <Field name="line1" label="Street address" required autoComplete="street-address" />
          <Field name="line2" label="Apartment, suite (optional)" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="city" label="City" required autoComplete="address-level2" />
            <Field name="state" label="State" required autoComplete="address-level1" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="zip" label="ZIP / Postal" required autoComplete="postal-code" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-[10px] tracking-wider uppercase text-muted font-bold">Country</label>
              <select id="country" name="country" defaultValue="US" autoComplete="country" aria-label="Country" className="px-3.5 py-3 border border-rule rounded-sm text-[14px] outline-none focus:border-green">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="BD">Bangladesh</option>
              </select>
            </div>
          </div>
        </Step>

        {/* 03 Delivery method */}
        <Step n="03" title="Delivery">
          <div className="grid sm:grid-cols-2 gap-3">
            <Radio name="ship" value="standard" checked={ship==='standard'} onChange={() => setShip('standard')} title="Standard" desc="Carbon-neutral · 2–4 days" price={t.subtotal >= 50 ? 'Free over $50' : '$8'} />
            <Radio name="ship" value="express"  checked={ship==='express'}  onChange={() => setShip('express')}  title="Express"  desc="Next day where available" price="+$12" />
          </div>
        </Step>

        {/* 04 Payment */}
        <Step n="04" title="Payment">
          <div className="grid sm:grid-cols-2 gap-3">
            <Radio name="pay" value="COD"   checked={pay==='COD'}   onChange={() => setPay('COD')}   title="Cash on delivery" desc="Pay the courier" />
            <Radio name="pay" value="BKASH" checked={pay==='BKASH'} onChange={() => setPay('BKASH')} title="bKash"  desc="Mobile wallet" />
            <Radio name="pay" value="NAGAD" checked={pay==='NAGAD'} onChange={() => setPay('NAGAD')} title="Nagad"  desc="Mobile wallet" />
            <Radio name="pay" value="CARD"  checked={pay==='CARD'}  onChange={() => setPay('CARD')}  title="Card"   desc="Visa · MC · Amex" />
          </div>

          {pay === 'CARD' && (
            <div className="mt-4">
              <Field name="cardNum" label="Card number" placeholder="1234 1234 1234 1234" autoComplete="cc-number" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="cardExp" label="Expiry" placeholder="MM / YY" autoComplete="cc-exp" />
                <Field name="cardCvc" label="CVC" placeholder="123" autoComplete="cc-csc" />
              </div>
            </div>
          )}
        </Step>

        <label className="flex items-start gap-2.5 my-4 text-[13px] text-muted">
          <input type="checkbox" required className="mt-1 accent-green" />
          <span>I agree to the <a className="border-b border-rule hover:border-ink text-green-dark" href="/policies/terms">terms</a> and <a className="border-b border-rule hover:border-ink text-green-dark" href="/policies/privacy">privacy policy</a>.</span>
        </label>
        <button type="submit" className="btn btn-green w-full disabled:opacity-50" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place order →'}
        </button>
        <p className="text-center text-[10px] tracking-widest uppercase text-muted font-semibold mt-3.5">
          Secure checkout · 128-bit encryption · No details stored
        </p>
      </div>

      <aside className="card p-7 lg:sticky lg:top-24 self-start">
        <h3 className="text-[12px] tracking-widest uppercase font-bold pb-3.5 mb-4 border-b border-rule">In your bag</h3>
        {items.map(({ product, qty }) => (
          <div key={product.id} className="grid grid-cols-[54px_1fr_auto] gap-3.5 items-center py-2.5 border-b border-rule-soft last:border-b-0">
            <span className="relative w-[54px] h-[54px] bg-surface rounded-sm overflow-hidden">
              <Image src={product.image} alt="" fill className="object-cover" sizes="54px" />
              <em className="absolute -top-1.5 -right-1.5 bg-green text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-[10px] font-bold not-italic">{qty}</em>
            </span>
            <div className="min-w-0">
              <strong className="block text-[13.5px] font-semibold truncate">{product.title}</strong>
              <small className="text-[10px] tracking-widest uppercase text-muted font-semibold">{product.subcat}</small>
            </div>
            <b className="text-[14px] text-ink font-bold">{fmtMoney(product.price * qty)}</b>
          </div>
        ))}
        <div className="mt-4 pt-3.5 border-t border-rule">
          <div className="flex justify-between py-1.5 text-sm text-muted"><span>Subtotal</span><b>{fmtMoney(t.subtotal)}</b></div>
          <div className="flex justify-between py-1.5 text-sm text-muted"><span>Shipping</span><b>{t.shipping === 0 ? 'Free' : fmtMoney(t.shipping)}</b></div>
          <div className="flex justify-between py-1.5 text-sm text-muted"><span>Tax</span><b>{fmtMoney(t.tax)}</b></div>
          <div className="flex justify-between py-3.5 mt-2 border-t border-rule font-bold text-[20px] text-green-dark"><span>Total</span><b>{fmtMoney(t.total)}</b></div>
        </div>
      </aside>
    </form>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-rule-soft first:pt-0 last:border-b-0">
      <h3 className="flex items-center gap-3 text-[11px] tracking-widest uppercase text-muted font-bold mb-4">
        <span className="w-7 h-7 bg-green-pale text-green-dark rounded-full inline-flex items-center justify-center text-[12px] font-bold">{n}</span>
        <em className="not-italic text-[18px] font-bold text-ink normal-case tracking-normal">{title}</em>
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({
  name, label, type = 'text', required, autoComplete = 'off', placeholder,
}: {
  name: string; label: string; type?: string; required?: boolean;
  autoComplete?: string; placeholder?: string;
}) {
  const id = `co-${name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] tracking-wider uppercase text-muted font-bold">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="px-3.5 py-3 border border-rule rounded-sm text-[14px] outline-none focus:border-green"
      />
    </div>
  );
}

function Radio({ name, value, checked, onChange, title, desc, price }: { name: string; value: string; checked: boolean; onChange: () => void; title: string; desc: string; price?: string }) {
  return (
    <label className={`flex gap-3.5 items-start p-4 border rounded-sm cursor-pointer transition-colors ${checked ? 'bg-green-pale border-green' : 'border-rule hover:border-green'}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span aria-hidden className={`mt-0.5 w-4 h-4 rounded-full border-2 border-ink relative flex-shrink-0 ${checked ? 'after:content-[""] after:absolute after:inset-[3px] after:rounded-full after:bg-green' : ''}`} />
      <span className="flex-1">
        <strong className="block text-[14px] text-ink font-semibold">{title}</strong>
        <small className="text-[11px] text-muted">{desc}</small>
      </span>
      {price && <span className="text-[13px] font-semibold text-ink">{price}</span>}
    </label>
  );
}
