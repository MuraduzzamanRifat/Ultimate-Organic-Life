import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/queries';
import type { SortKey } from '@/types';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const data = await listProducts({
    cat:  url.searchParams.get('cat')  ?? undefined,
    q:    url.searchParams.get('q')    ?? undefined,
    sale: url.searchParams.get('sale') === '1',
    sort: (url.searchParams.get('sort') as SortKey) ?? undefined,
    take: Number(url.searchParams.get('take') ?? 60),
    skip: Number(url.searchParams.get('skip') ?? 0),
  });
  return NextResponse.json(data, {
    headers: { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=60' },
  });
}
