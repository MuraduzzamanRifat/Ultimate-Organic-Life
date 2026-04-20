/* ============================================================
   GreenKart — bright health-store interactions
   Mega mini cards, cart drawer with free-shipping progress,
   toast, category chips.
   ============================================================ */

const PRODUCTS = [
  /* Health & Strength */
  { id: 1, cat: 'health', title: 'Pork gelatin 400g',
    img: 'https://images.unsplash.com/photo-1607602132700-068258431c6c?w=400&q=85&auto=format&fit=crop',
    price: 17.80, old: null },
  { id: 2, cat: 'health', title: 'Red clover herbal tincture 50ml',
    img: 'https://images.unsplash.com/photo-1611073615452-4889ae4664bd?w=400&q=85&auto=format&fit=crop',
    price: 8.80, old: null },
  { id: 3, cat: 'health', title: 'L-tryptophan 30 capsules',
    img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=85&auto=format&fit=crop',
    price: 37.60, old: null },
  { id: 4, cat: 'health', title: 'Bach flower drops — Quit Smoking',
    img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=85&auto=format&fit=crop',
    price: 13.00, old: null },
  { id: 5, cat: 'health', title: 'Marine collagen powder 200g',
    img: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=85&auto=format&fit=crop',
    price: 42.00, old: 48.00 },
  { id: 6, cat: 'health', title: 'Omega-3 fish oil 60 softgels',
    img: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400&q=85&auto=format&fit=crop',
    price: 24.50, old: null },

  /* Beauty & Wellness */
  { id: 10, cat: 'beauty', title: 'Lavender essential oil 10ml',
    img: 'https://images.unsplash.com/photo-1595392029731-a6a402bb536d?w=400&q=85&auto=format&fit=crop',
    price: 5.95, old: null },
  { id: 11, cat: 'beauty', title: 'Herbal hair dye — light brown 70g',
    img: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=85&auto=format&fit=crop',
    price: 7.00, old: null },
  { id: 12, cat: 'beauty', title: 'Rose water toner 250ml',
    img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=85&auto=format&fit=crop',
    price: 12.40, old: null },
  { id: 13, cat: 'beauty', title: 'Argan oil shampoo bar',
    img: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=85&auto=format&fit=crop',
    price: 9.80, old: null },

  /* Home & Hygiene */
  { id: 20, cat: 'hygiene', title: 'Deodorizing foot powder 75g',
    img: 'https://images.unsplash.com/photo-1620916297893-4c1a02826f9f?w=400&q=85&auto=format&fit=crop',
    price: 4.40, old: null },
  { id: 21, cat: 'hygiene', title: 'Bamboo toothbrush, pack of 4',
    img: 'https://images.unsplash.com/photo-1603729362753-f8162ac6c3df?w=400&q=85&auto=format&fit=crop',
    price: 11.20, old: null },
  { id: 22, cat: 'hygiene', title: 'Natural hand soap 500ml',
    img: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=85&auto=format&fit=crop',
    price: 7.60, old: null },
  { id: 23, cat: 'hygiene', title: 'Mineral deodorant stick',
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=85&auto=format&fit=crop',
    price: 9.00, old: 11.50 },

  /* Food & Drinks */
  { id: 30, cat: 'food', title: 'Bio chlorella powder 150g',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=85&auto=format&fit=crop',
    price: 19.90, old: null },
  { id: 31, cat: 'food', title: 'Raw wildflower honey 500g',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=85&auto=format&fit=crop',
    price: 14.50, old: null },
  { id: 32, cat: 'food', title: 'Ceremonial-grade matcha 40g',
    img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=85&auto=format&fit=crop',
    price: 28.00, old: 34.00 },
  { id: 33, cat: 'food', title: 'Cold-pressed olive oil 500ml',
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=85&auto=format&fit=crop',
    price: 16.80, old: null },
  { id: 34, cat: 'food', title: 'Granola with nuts & berries 350g',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=85&auto=format&fit=crop',
    price: 8.40, old: null },
  { id: 35, cat: 'food', title: 'Organic almonds, raw 300g',
    img: 'https://images.unsplash.com/photo-1574493582880-36b22d2c1ef2?w=400&q=85&auto=format&fit=crop',
    price: 11.60, old: null },
];

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => `$${n.toFixed(2)}`;

/* ---------- Mini product card (for mega blocks) ---------- */
function miniTpl(p) {
  const priceHtml = p.old
    ? `${fmt(p.price)}<s>${fmt(p.old)}</s>`
    : fmt(p.price);
  return `
    <div class="mini" data-id="${p.id}" role="button" tabindex="0">
      <div class="mini__img"><img src="${p.img}" alt="${p.title}" loading="lazy"/></div>
      <div class="mini__body">
        <span class="mini__title">${p.title}</span>
        <span class="mini__price">${priceHtml}</span>
      </div>
    </div>`;
}

function renderMegaBlocks() {
  $$('[data-cat-grid]').forEach(wrap => {
    const cat = wrap.dataset.catGrid;
    const list = PRODUCTS.filter(p => p.cat === cat).slice(0, 6);
    wrap.innerHTML = list.map(miniTpl).join('');
  });
}

/* ---------- Cart ---------- */
const cart = new Map();

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const e = cart.get(id) || { product: p, qty: 0 };
  e.qty++;
  cart.set(id, e);
  renderCart();
  toast(`Added — ${p.title}`);
}
function removeFromCart(id) { cart.delete(id); renderCart(); }

function renderCart() {
  const body = $('#cartBody');
  if (!body) return;
  let total = 0, count = 0;

  if (cart.size === 0) {
    body.innerHTML = '<p class="drawer__empty">Your cart is empty.</p>';
  } else {
    body.innerHTML = [...cart.values()].map(({ product, qty }) => {
      total += product.price * qty;
      count += qty;
      return `
        <div class="cart-item">
          <img src="${product.img}" alt="">
          <div>
            <strong>${product.title}</strong>
            <span class="qty">${qty} × ${fmt(product.price)}<span class="rm" data-rm="${product.id}">Remove</span></span>
          </div>
          <b>${fmt(product.price * qty)}</b>
        </div>`;
    }).join('');
  }

  $$('[data-cart-total-drawer]').forEach(e => e.textContent = fmt(total));
  $$('[data-cart-count]').forEach(e => e.textContent = count);

  // Free-shipping progress
  const bar  = $('#shipBar');
  const msg  = $('#shipMsg');
  const fill = $('#shipFill');
  if (bar && msg && fill) {
    const threshold = Number(bar.dataset.threshold || 50);
    const remaining = Math.max(0, threshold - total);
    const pct = Math.min(100, (total / threshold) * 100);
    fill.style.width = pct + '%';
    if (remaining <= 0) {
      msg.innerHTML = '<strong>Free shipping unlocked.</strong> Fewer trucks, less fuel.';
      bar.classList.add('is-unlocked');
    } else {
      msg.innerHTML = `<strong>${fmt(remaining)}</strong> away from free shipping.`;
      bar.classList.remove('is-unlocked');
    }
  }
}

function openCart()  { $('#cartDrawer').classList.add('is-open'); $('#cartScrim').classList.add('is-open'); }
function closeCart() { $('#cartDrawer').classList.remove('is-open'); $('#cartScrim').classList.remove('is-open'); }

function initCart() {
  // Click a mini card → add to cart (whole card is clickable)
  document.addEventListener('click', e => {
    const mini = e.target.closest('.mini[data-id]');
    if (mini) {
      addToCart(Number(mini.dataset.id));
      return;
    }
    const rm = e.target.closest('[data-rm]');
    if (rm) { e.stopPropagation(); removeFromCart(Number(rm.dataset.rm)); return; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const mini = e.target.closest?.('.mini[data-id]');
      if (mini) { e.preventDefault(); addToCart(Number(mini.dataset.id)); }
    }
    if (e.key === 'Escape') closeCart();
  });
  $('#openCart')?.addEventListener('click', e => { e.preventDefault(); openCart(); });
  $('.drawer__close')?.addEventListener('click', closeCart);
  $('#cartScrim')?.addEventListener('click', closeCart);
}

/* ---------- Category nav active state (scroll-based) ---------- */
function initCatNavSpy() {
  const chips = $$('.cat-chip[href^="#"]');
  if (!chips.length) return;
  const sections = chips
    .map(c => document.querySelector(c.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = '#' + en.target.id;
        chips.forEach(c => c.classList.toggle('is-active', c.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderMegaBlocks();
  initCart();
  renderCart();
  initCatNavSpy();
});
