const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? 'USD';
const LOCALE   = process.env.NEXT_PUBLIC_LOCALE   ?? 'en-US';

export function fmtMoney(n: number, currency = CURRENCY, locale = LOCALE) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function fmtDate(d: Date | string, locale = LOCALE) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export function discountPct(price: number, oldPrice: number | null) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
