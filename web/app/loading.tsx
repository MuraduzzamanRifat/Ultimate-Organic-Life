export default function Loading() {
  return (
    <div className="max-w-[1360px] mx-auto px-5 sm:px-12 py-32 text-center text-muted">
      <div aria-hidden className="inline-block w-8 h-8 border-2 border-rule border-t-green rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading…</p>
    </div>
  );
}
