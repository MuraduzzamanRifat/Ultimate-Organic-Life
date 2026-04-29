'use client';
import { useCart } from '@/lib/cart-store';

export default function CartButton() {
  const count = useCart(s => s.count());
  const setOpen = useCart(s => s.setOpen);
  const hydrated = useCart(s => s.hydrated);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Cart, ${count} items`}
      className="relative w-10 h-10 rounded-full bg-green-pale text-ink inline-flex items-center justify-center hover:bg-green hover:text-white transition-colors"
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M5 7h15l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      <em
        className={
          'absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-green text-white border-2 border-paper text-[10px] font-bold not-italic ' +
          (!hydrated || count === 0 ? 'opacity-0' : '')
        }
      >
        {count}
      </em>
    </button>
  );
}
