/* ============================================================
   GreenKart Organics — Field Study
   Bento grid, filter, cart drawer, toast.
   ============================================================ */

const PRODUCTS = [
  { id: 1,  cat: 'fruits',     code: 'F-027', title: 'Wild Hillside Blueberries',
    img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=900&q=85&auto=format&fit=crop',
    price: 6.25, old: 8.00, weight: '125 g', size: 'xl' },
  { id: 2,  cat: 'vegetables', code: 'V-103', title: 'Heirloom Brandywine Tomatoes',
    img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=900&q=85&auto=format&fit=crop',
    price: 4.49, old: 6.00, weight: '500 g', size: 'lg' },
  { id: 3,  cat: 'bakery',     code: 'B-014', title: 'Country Sourdough Loaf',
    img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=900&q=85&auto=format&fit=crop',
    price: 7.50, old: null, weight: '800 g', size: 'tall' },
  { id: 4,  cat: 'fruits',     code: 'F-041', title: 'Fuji Apples',
    img: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=900&q=85&auto=format&fit=crop',
    price: 3.10, old: 4.40, weight: '6 pc', size: 'md' },
  { id: 5,  cat: 'dairy',      code: 'D-008', title: 'Grass-Fed Whole Milk',
    img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=900&q=85&auto=format&fit=crop',
    price: 3.95, old: null, weight: '1 L glass', size: 'sm' },
  { id: 6,  cat: 'vegetables', code: 'V-067', title: 'Hass Avocados',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=85&auto=format&fit=crop',
    price: 6.00, old: null, weight: 'pack of 4', size: 'sm' },
  { id: 7,  cat: 'dairy',      code: 'D-019', title: 'Brown Hen Eggs',
    img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=900&q=85&auto=format&fit=crop',
    price: 5.20, old: null, weight: '12 ct', size: 'md' },
  { id: 8,  cat: 'fruits',     code: 'F-052', title: 'Mountain Strawberries',
    img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&q=85&auto=format&fit=crop',
    price: 4.99, old: 6.50, weight: '250 g', size: 'wide' },
  { id: 9,  cat: 'bakery',     code: 'B-022', title: 'Butter Croissants',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=85&auto=format&fit=crop',
    price: 5.60, old: null, weight: 'pack of 4', size: 'md' },
  { id: 10, cat: 'vegetables', code: 'V-012', title: 'Rainbow Bell Peppers',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85&auto=format&fit=crop',
    price: 3.80, old: null, weight: '3 pc', size: 'sm' },
  { id: 11, cat: 'dairy',      code: 'D-031', title: 'Aged Farmhouse Cheddar',
    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=900&q=85&auto=format&fit=crop',
    price: 8.90, old: null, weight: '250 g', size: 'sm' },
  { id: 12, cat: 'fruits',     code: 'F-018', title: 'Valencia Juicing Oranges',
    img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=900&q=85&auto=format&fit=crop',
    price: 5.80, old: 7.20, weight: '1.5 kg', size: 'md' },
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => `$${n.toFixed(2)}`;

/* -------- Bento grid render -------- */
function specTemplate(p) {
  const priceHtml = p.old
    ? `${fmt(p.price)}<s>${fmt(p.old)}</s>`
    : `${fmt(p.price)}`;
  return `
    <article class="spec spec--${p.size}" data-cat="${p.cat}" data-id="${p.id}">
      <div class="spec__img">
        <span class="spec__code">${p.code}</span>
        <button class="spec__fav" aria-label="Add to favourites">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="spec__body">
        <div class="spec__meta">
          <span>${p.cat}</span>
          <span>${p.weight}</span>
        </div>
        <h3 class="spec__title">${p.title}</h3>
        <div class="spec__foot">
          <span class="spec__price">${priceHtml}</span>
          <button class="spec__add" data-add="${p.id}">Add →</button>
        </div>
      </div>
    </article>`;
}

function renderBento(filter = 'all') {
  const grid = $('#bentoGrid');
  if (!grid) return;
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = list.map(specTemplate).join('');
}

/* -------- Filter chips -------- */
function initFilter() {
  $$('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderBento(chip.dataset.filter);
    });
  });
}

/* -------- Cart -------- */
const cart = new Map();

function addToCart(id) {
  // For featured "Place in ledger" we use id 99 which maps to the wild blueberries (id 1)
  const realId = id === 99 ? 1 : id;
  const p = PRODUCTS.find(x => x.id === realId);
  if (!p) return;
  const e = cart.get(realId) || { product: p, qty: 0 };
  e.qty++;
  cart.set(realId, e);
  renderCart();
  toast(`Entered into ledger — ${p.title.split(',')[0]}`);
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
    body.innerHTML = '<p class="drawer__empty">Nothing entered yet.</p>';
  } else {
    body.innerHTML = [...cart.values()].map(({ product, qty }) => {
      total += product.price * qty;
      count += qty;
      return `
        <div class="cart-item">
          <img src="${product.img}" alt="">
          <div>
            <strong>${product.title}</strong>
            <div class="qty">${qty} × ${fmt(product.price)} <span class="rm" data-rm="${product.id}">remove</span></div>
          </div>
          <b>${fmt(product.price * qty)}</b>
        </div>`;
    }).join('');
  }
  $$('[data-cart-total-drawer]').forEach(e => e.textContent = fmt(total));
  $$('[data-cart-count]').forEach(e => e.textContent = count);
}

function openCart() {
  $('#cartDrawer').classList.add('is-open');
  $('#cartScrim').classList.add('is-open');
}
function closeCart() {
  $('#cartDrawer').classList.remove('is-open');
  $('#cartScrim').classList.remove('is-open');
}

function initCart() {
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(Number(add.dataset.add)); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { removeFromCart(Number(rm.dataset.rm)); return; }
    const fav = e.target.closest('.spec__fav');
    if (fav) { fav.classList.toggle('is-on'); return; }
  });
  $('#openCart').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  $('.drawer__close').addEventListener('click', closeCart);
  $('#cartScrim').addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
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

/* -------- Boot -------- */
document.addEventListener('DOMContentLoaded', () => {
  renderBento('all');
  initFilter();
  initCart();
  renderCart();
});
