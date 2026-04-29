/**
 * Pure functions for subtotal / shipping / tax / total.
 * Used on the cart page, checkout, drawer, and order creation.
 */
const FREE_SHIPPING = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 50);
const TAX_RATE      = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0.08);
const SHIPPING_FLAT = 8;
const SHIPPING_EXPRESS_EXTRA = 12;

export type Totals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShipping: boolean;
  awayFromFreeShipping: number;
};

export function computeTotals(
  subtotal: number,
  options: { express?: boolean } = {},
): Totals {
  const baseShipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FLAT;
  const shipping = baseShipping + (options.express ? SHIPPING_EXPRESS_EXTRA : 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;
  return {
    subtotal,
    shipping,
    tax,
    total,
    freeShipping: subtotal >= FREE_SHIPPING,
    awayFromFreeShipping: Math.max(0, FREE_SHIPPING - subtotal),
  };
}

export const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING;
