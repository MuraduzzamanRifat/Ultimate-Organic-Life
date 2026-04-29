'use client';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function SearchBox() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = ref.current?.value.trim();
        if (q) router.push(`/c?q=${encodeURIComponent(q)}`);
      }}
      className="col-span-full sm:col-span-1 relative bg-surface rounded-full flex items-center pl-5 pr-1 py-1 max-w-[480px] w-full"
    >
      <input
        ref={ref}
        type="search"
        placeholder="Search 2,000 products…"
        aria-label="Search products"
        className="flex-1 bg-transparent border-0 outline-none py-2 text-sm placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="Search"
        className="w-10 h-10 rounded-full bg-green text-white inline-flex items-center justify-center hover:bg-green-dark transition-colors"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx={11} cy={11} r={7} /><path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}
