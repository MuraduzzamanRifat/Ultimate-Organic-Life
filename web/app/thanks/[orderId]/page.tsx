import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { fmtMoney } from '@/lib/format';
import type { Metadata } from 'next';

type Params = { orderId: string };

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ThanksPage({ params }: { params: Params }) {
  const order = await prisma.order.findUnique({
    where: { number: params.orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <section className="max-w-[680px] mx-auto px-5 sm:px-12 py-16 sm:py-24 text-center">
      <div aria-hidden className="w-[72px] h-[72px] mx-auto mb-6 rounded-full bg-green text-white inline-flex items-center justify-center text-3xl font-bold">✓</div>
      <p className="eyebrow">Order confirmed</p>
      <h1 className="text-3xl sm:text-5xl font-bold mb-3.5">Thank you.<br />Your order is on its way.</h1>
      <p className="text-muted max-w-[52ch] mx-auto mb-8 text-[15.5px]">A confirmation has been sent to your inbox. We&rsquo;ll email again the morning it ships.</p>

      <div className="card p-7 text-left">
        <h3 className="text-[12px] tracking-widest uppercase font-bold pb-3 mb-4 border-b border-rule">Order summary</h3>
        <Row label="Order number" value={order.number} />
        <Row label="Confirmation sent to" value={order.email} />
        <Row label="Total" value={fmtMoney(order.total, order.currency)} />
        <hr className="my-4 border-rule-soft" />
        {order.items.map(it => (
          <div key={it.id} className="flex justify-between text-[13.5px] mb-2">
            <span className="text-muted">{it.qty} × {it.title}</span>
            <b className="text-ink font-bold">{fmtMoney(it.unitPrice * it.qty, order.currency)}</b>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/c" className="btn btn-green inline-flex">Continue shopping →</Link>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13.5px] mb-2">
      <span className="text-muted">{label}</span>
      <b className="text-ink font-bold">{value}</b>
    </div>
  );
}
