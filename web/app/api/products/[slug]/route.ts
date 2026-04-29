import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/queries';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(p, {
    headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
