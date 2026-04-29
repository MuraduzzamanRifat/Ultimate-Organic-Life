import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { computeTotals } from '@/lib/totals';

/* ---------- Validation ---------- */
const Body = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  ship: z.object({
    fullName: z.string().min(1),
    line1:    z.string().min(1),
    line2:    z.string().optional(),
    city:     z.string().min(1),
    state:    z.string().min(1),
    zip:      z.string().min(1),
    country:  z.string().default('US'),
    phone:    z.string().optional(),
  }),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  paymentMethod:  z.enum(['COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD', 'STRIPE']).default('COD'),
  items: z.array(z.object({ id: z.string(), qty: z.number().int().positive() })).min(1),
});

const NUMBER = () =>
  'GK-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export async function POST(req: Request) {
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }); }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;

  // Re-fetch products from DB (never trust client price/stock)
  const products = await prisma.product.findMany({
    where: { id: { in: body.items.map(i => i.id) } },
  });
  if (products.length !== body.items.length) {
    return NextResponse.json({ error: 'product_missing' }, { status: 400 });
  }

  const lines = body.items.map(i => {
    const p = products.find(x => x.id === i.id)!;
    return { product: p, qty: i.qty };
  });

  // Stock check
  for (const { product, qty } of lines) {
    if (qty > product.stock) {
      return NextResponse.json({ error: 'out_of_stock', productId: product.id }, { status: 409 });
    }
  }

  const subtotal = lines.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const t = computeTotals(subtotal, { express: body.shippingMethod === 'express' });

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: NUMBER(),
        email: body.email,
        phone: body.phone,
        subtotal: t.subtotal,
        shippingCost: t.shipping,
        tax: t.tax,
        total: t.total,
        currency: 'USD',
        paymentMethod: body.paymentMethod,
        paid: false, // COD/wallet flows verify async; card/stripe set true after webhook
        shippingName: body.ship.fullName,
        shippingPhone: body.ship.phone,
        shippingLine1: body.ship.line1,
        shippingLine2: body.ship.line2,
        shippingCity: body.ship.city,
        shippingState: body.ship.state,
        shippingZip: body.ship.zip,
        shippingCountry: body.ship.country,
        items: {
          create: lines.map(({ product, qty }) => ({
            productId: product.id,
            title: product.title,
            unitPrice: product.price,
            qty,
          })),
        },
      },
    });
    // Decrement stock
    await Promise.all(lines.map(({ product, qty }) =>
      tx.product.update({ where: { id: product.id }, data: { stock: { decrement: qty } } })
    ));
    return created;
  });

  // TODO: kick off payment flow per method (bKash redirect, SSLCommerz, Stripe Checkout)
  // TODO: queue email (Resend) + WhatsApp confirmation

  return NextResponse.json({ ok: true, number: order.number, id: order.id }, { status: 201 });
}
