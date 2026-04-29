'use client';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="max-w-[680px] mx-auto px-5 sm:px-12 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">Sorry — an unexpected error occurred.</h1>
      <p className="text-muted mb-8 text-[14px]">{error.message || 'Please try again in a moment.'}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={reset} className="btn btn-green">Try again</button>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </section>
  );
}
