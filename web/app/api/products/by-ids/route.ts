import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/queries';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get('ids') ?? '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (!ids.length) return NextResponse.json([]);
  const rows = await getProductsByIds(ids);
  return NextResponse.json(rows, {
    headers: { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=120' },
  });
}
