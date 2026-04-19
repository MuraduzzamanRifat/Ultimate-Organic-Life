/* ============================================================
   GreenKart Organics
   Cart, filter, reveal-on-scroll, nav scroll state, 3D toggle.
   ============================================================ */

const PRODUCTS = [
  { id: 1,  cat: 'fruits',     title: 'Wild Hillside Blueberries',
    img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=900&q=85&auto=format&fit=crop',
    price: 6.25, old: 8.00, weight: '125 g' },
  { id: 2,  cat: 'vegetables', title: 'Heirloom Brandywine Tomatoes',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=900&q=85&auto=format&fit=crop',
    price: 4.49, old: 6.00, weight: '500 g' },
  { id: 3,  cat: 'bakery',     title: 'Country Sourdough Loaf',
    img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=900&q=85&auto=format&fit=crop',
    price: 7.50, old: null, weight: '800 g' },
  { id: 4,  cat: 'fruits',     title: 'Fuji Apples',
    img: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=900&q=85&auto=format&fit=crop',
    price: 3.10, old: 4.40, weight: '6 pc' },
  { id: 5,  cat: 'dairy',      title: 'Grass-Fed Whole Milk',
    img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=900&q=85&auto=format&fit=crop',
    price: 3.95, old: null, weight: '1 L glass' },
  { id: 6,  cat: 'vegetables', title: 'Hass Avocados',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=85&auto=format&fit=crop',
    price: 6.00, old: null, weight: 'pack of 4' },
  { id: 7,  cat: 'dairy',      title: 'Brown Hen Eggs',
    img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=900&q=85&auto=format&fit=crop',
    price: 5.20, old: null, weight: '12 ct' },
  { id: 8,  cat: 'fruits',     title: 'Mountain Strawberries',
    img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&q=85&auto=format&fit=crop',
    price: 4.99, old: 6.50, weight: '250 g' },
  { id: 9,  cat: 'bakery',     title: 'Butter Croissants',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=85&auto=format&fit=crop',
    price: 5.60, old: null, weight: 'pack of 4' },
  { id: 10, cat: 'vegetables', title: 'Rainbow Bell Peppers',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85&auto=format&fit=crop',
    price: 3.80, old: null, weight: '3 pc' },
  { id: 11, cat: 'dairy',      title: 'Aged Farmhouse Cheddar',
    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=900&q=85&auto=format&fit=crop',
    price: 8.90, old: null, weight: '250 g' },
  { id: 12, cat: 'fruits',     title: 'Valencia Oranges',
    img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=900&q=85&auto=format&fit=crop',
    price: 5.80, old: 7.20, weight: '1.5 kg' },
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => `$${n.toFixed(2)}`;

/* -------- Product cards -------- */
function cardTpl(p) {
  const price = p.old
    ? `${fmt(p.price)}<s>${fmt(p.old)}</s>`
    : fmt(p.price);
  return `
    <article class="card" data-cat="${p.cat}" data-id="${p.id}">
      <div class="card__img">
        <button type="button" class="card__fav" aria-label="Save">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="card__body">
        <span class="card__meta">${p.cat} · ${p.weight}</span>
        <h3 class="card__title">${p.title}</h3>
        <div class="card__foot">
          <span class="card__price">${price}</span>
          <button type="button" class="card__add" data-add="${p.id}">Add</button>
        </div>
      </div>
    </article>`;
}

function renderShop(filter = 'all') {
  const grid = $('#shopGrid');
  if (!grid) return;
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = list.map(cardTpl).join('');
}

function initFilters() {
  $$('.f').forEach(b => b.addEventListener('click', () => {
    $$('.f').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    renderShop(b.dataset.filter);
  }));
}

/* -------- Cart -------- */
const cart = new Map();

function addToCart(id) {
  const realId = id === 99 ? 1 : id;
  const p = PRODUCTS.find(x => x.id === realId);
  if (!p) return;
  const e = cart.get(realId) || { product: p, qty: 0 };
  e.qty++;
  cart.set(realId, e);
  renderCart();
  toast(`Added — ${p.title}`);
}

function removeFromCart(id) {
  cart.delete(id);
  renderCart();
}

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
            <div class="qty">${qty} × ${fmt(product.price)}<span class="rm" data-rm="${product.id}">Remove</span></div>
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
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(Number(add.dataset.add)); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { removeFromCart(Number(rm.dataset.rm)); return; }
    const fav = e.target.closest('.card__fav');
    if (fav) { fav.classList.toggle('is-on'); return; }
  });
  $('#openCart').addEventListener('click', e => { e.preventDefault(); openCart(); });
  $('.drawer__close').addEventListener('click', closeCart);
  $('#cartScrim').addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
}

/* -------- Toast -------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
}

/* -------- Reveal on scroll -------- */
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

/* -------- Nav scroll state -------- */
function initNavScroll() {
  const nav = $('.nav');
  if (!nav) return;
  const tick = () => {
    if (window.scrollY > 40) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* -------- 3D specimen toggle (lazy) -------- */
let specimen3dPromise = null;
function init3DToggle() {
  const wrap = $('[data-specimen-3d]');
  if (!wrap) return;
  const btn = wrap.querySelector('[data-3d-toggle]');
  if (!btn) return;

  // Feature gates
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  const conn = navigator.connection;
  const lowData = conn && (conn.saveData || /2g/.test(conn.effectiveType || ''));
  let webglOK = true;
  try {
    const t = document.createElement('canvas');
    webglOK = !!(t.getContext('webgl2') || t.getContext('webgl'));
  } catch (_) { webglOK = false; }

  if (mobile || lowData || !webglOK) {
    btn.remove();   // no 3D on constrained environments — keep the photo clean
    return;
  }

  btn.addEventListener('click', async () => {
    const on = wrap.classList.toggle('is-3d-on');
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('.specimen3d__toggle-txt').textContent = on ? 'View as photo' : 'View in 3D';

    if (on && !specimen3dPromise) {
      specimen3dPromise = import('./specimen-3d.js')
        .then(m => m.createSpecimenScene(wrap))
        .catch(err => { console.warn('3D load failed:', err); wrap.classList.remove('is-3d-on'); });
    }
  });
}

/* -------- Boot -------- */
document.addEventListener('DOMContentLoaded', () => {
  renderShop('all');
  initFilters();
  initCart();
  renderCart();
  initReveal();
  initNavScroll();
  init3DToggle();
});
