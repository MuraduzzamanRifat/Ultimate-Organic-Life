import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="max-w-[680px] mx-auto px-5 sm:px-12 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">Not found.</h1>
      <p className="text-muted mb-8">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/" className="btn btn-green">Back to home →</Link>
    </section>
  );
}
