/**
 * Seed script — populates SQLite (or Postgres) with the demo catalogue.
 * Mirrors the static catalogue from /data.js so the dev experience matches.
 *
 * Run: pnpm db:seed   (or npm/yarn equivalent)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'health',  name: 'Health & Strength', tint: '#4f8528' },
  { slug: 'beauty',  name: 'Beauty & Wellness', tint: '#b75b89' },
  { slug: 'hygiene', name: 'Home & Hygiene',    tint: '#2886b5' },
  { slug: 'food',    name: 'Food & Drinks',     tint: '#4f8528' },
];

type Seed = {
  slug: string; cat: string; subcat: string;
  title: string; subtitle: string;
  price: number; old?: number | null; weight: string;
  origin: string; producer: string; producerSince: string; producerQuote: string;
  tags: string[];
  img: string; gallery?: string[];
  description: string; story: string;
  stock: number; rating: number; reviews: number;
  featured: boolean;
};

const PRODUCTS: Seed[] = [
  /* ===== HEALTH ===== */
  { slug: 'marine-collagen-powder', cat: 'health', subcat: 'Collagen',
    title: 'Marine Collagen Powder', subtitle: 'Hydrolysed peptides, unflavoured',
    price: 42, old: 48, weight: '200 g pouch', origin: 'Iceland',
    producer: 'Kalda Naturals', producerSince: 'since 2009',
    producerQuote: 'Nothing is wasted — every fish becomes food, feed or collagen.',
    tags: ['Hydrolysed', 'Single source', 'No fillers'],
    img: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=85&auto=format&fit=crop',
    description: 'Pure hydrolysed marine collagen from sustainably caught Icelandic cod. Dissolves clear in hot or cold liquids.',
    story: 'Kalda Naturals operates a closed-loop cooperative that uses every part of the catch — collagen is extracted from skin and bone that would otherwise be waste.',
    stock: 28, rating: 4.8, reviews: 192, featured: true },

  { slug: 'omega-3-fish-oil', cat: 'health', subcat: 'Omega-3',
    title: 'Omega-3 Fish Oil', subtitle: '60 softgels · 1000 mg',
    price: 24.5, weight: '60 softgels', origin: 'Pacific, USA',
    producer: 'Nord Sea Labs', producerSince: 'since 2003',
    producerQuote: 'Our oil is bottled within ten days of catch.',
    tags: ['Molecularly distilled', 'Third-party tested'],
    img: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=1200&q=85&auto=format&fit=crop',
    description: 'High-concentration EPA/DHA fish oil from small-vessel wild catch. Low-temperature distilled.',
    story: 'Nord Sea Labs purchase only from vessels under 60 ft, all of which land their catch the day it is pulled.',
    stock: 54, rating: 4.7, reviews: 311, featured: false },

  { slug: 'l-tryptophan-capsules', cat: 'health', subcat: 'Amino acids',
    title: 'L-Tryptophan Capsules', subtitle: '500 mg · 30 vegan capsules',
    price: 37.6, weight: '30 capsules', origin: 'Germany',
    producer: 'Freiburg Ferments', producerSince: 'since 2015',
    producerQuote: 'Amino acids from fermentation, never from feathers.',
    tags: ['Plant fermented', 'Vegan'],
    img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=1200&q=85&auto=format&fit=crop',
    description: 'A plant-fermented form of tryptophan, the amino acid that supports restful sleep and balanced mood.',
    story: 'Freiburg Ferments grows its strains on molasses and plant sugars — no animal-derived feedstocks.',
    stock: 36, rating: 4.5, reviews: 88, featured: false },

  { slug: 'red-clover-tincture', cat: 'health', subcat: 'Tinctures',
    title: 'Red Clover Tincture', subtitle: 'Hand-pressed, traditional',
    price: 8.8, weight: '50 ml dropper', origin: 'Vermont',
    producer: 'Windy Hill Apothecary', producerSince: 'since 1994',
    producerQuote: 'We wild-harvest on a thirteen-year rotation.',
    tags: ['Wild-harvested', 'Hand-pressed'],
    img: 'https://images.unsplash.com/photo-1611073615452-4889ae4664bd?w=1200&q=85&auto=format&fit=crop',
    description: 'Traditional red clover tincture made with wild-harvested blossoms and grain alcohol.',
    story: 'Windy Hill works a four-acre meadow on a long rotation to let each patch rest and return.',
    stock: 22, rating: 4.8, reviews: 46, featured: true },

  { slug: 'grass-fed-gelatin', cat: 'health', subcat: 'Collagen',
    title: 'Grass-fed Beef Gelatin', subtitle: 'Unflavoured · for broths & jellies',
    price: 17.8, weight: '400 g', origin: 'Brazil',
    producer: 'Cooperativa Verde', producerSince: 'since 1998',
    producerQuote: 'Grass, sun, and time.',
    tags: ['Grass-fed', 'Pasture-raised'],
    img: 'https://images.unsplash.com/photo-1607602132700-068258431c6c?w=1200&q=85&auto=format&fit=crop',
    description: 'Unflavoured grass-fed beef gelatin for broths, jellies, gummies, or a morning cup.',
    story: 'Cooperativa Verde is a collective of eight family farms working rotational pasture in the Cerrado.',
    stock: 44, rating: 4.7, reviews: 158, featured: false },

  /* ===== BEAUTY ===== */
  { slug: 'lavender-essential-oil', cat: 'beauty', subcat: 'Essential oils',
    title: 'Lavender Essential Oil', subtitle: 'Steam-distilled, Provence',
    price: 5.95, weight: '10 ml', origin: 'Provence, France',
    producer: 'Maison de la Lavande', producerSince: 'since 1972',
    producerQuote: 'The mountain lavender is a different plant, different oil.',
    tags: ['Steam-distilled', 'Single origin'],
    img: 'https://images.unsplash.com/photo-1595392029731-a6a402bb536d?w=1200&q=85&auto=format&fit=crop',
    description: 'Single-origin lavender oil from a seven-hundred-metre Provençal plateau.',
    story: 'Maison de la Lavande keeps its own fields above the tree line.',
    stock: 62, rating: 4.9, reviews: 264, featured: true },

  { slug: 'rose-water-toner', cat: 'beauty', subcat: 'Facial care',
    title: 'Rose Water Toner', subtitle: 'Damask rose, hand-distilled',
    price: 12.4, weight: '250 ml glass', origin: 'Türkiye',
    producer: 'Gül Kooperatifi', producerSince: 'since 1961',
    producerQuote: 'We distil at dawn. That is when the rose gives its best water.',
    tags: ['Hand-distilled', 'Single ingredient'],
    img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=85&auto=format&fit=crop',
    description: 'A simple rose water from Damask blooms hand-distilled at dawn in copper alembics.',
    story: 'The cooperative pools the harvest from thirty family gardens and distils within four hours of picking.',
    stock: 38, rating: 4.8, reviews: 172, featured: false },

  { slug: 'argan-shampoo-bar', cat: 'beauty', subcat: 'Hair',
    title: 'Argan Oil Shampoo Bar', subtitle: 'Plastic-free · cold-process',
    price: 9.8, weight: '95 g bar', origin: 'USA',
    producer: 'Maple Lane Soap Co.', producerSince: 'since 2016',
    producerQuote: 'One bar replaces three plastic bottles, roughly.',
    tags: ['Plastic-free', 'Cold-processed'],
    img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&q=85&auto=format&fit=crop',
    description: 'A cold-process shampoo bar with fair-trade argan oil and a whisper of rosemary.',
    story: 'Poured by hand in small batches and cured for six weeks before it leaves the shelf.',
    stock: 70, rating: 4.7, reviews: 144, featured: false },

  { slug: 'rosehip-day-cream', cat: 'beauty', subcat: 'Facial care',
    title: 'Rosehip Day Cream', subtitle: 'For dry and sensitive skin',
    price: 28, old: 34, weight: '50 ml glass', origin: 'USA',
    producer: 'Still Studio', producerSince: 'since 2019',
    producerQuote: 'Six ingredients, each doing real work.',
    tags: ['Six ingredients', 'Fragrance-free'],
    img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=85&auto=format&fit=crop',
    description: 'A minimalist day cream built on rosehip seed oil and squalane.',
    story: 'Still Studio tests short — every formula lists its ingredients and the reason each one is there.',
    stock: 18, rating: 4.9, reviews: 88, featured: true },

  /* ===== HYGIENE ===== */
  { slug: 'foot-powder', cat: 'hygiene', subcat: 'Foot care',
    title: 'Deodorising Foot Powder', subtitle: 'Zinc + clay + peppermint',
    price: 4.4, weight: '75 g', origin: 'USA',
    producer: 'Bright Ledge Apothecary', producerSince: 'since 2012',
    producerQuote: 'Simple things done well.',
    tags: ['Aluminium-free'],
    img: 'https://images.unsplash.com/photo-1620916297893-4c1a02826f9f?w=1200&q=85&auto=format&fit=crop',
    description: 'A simple zinc-and-clay powder with a clean peppermint finish.',
    story: 'Based on a 1950s formula the founder found in a relative’s store and kept.',
    stock: 90, rating: 4.7, reviews: 214, featured: false },

  { slug: 'bamboo-toothbrush', cat: 'hygiene', subcat: 'Oral care',
    title: 'Bamboo Toothbrush', subtitle: 'Pack of four · soft bristles',
    price: 11.2, weight: 'Pack of 4', origin: 'Vietnam',
    producer: 'Mekong Bamboo Co-op', producerSince: 'since 2014',
    producerQuote: 'Our bamboo renews in five years, not fifty.',
    tags: ['Compostable handle', 'Recyclable packaging'],
    img: 'https://images.unsplash.com/photo-1603729362753-f8162ac6c3df?w=1200&q=85&auto=format&fit=crop',
    description: 'Four soft-bristle bamboo brushes with compostable handles and recyclable packaging.',
    story: 'The cooperative grows its bamboo on non-arable land and rotates harvest annually.',
    stock: 128, rating: 4.6, reviews: 186, featured: false },

  { slug: 'castile-hand-soap', cat: 'hygiene', subcat: 'Bath',
    title: 'Castile Hand Soap', subtitle: 'Olive + laurel · refillable bottle',
    price: 7.6, weight: '500 ml glass', origin: 'Greece',
    producer: 'Evia Soap Works', producerSince: 'since 1987',
    producerQuote: 'If it isn’t simple, we don’t sell it.',
    tags: ['Plant-based', 'Refillable bottle'],
    img: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=1200&q=85&auto=format&fit=crop',
    description: 'A traditional olive-and-laurel castile liquid soap in a refillable glass bottle.',
    story: 'Made from oil pressed within twenty miles of the workshop.',
    stock: 54, rating: 4.8, reviews: 98, featured: true },

  { slug: 'mineral-deodorant', cat: 'hygiene', subcat: 'Deodorant',
    title: 'Mineral Deodorant Stick', subtitle: 'Aluminium-free · 48 hour',
    price: 9, old: 11.5, weight: '70 g stick', origin: 'USA',
    producer: 'Bright Ledge Apothecary', producerSince: 'since 2012',
    producerQuote: 'We wear it ourselves, all summer.',
    tags: ['Aluminium-free', 'Unscented variant'],
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=85&auto=format&fit=crop',
    description: 'A twist-up mineral deodorant built on magnesium hydroxide.',
    story: 'Tested for two summers by the founder’s extended family before the product launched.',
    stock: 46, rating: 4.6, reviews: 132, featured: false },

  /* ===== FOOD ===== */
  { slug: 'wildflower-honey', cat: 'food', subcat: 'Honey',
    title: 'Raw Wildflower Honey', subtitle: 'Unfiltered · hand-extracted',
    price: 14.5, weight: '500 g jar', origin: 'Vermont',
    producer: 'Gibson Apiary', producerSince: 'since 2003',
    producerQuote: 'Every jar tastes of wherever the bees were that week.',
    tags: ['Raw', 'Single origin'],
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=85&auto=format&fit=crop',
    description: 'Unfiltered, unpasteurised wildflower honey from a small Vermont apiary.',
    story: 'Bill Gibson keeps forty hives on a buckwheat meadow.',
    stock: 40, rating: 4.9, reviews: 156, featured: true },

  { slug: 'ceremonial-matcha', cat: 'food', subcat: 'Tea',
    title: 'Ceremonial-grade Matcha', subtitle: 'First harvest · stone-ground',
    price: 28, old: 34, weight: '40 g tin', origin: 'Uji, Japan',
    producer: 'Marufuku Tea Fields', producerSince: 'since 1871',
    producerQuote: 'The first harvest of spring — nothing else will do for tea.',
    tags: ['First harvest', 'Stone-ground'],
    img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=1200&q=85&auto=format&fit=crop',
    description: 'Ceremonial-grade matcha from a seventh-generation Uji family field.',
    story: 'Shade-grown for three weeks, hand-picked, steamed, and stone-ground.',
    stock: 18, rating: 4.9, reviews: 78, featured: true },

  { slug: 'olive-oil-tuscan', cat: 'food', subcat: 'Oils',
    title: 'Cold-pressed Olive Oil', subtitle: 'Single-estate Tuscan',
    price: 24, weight: '500 ml tin', origin: 'Toscana, Italy',
    producer: 'Podere Vecchio', producerSince: 'since 1962',
    producerQuote: 'The mill runs four hours a day in November.',
    tags: ['Single estate', 'Cold-pressed'],
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=85&auto=format&fit=crop',
    description: 'A single-estate Tuscan olive oil, cold-pressed within four hours of picking.',
    story: 'Podere Vecchio presses only one hundred tins a year.',
    stock: 28, rating: 4.8, reviews: 92, featured: true },

  { slug: 'chlorella-powder', cat: 'food', subcat: 'Superfoods',
    title: 'Bio Chlorella Powder', subtitle: 'Single-strain · cracked cell',
    price: 19.9, weight: '150 g jar', origin: 'Taiwan',
    producer: 'Clear Lake Algae', producerSince: 'since 1998',
    producerQuote: 'We grow it in daylight and spring water — that is all.',
    tags: ['Cracked-cell', 'Spring-water grown'],
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85&auto=format&fit=crop',
    description: 'A single-strain chlorella with a mechanically cracked cell wall.',
    story: 'Grown in outdoor tanks fed by an on-site spring.',
    stock: 34, rating: 4.6, reviews: 65, featured: false },

  { slug: 'house-granola', cat: 'food', subcat: 'Breakfast',
    title: 'Granola with Nuts & Berries', subtitle: 'Oven-baked · low sugar',
    price: 8.4, weight: '350 g bag', origin: 'Vermont',
    producer: 'GreenKart Kitchen', producerSince: 'since 2024',
    producerQuote: 'Oats, maple, patience.',
    tags: ['Small-batch', 'Low-sugar'],
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=85&auto=format&fit=crop',
    description: 'Our house granola — oats, maple, pecans, dried blueberries, sea salt.',
    story: 'Baked three mornings a week.',
    stock: 60, rating: 4.7, reviews: 58, featured: false },

  { slug: 'raw-almonds', cat: 'food', subcat: 'Nuts',
    title: 'Organic Raw Almonds', subtitle: 'Single-orchard, California',
    price: 11.6, weight: '300 g bag', origin: 'California',
    producer: 'Capay Organic', producerSince: 'since 1989',
    producerQuote: 'Almonds are a desert crop. Drip-irrigated and honest.',
    tags: ['Certified organic', 'Single orchard'],
    img: 'https://images.unsplash.com/photo-1574493582880-36b22d2c1ef2?w=1200&q=85&auto=format&fit=crop',
    description: 'Unpasteurised raw almonds from a single Capay Valley orchard.',
    story: 'Harvested in September and shipped direct.',
    stock: 44, rating: 4.6, reviews: 42, featured: false },

  { slug: 'turmeric-ginger-tea', cat: 'food', subcat: 'Tea',
    title: 'Turmeric & Ginger Tea', subtitle: 'Loose-leaf · warming blend',
    price: 12.8, weight: '80 g tin', origin: 'USA',
    producer: 'Small Ritual Tea', producerSince: 'since 2017',
    producerQuote: 'Warming, peppery, and bright.',
    tags: ['Hand-blended', 'Caffeine-free'],
    img: 'https://images.unsplash.com/photo-1597317613208-b44e41f83eaa?w=1200&q=85&auto=format&fit=crop',
    description: 'A loose-leaf blend of turmeric, ginger, black pepper, and lemongrass.',
    story: 'Blended weekly in small glass jars.',
    stock: 48, rating: 4.7, reviews: 94, featured: false },
];

async function main() {
  console.log('› clearing existing seed data');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('› seeding categories');
  const cats = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({
      data: { slug: c.slug, name: c.name, tint: c.tint },
    });
    cats.set(c.slug, created.id);
  }

  console.log(`› seeding ${PRODUCTS.length} products`);
  for (const p of PRODUCTS) {
    const categoryId = cats.get(p.cat);
    if (!categoryId) continue;
    await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        story: p.story,
        categoryId,
        subcat: p.subcat,
        price: p.price,
        oldPrice: p.old ?? null,
        weight: p.weight,
        stock: p.stock,
        origin: p.origin,
        producer: p.producer,
        producerSince: p.producerSince,
        producerQuote: p.producerQuote,
        rating: p.rating,
        reviewCount: p.reviews,
        featured: p.featured,
        tags: { create: p.tags.map(label => ({ label })) },
        images: {
          create: [
            { url: p.img, alt: p.title, position: 0 },
            ...(p.gallery ?? []).map((url, i) => ({ url, alt: p.title, position: i + 1 })),
          ],
        },
      },
    });
  }

  console.log('✓ seed complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
