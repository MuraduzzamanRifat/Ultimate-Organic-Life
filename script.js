/* ============================================================
   GreenKart Organics — demo interactions
   Slider, cart, tabs, countdowns, product grid
   ============================================================ */

/* -------------------- Demo product data -------------------- */
const PRODUCTS = [
  { id: 1, cat: 'vegetables', title: 'Organic Heirloom Tomatoes (500g)',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80&auto=format&fit=crop',
    price: 4.49, old: 6.99, rating: 4.8, reviews: 126, badge: 'SALE' },
  { id: 2, cat: 'fruits', title: 'Wild Hand-Picked Blueberries',
    img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&q=80&auto=format&fit=crop',
    price: 6.25, old: null, rating: 4.9, reviews: 312, badge: 'HOT' },
  { id: 3, cat: 'dairy', title: 'Grass-Fed Whole Milk (1L Glass)',
    img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80&auto=format&fit=crop',
    price: 3.95, old: null, rating: 4.7, reviews: 89, badge: null },
  { id: 4, cat: 'fruits', title: 'Fuji Apples, Crunchy & Sweet',
    img: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&q=80&auto=format&fit=crop',
    price: 3.10, old: 4.40, rating: 4.6, reviews: 201, badge: 'SALE' },
  { id: 5, cat: 'bakery', title: 'Sourdough Country Loaf (800g)',
    img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&q=80&auto=format&fit=crop',
    price: 7.50, old: null, rating: 4.9, reviews: 58, badge: 'NEW' },
  { id: 6, cat: 'vegetables', title: 'Crisp Garden Broccoli Crown',
    img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80&auto=format&fit=crop',
    price: 2.75, old: null, rating: 4.5, reviews: 72, badge: null },
  { id: 7, cat: 'fruits', title: 'Valencia Juicing Oranges (1.5kg)',
    img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&q=80&auto=format&fit=crop',
    price: 5.80, old: 7.20, rating: 4.7, reviews: 144, badge: 'SALE' },
  { id: 8, cat: 'dairy', title: 'Farm-Fresh Brown Eggs (Dozen)',
    img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80&auto=format&fit=crop',
    price: 5.20, old: null, rating: 4.8, reviews: 267, badge: null },
  { id: 9, cat: 'vegetables', title: 'Ripe Hass Avocados (Pack of 4)',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80&auto=format&fit=crop',
    price: 6.00, old: null, rating: 4.6, reviews: 98, badge: 'HOT' },
  { id: 10, cat: 'bakery', title: 'Seeded Whole-Grain Rolls (6pc)',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80&auto=format&fit=crop',
    price: 4.20, old: null, rating: 4.5, reviews: 41, badge: null },
  { id: 11, cat: 'fruits', title: 'Sweet Mountain Strawberries',
    img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80&auto=format&fit=crop',
    price: 4.99, old: 6.50, rating: 4.9, reviews: 221, badge: 'SALE' },
  { id: 12, cat: 'dairy', title: 'Aged Farmhouse Cheddar (250g)',
    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80&auto=format&fit=crop',
    price: 8.90, old: null, rating: 4.8, reviews: 63, badge: 'NEW' },
  { id: 13, cat: 'vegetables', title: 'Rainbow Bell Pepper Trio',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80&auto=format&fit=crop',
    price: 3.80, old: null, rating: 4.7, reviews: 112, badge: null },
  { id: 14, cat: 'fruits', title: 'Golden Honey Mangoes (2pc)',
    img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80&auto=format&fit=crop',
    price: 7.40, old: null, rating: 4.8, reviews: 76, badge: 'HOT' },
  { id: 15, cat: 'bakery', title: 'Flaky Butter Croissants (4pc)',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80&auto=format&fit=crop',
    price: 5.60, old: null, rating: 4.9, reviews: 184, badge: null },
  { id: 16, cat: 'vegetables', title: 'Organic Baby Spinach (200g)',
    img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80&auto=format&fit=crop',
    price: 2.99, old: null, rating: 4.6, reviews: 54, badge: null },
  { id: 17, cat: 'dairy', title: 'Creamy Greek Yogurt (500g)',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80&auto=format&fit=crop',
    price: 4.10, old: null, rating: 4.7, reviews: 128, badge: 'NEW' },
  { id: 18, cat: 'fruits', title: 'Bartlett Pears, Sweet & Crisp',
    img: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=500&q=80&auto=format&fit=crop',
    price: 3.60, old: null, rating: 4.5, reviews: 67, badge: null }
];

/* -------------------- Helpers -------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmt = (n) => `$${n.toFixed(2)}`;

/* -------------------- Product cards -------------------- */
function cardTemplate(p) {
  const stars = '★★★★★'.slice(0, Math.round(p.rating)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(p.rating));
  const badgeHtml = p.badge
    ? `<span class="card__badge card__badge--${p.badge.toLowerCase()}">${p.badge}</span>`
    : '';
  const priceHtml = p.old
    ? `<b>${fmt(p.price)}</b><s>${fmt(p.old)}</s>`
    : `<b>${fmt(p.price)}</b>`;
  return `
  <article class="card" data-cat="${p.cat}" data-id="${p.id}">
    <div class="card__img">
      ${badgeHtml}
      <button class="card__fav" aria-label="Add to wishlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
    </div>
    <div class="card__body">
      <span class="card__cat">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</span>
      <h3 class="card__title"><a href="#">${p.title}</a></h3>
      <div class="card__rating">${stars}<span>(${p.reviews})</span></div>
      <div class="card__foot">
        <div class="card__price">${priceHtml}</div>
        <button class="card__add" data-add="${p.id}">+ Add</button>
      </div>
    </div>
  </article>`;
}

function renderProducts(filter = 'all') {
  const grid = $('#productGrid');
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = list.slice(0, 15).map(cardTemplate).join('');
}

function renderBestsellers() {
  const track = $('#bestsellersTrack');
  const top = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 10);
  track.innerHTML = top.map(cardTemplate).join('');
}

/* -------------------- Tabs -------------------- */
function initTabs() {
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderProducts(tab.dataset.filter);
    });
  });
}

/* -------------------- Hero slider -------------------- */
function initSlider() {
  const slides = $$('.slide');
  const dotsWrap = $('.slide-dots');
  let idx = 0, timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
  });

  function show(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    $$('.slide-dots button').forEach((d, i) => d.classList.toggle('is-active', i === idx));
    restart();
  }
  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 6000); }

  $('.slide-nav--next').addEventListener('click', next);
  $('.slide-nav--prev').addEventListener('click', prev);
  restart();
}

/* -------------------- Countdown -------------------- */
function initCountdowns() {
  $$('.countdown').forEach(el => {
    const [h, m, s] = el.dataset.countdown.split(':').map(Number);
    let remaining = h * 3600 + m * 60 + s;
    tick();
    setInterval(tick, 1000);
    function tick() {
      if (remaining <= 0) return;
      remaining--;
      const d = Math.floor(remaining / 86400);
      const hh = Math.floor((remaining % 86400) / 3600);
      const mm = Math.floor((remaining % 3600) / 60);
      const ss = remaining % 60;
      const bs = el.querySelectorAll('b');
      bs[0].textContent = String(d).padStart(2, '0');
      bs[1].textContent = String(hh).padStart(2, '0');
      bs[2].textContent = String(mm).padStart(2, '0');
      bs[3].textContent = String(ss).padStart(2, '0');
    }
  });
}

/* -------------------- Cart -------------------- */
const cart = new Map(); // id -> { product, qty }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const entry = cart.get(id) || { product: p, qty: 0 };
  entry.qty++;
  cart.set(id, entry);
  renderCart();
  toast(`${p.title.split(',')[0]} added to cart`);
}

function removeFromCart(id) {
  cart.delete(id);
  renderCart();
}

function renderCart() {
  const body = $('#cartBody');
  let total = 0, count = 0;

  if (cart.size === 0) {
    body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    body.innerHTML = [...cart.values()].map(({ product, qty }) => {
      total += product.price * qty;
      count += qty;
      return `
      <div class="cart-item">
        <img src="${product.img}" alt="">
        <div>
          <strong>${product.title}</strong>
          <span class="qty">${qty} × ${fmt(product.price)}</span>
          <span class="rm" data-rm="${product.id}">Remove</span>
        </div>
        <b>${fmt(product.price * qty)}</b>
      </div>`;
    }).join('');
  }

  if (cart.size > 0) {
    total = [...cart.values()].reduce((s, { product, qty }) => s + product.price * qty, 0);
    count = [...cart.values()].reduce((s, { qty }) => s + qty, 0);
  }

  $$('[data-cart-total], [data-cart-total-drawer]').forEach(e => e.textContent = fmt(total));
  $$('[data-cart-count]').forEach(e => e.textContent = count);
}

function openCart() { $('#cartDrawer').classList.add('is-open'); $('#cartScrim').classList.add('is-open'); }
function closeCart() { $('#cartDrawer').classList.remove('is-open'); $('#cartScrim').classList.remove('is-open'); }

function initCart() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) { addToCart(Number(addBtn.dataset.add)); return; }
    const rmBtn = e.target.closest('[data-rm]');
    if (rmBtn) { removeFromCart(Number(rmBtn.dataset.rm)); return; }
    const fav = e.target.closest('.card__fav');
    if (fav) { fav.classList.toggle('is-on'); updateWishlistCount(); return; }
  });
  $('.header-action--cart').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  $('.cart-drawer__close').addEventListener('click', closeCart);
  $('#cartScrim').addEventListener('click', closeCart);
}

function updateWishlistCount() {
  const n = $$('.card__fav.is-on').length;
  $('[data-wishlist-count]').textContent = n;
}

/* -------------------- Carousel buttons -------------------- */
function initCarousel() {
  const track = $('#bestsellersTrack');
  $$('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      track.scrollBy({ left: Number(btn.dataset.dir) * 280, behavior: 'smooth' });
    });
  });
}

/* -------------------- Toast -------------------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
}

/* -------------------- Boot -------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  renderBestsellers();
  initTabs();
  initSlider();
  initCountdowns();
  initCart();
  initCarousel();
  renderCart();
});
