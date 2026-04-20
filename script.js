/* ============================================================
   GreenKart — luxury organic food house
   Hero crossfade, nav scroll state, side menu, reveal-on-scroll,
   collection grid, cart drawer with shipping progress.
   ============================================================ */

const PRODUCTS = [
  { id: 1, size: 'lg', cat: 'Produce · Spring',
    title: 'The Spring Box — Volume Twelve',
    img: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1600&q=90&auto=format&fit=crop',
    price: 48.00, old: null, tag: 'New in' },
  { id: 2, size: 'md', cat: 'Fruit · Wild',
    title: 'Hillside Blueberries',
    img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=1200&q=90&auto=format&fit=crop',
    price: 6.25, old: 8.00, tag: null },
  { id: 3, size: 'md', cat: 'Vegetables · Heirloom',
    title: 'Brandywine Tomatoes',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200&q=90&auto=format&fit=crop',
    price: 4.49, old: null, tag: null },
  { id: 4, size: 'md', cat: 'Bakery · Stone oven',
    title: 'Country Sourdough',
    img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=1200&q=90&auto=format&fit=crop',
    price: 7.50, old: null, tag: null },
  { id: 5, size: 'md', cat: 'Dairy · Small herd',
    title: 'Grass-fed Whole Milk',
    img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=90&auto=format&fit=crop',
    price: 3.95, old: null, tag: null },
  { id: 6, size: 'md', cat: 'Fruit · Orchard',
    title: 'Mountain Strawberries',
    img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1200&q=90&auto=format&fit=crop',
    price: 4.99, old: 6.50, tag: null },
  { id: 7, size: 'lg', cat: 'Pantry · Editor\'s cut',
    title: 'The Harvest Pantry — Fourteen Essentials',
    img: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1600&q=90&auto=format&fit=crop',
    price: 128.00, old: null, tag: 'Limited' },
  { id: 8, size: 'md', cat: 'Bakery · Viennoiserie',
    title: 'Butter Croissants',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=90&auto=format&fit=crop',
    price: 5.60, old: null, tag: null },
  { id: 9, size: 'md', cat: 'Dairy · Aged',
    title: 'Farmhouse Cheddar',
    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200&q=90&auto=format&fit=crop',
    price: 8.90, old: null, tag: 'New in' },
  { id: 10, size: 'md', cat: 'Pantry · Apiary',
    title: 'Raw Wildflower Honey',
    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=90&auto=format&fit=crop',
    price: 14.50, old: null, tag: null },
];

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => `$${n.toFixed(2)}`;

/* ---------- Collection grid ---------- */
function prodTpl(p) {
  const price = p.old ? `${fmt(p.price)}<s>${fmt(p.old)}</s>` : fmt(p.price);
  const tagHtml = p.tag ? `<span class="prod__tag">${p.tag}</span>` : '';
  return `
    <article class="prod prod--${p.size}" data-id="${p.id}">
      <div class="prod__img">
        ${tagHtml}
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="prod__body">
        <div>
          <span class="prod__meta">${p.cat}</span>
          <h3 class="prod__title">${p.title}</h3>
        </div>
        <span class="prod__price">${price}</span>
        <button type="button" class="prod__add" data-add="${p.id}">Add to bag</button>
      </div>
    </article>`;
}
function renderCollection() {
  const grid = $('#collectionGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(prodTpl).join('');
}

/* ---------- Hero crossfade ---------- */
function initHeroCrossfade() {
  const slides = $$('.hero__slide');
  const ticks = $$('.hero__ticker span');
  if (slides.length <= 1) return;
  let i = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  setInterval(() => {
    slides[i].classList.remove('is-in');
    ticks[i]?.classList.remove('is-in');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-in');
    ticks[i]?.classList.add('is-in');
    // re-run ken burns by resetting the animation
    const img = slides[i].querySelector('img');
    if (img) {
      img.style.animation = 'none';
      // force reflow
      void img.offsetWidth;
      img.style.animation = '';
    }
  }, 6000);
}

/* ---------- Nav scroll state ---------- */
function initNavScroll() {
  const nav = $('#nav');
  if (!nav) return;
  const hero = $('.hero');
  const heroHeight = () => (hero ? hero.offsetHeight : 400);
  const tick = () => {
    const y = window.scrollY;
    // Turn the nav cream once the user has passed about 80% of the hero
    if (y > heroHeight() * 0.8) {
      nav.classList.add('nav--scrolled', 'nav--hero-passed');
    } else if (y > 40) {
      nav.classList.remove('nav--scrolled');
      nav.classList.add('nav--hero-passed');
    } else {
      nav.classList.remove('nav--scrolled', 'nav--hero-passed');
    }
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ---------- Side menu ---------- */
function initSideMenu() {
  const btn   = $('#menuBtn');
  const close = $('#menuClose');
  const menu  = $('#sideMenu');
  const scrim = $('#menuScrim');
  if (!btn || !menu) return;
  const open = () => {
    menu.classList.add('is-open');
    scrim.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const shut = () => {
    menu.classList.remove('is-open');
    scrim.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', open);
  close?.addEventListener('click', shut);
  scrim.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
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
  toast(`Added · ${p.title.split('—')[0].trim()}`);
}
function removeFromCart(id) { cart.delete(id); renderCart(); }

function renderCart() {
  const body = $('#cartBody');
  if (!body) return;
  let total = 0, count = 0;

  if (cart.size === 0) {
    body.innerHTML = '<p class="drawer__empty">Your bag is empty.</p>';
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

  const bar  = $('#shipBar');
  const msg  = $('#shipMsg');
  const fill = $('#shipFill');
  if (bar && msg && fill) {
    const threshold = Number(bar.dataset.threshold || 50);
    const remaining = Math.max(0, threshold - total);
    const pct = Math.min(100, (total / threshold) * 100);
    fill.style.width = pct + '%';
    if (remaining <= 0) {
      msg.innerHTML = '<strong>Complimentary delivery unlocked.</strong>';
    } else {
      msg.innerHTML = `<strong>${fmt(remaining)}</strong> from complimentary delivery.`;
    }
  }
}

function openCart()  { $('#cartDrawer').classList.add('is-open'); $('#cartScrim').classList.add('is-open'); }
function closeCart() { $('#cartDrawer').classList.remove('is-open'); $('#cartScrim').classList.remove('is-open'); }

function initCart() {
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(Number(add.dataset.add)); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { removeFromCart(Number(rm.dataset.rm)); return; }
  });
  $('#openCart')?.addEventListener('click', e => { e.preventDefault(); openCart(); });
  $('.drawer__close')?.addEventListener('click', closeCart);
  $('#cartScrim')?.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
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

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); o.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderCollection();
  initHeroCrossfade();
  initNavScroll();
  initSideMenu();
  initCart();
  renderCart();
  initReveal();
});
