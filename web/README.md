# GreenKart — `web/`

A Next.js 14 (App Router) scaffold of the multi-page eCommerce platform described in the parent repo's spec. Sits alongside the static demo at the repo root — that one stays deployed to GitHub Pages, this one is the path to a real production build.

## Stack

- **Next.js 14** (App Router) · React 18 · TypeScript
- **Tailwind CSS** with custom design tokens (kelly-green palette, Poppins)
- **Prisma** ORM (SQLite for dev, swap to Postgres for prod)
- **Zustand** for the cart with `localStorage` persistence
- **Zod** for API validation
- Image CDN-friendly (`next/image` configured for Unsplash)

## Quick start

```bash
cd web
cp .env.example .env

npm install            # or pnpm / yarn / bun
npx prisma db push     # creates SQLite at prisma/dev.db
npx tsx prisma/seed.ts # seeds 20 products + 4 categories
npm run dev            # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Seed catalogue |
| `npm run db:studio` | Open Prisma Studio |

## Routes

| Route | Description |
|---|---|
| `/` | Home — hero, category tiles, featured grid, advisor CTA |
| `/c` | Shop all (filters + sort + sale toggle) |
| `/c/[slug]` | Category PLP with `generateStaticParams` |
| `/p/[slug]` | PDP with thumb gallery, qty stepper, accordions, related |
| `/cart` | Cart table, qty editing, summary card |
| `/checkout` | One-page checkout (contact, shipping, delivery, payment) |
| `/thanks/[orderId]` | Order confirmation page |

## API

All under `/app/api/`:

- `GET /api/products?cat&sort&sale&q&take&skip` — paginated PLP feed
- `GET /api/products/[slug]` — full PDP payload
- `GET /api/products/by-ids?ids=…` — used by the cart drawer to hydrate line items
- `POST /api/orders` — validated with Zod, decrements stock atomically, returns `{ number }`

## Architecture notes

**Cart** lives in `localStorage` only — it stores `{ id, qty }` pairs and rehydrates product detail from the API on every page. This keeps the SSR fast (no per-user data on the server) and means a cart can survive across devices once you bolt on auth.

**Orders** are server-validated. Prices, shipping, tax are recomputed from the database on the API side; never trust client-side totals. Stock decrements happen inside a Prisma transaction.

**Free-shipping threshold**, **tax rate**, and **express upgrade** are configurable via `.env`. The math lives in `lib/totals.ts` — single source of truth across cart drawer, cart page, checkout, and order creation.

## What's not in this scaffold yet

These are the next-up items from the spec:

- [ ] Real auth (NextAuth / better-auth) — order history, address book
- [ ] First-party reviews + photo upload
- [ ] Admin dashboard at `/admin` (inventory, orders, customers)
- [ ] Search index (Typesense / Meilisearch) replacing the LIKE-based fallback
- [ ] Payment gateway integrations (bKash, Nagad, SSLCommerz, Stripe)
- [ ] Email + WhatsApp confirmations (Resend, WhatsApp Business API)
- [ ] Stub pages: `/about`, `/farms`, `/journal`, `/contact`, `/account`, `/policies/*`
- [ ] Abandoned-cart recovery jobs (BullMQ + Redis)
- [ ] CMS for journal & banners (Sanity or hand-rolled)

The folder is structured so each of these slots in without rearchitecting.

## Deploying

- **Frontend** — Vercel (drop the `web/` folder in), or any Node host with `npm start`
- **Database** — swap `provider = "sqlite"` to `"postgresql"` in `prisma/schema.prisma`, point `DATABASE_URL` at Neon/Supabase/Railway, run `prisma db push` then `prisma db seed`
- **Images** — already configured for Unsplash; for production move uploads to Cloudflare Images or similar and add the host to `next.config.mjs`
