'use client';
import { useCart } from '@/lib/cart-store';

type Props = {
  id: string;
  qty?: number;
  className?: string;
  label?: string;
  variant?: 'pill' | 'block';
};

export default function AddToBag({ id, qty = 1, className = '', label = 'Add', variant = 'pill' }: Props) {
  const add = useCart(s => s.add);
  const setOpen = useCart(s => s.setOpen);
  const cls =
    variant === 'block'
      ? 'btn btn-green w-full ' + className
      : 'px-4 py-2 rounded-full bg-green-pale text-green-dark text-[11px] font-bold tracking-wider uppercase hover:bg-green hover:text-white transition-colors ' + className;
  return (
    <button
      type="button"
      className={cls}
      onClick={(e) => { e.preventDefault(); add(id, qty); setOpen(true); }}
    >
      {label}
    </button>
  );
}
