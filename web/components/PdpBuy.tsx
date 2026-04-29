'use client';
import { useCart } from '@/lib/cart-store';
import { useState } from 'react';

export default function PdpBuy({ productId, stock }: { productId: string; stock: number }) {
  const add = useCart(s => s.add);
  const setOpen = useCart(s => s.setOpen);
  const [qty, setQty] = useState(1);
  const max = Math.max(1, stock);

  return (
    <div className="flex gap-3 items-stretch">
      <div className="inline-flex items-center bg-surface rounded-full px-1.5">
        <button
          type="button"
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="w-9 h-12 text-ink font-semibold text-base"
          aria-label="Decrease quantity"
        >−</button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={max}
          value={qty}
          onChange={e => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))}
          className="w-10 text-center bg-transparent border-0 text-sm"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => setQty(q => Math.min(max, q + 1))}
          className="w-9 h-12 text-ink font-semibold text-base"
          aria-label="Increase quantity"
        >+</button>
      </div>
      <button
        type="button"
        onClick={() => { add(productId, qty); setOpen(true); }}
        className="btn btn-green flex-1 h-12"
      >
        Add to bag <span aria-hidden>→</span>
      </button>
    </div>
  );
}
