import Image from 'next/image';
import Link from 'next/link';
import { fmtMoney, discountPct } from '@/lib/format';
import type { ProductSummary } from '@/types';
import AddToBag from './AddToBag';

export default function ProductCard({ product }: { product: ProductSummary }) {
  const off = discountPct(product.price, product.oldPrice);
  return (
    <article className="card card-hover overflow-hidden flex flex-col">
      <Link href={`/p/${product.slug}`} className="relative block aspect-[4/5] bg-surface overflow-hidden">
        {product.oldPrice && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-danger text-white text-[10px] font-bold tracking-wider uppercase">
            −{off}%
          </span>
        )}
        {!product.oldPrice && product.featured && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-green text-white text-[10px] font-bold tracking-wider uppercase">
            New
          </span>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] tracking-wider uppercase text-muted font-semibold">
          {product.subcat} · {product.weight}
        </span>
        <h3 className="text-[15.5px] font-semibold text-ink leading-snug">
          <Link href={`/p/${product.slug}`} className="hover:text-green-dark">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="text-[17px] font-bold text-green-dark">
            {fmtMoney(product.price)}
            {product.oldPrice && (
              <s className="ml-1.5 text-[13px] text-muted font-medium">{fmtMoney(product.oldPrice)}</s>
            )}
          </span>
          <AddToBag id={product.id} />
        </div>
      </div>
    </article>
  );
}
