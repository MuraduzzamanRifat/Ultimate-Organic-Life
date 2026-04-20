/* ============================================================
   GreenKart — shared shell, cart persistence, page bootstraps.
   data.js is loaded before this file.
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => `$${n.toFixed(2)}`;
const CART_KEY = 'greenkart.cart.v1';
const WISH_KEY = 'greenkart.wishlist.v1';
const PRODUCTS = window.PRODUCTS || [];
const CATS = window.CATEGORIES || [];

/* ===================== Cart (localStorage) ===================== */
const Cart = {
  read() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); }
    catch { return {}; }
  },
  write(obj) { localStorage.setItem(CART_KEY, JSON.stringify(obj)); },
  count() { return Object.values(this.read()).reduce((s, n) => s + n, 0); },
  subtotal() {
    const c = this.read();
    return Object.entries(c).reduce((s, [id, qty]) => {
      const p = PRODUCTS.find(x => x.id === Number(id));
      return p ? s + p.price * qty : s;
    }, 0);
  },
  items() {
    const c = this.read();
    return Object.entries(c)
      .map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === Number(id)), qty }))
      .filter(x => x.product);
  },
  add(id, qty = 1) {
    const c = this.read();
    c[id] = (c[id] || 0) + qty;
    this.write(c); this.broadcast();
  },
  setQty(id, qty) {
    const c = this.read();
    if (qty <= 0) delete c[id];
    else c[id] = qty;
    this.write(c); this.broadcast();
  },
  remove(id) {
    const c = this.read();
    delete c[id];
    this.write(c); this.broadcast();
  },
  clear() { localStorage.removeItem(CART_KEY); this.broadcast(); },
  broadcast() { document.dispatchEvent(new CustomEvent('cart:update')); },
};

const Wishlist = {
  read() { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch { return []; } },
  write(arr) { localStorage.setItem(WISH_KEY, JSON.stringify(arr)); document.dispatchEvent(new CustomEvent('wish:update')); },
  has(id) { return this.read().includes(Number(id)); },
  toggle(id) {
    const arr = this.read(), i = arr.indexOf(Number(id));
    if (i === -1) arr.push(Number(id)); else arr.splice(i, 1);
    this.write(arr);
  },
};

/* ===================== Shell injection ===================== */
const shellHeader = (active = '') => `
  <div class="strip">
    <span>Complimentary delivery from $50 · 24 states</span>
    <span class="strip__sep" aria-hidden="true">—</span>
    <span>Carbon-neutral courier · Farm-to-door in 48 h</span>
  </div>
  <header class="nav" id="nav">
    <div class="nav__row">
      <div class="nav__left">
        <button type="button" class="menu" id="menuBtn" aria-label="Open menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
        </button>
        <a href="about.html" class="nav__link nav__link--hide${active==='about'?' is-active':''}">Our story</a>
      </div>
      <a href="index.html" class="wordmark" aria-label="GreenKart home">GREENKART</a>
      <div class="nav__right">
        <a href="shop.html" class="nav__link nav__link--hide${active==='shop'?' is-active':''}">Shop</a>
        <a href="journal.html" class="nav__link nav__link--hide${active==='journal'?' is-active':''}">Journal</a>
        <a href="farms.html" class="nav__link nav__link--hide${active==='farms'?' is-active':''}">Farms</a>
        <a href="contact.html" class="nav__link" aria-label="Contact">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg>
        </a>
        <a href="account.html" class="nav__link" aria-label="Account">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <button type="button" class="nav__link nav__bag" id="openCart" aria-label="Bag">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 7h15l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
          <em data-cart-count>0</em>
        </button>
      </div>
    </div>
  </header>

  <aside class="sidemenu" id="sideMenu" aria-hidden="true">
    <div class="sidemenu__inner">
      <button type="button" class="sidemenu__close" aria-label="Close menu" id="menuClose">Close</button>
      <nav>
        <a href="index.html">Home</a>
        <a href="shop.html">Shop all</a>
        <a href="shop.html?cat=fruits">Fruits</a>
        <a href="shop.html?cat=vegetables">Vegetables</a>
        <a href="shop.html?cat=bakery">Bakery</a>
        <a href="shop.html?cat=dairy">Dairy &amp; Eggs</a>
        <a href="shop.html?cat=pantry">Pantry</a>
        <a href="farms.html">Our farms</a>
        <a href="journal.html">Journal</a>
        <a href="about.html">Our story</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="sidemenu__foot">
        <small>United States · English · USD</small>
        <small>hello@greenkart.demo · +1 800 123 4567</small>
      </div>
    </div>
  </aside>
  <div class="scrim" id="menuScrim"></div>
`;

const shellDrawer = () => `
  <aside class="drawer" id="cartDrawer" aria-hidden="true" aria-label="Your bag">
    <header class="drawer__head">
      <span>Your bag <em class="drawer__count" data-cart-count>0</em></span>
      <button type="button" class="drawer__close" aria-label="Close">Close</button>
    </header>
    <div class="drawer__body" id="cartBody"><p class="drawer__empty">Your bag is empty.</p></div>
    <footer class="drawer__foot">
      <div class="ship-bar" id="shipBar" data-threshold="50">
        <div class="ship-bar__msg" id="shipMsg">$50.00 from complimentary delivery</div>
        <div class="ship-bar__rail"><div class="ship-bar__fill" id="shipFill"></div></div>
      </div>
      <div class="drawer__total"><span>Subtotal</span><b data-cart-total>$0.00</b></div>
      <a href="cart.html" class="btn-ink btn--block">View bag &amp; checkout <span aria-hidden="true">→</span></a>
      <p class="drawer__trust">Secure checkout · Encrypted at rest · Returns within 14 days</p>
    </footer>
  </aside>
  <div class="scrim" id="cartScrim"></div>
  <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
`;

const shellFooter = () => `
  <footer class="foot">
    <div class="foot__grid">
      <div class="foot__brand">
        <span class="foot__mark">GreenKart</span>
        <p>A curated boutique of organic produce, pantry, and home goods from small cooperative farms. Delivered to 24 states.</p>
        <div class="foot__certs">
          <span>USDA Organic</span><span>Non-GMO</span><span>B-Corp</span><span>Climate Neutral</span>
        </div>
      </div>
      <div class="foot__col">
        <h6>Shop</h6>
        <a href="shop.html?cat=fruits">Fruits</a>
        <a href="shop.html?cat=vegetables">Vegetables</a>
        <a href="shop.html?cat=bakery">Bakery</a>
        <a href="shop.html?cat=dairy">Dairy &amp; Eggs</a>
        <a href="shop.html?cat=pantry">Pantry</a>
      </div>
      <div class="foot__col">
        <h6>The house</h6>
        <a href="about.html">About</a>
        <a href="farms.html">Our farms</a>
        <a href="journal.html">Journal</a>
        <a href="#">Sustainability</a>
        <a href="#">Careers</a>
      </div>
      <div class="foot__col">
        <h6>Client care</h6>
        <a href="#">Shipping</a>
        <a href="#">Returns</a>
        <a href="contact.html">Contact</a>
        <a href="#">FAQ</a>
        <a href="account.html">Account</a>
      </div>
      <div class="foot__col foot__col--region">
        <h6>Region</h6>
        <select aria-label="Country and currency">
          <option>United States · USD</option>
          <option>Canada · CAD</option>
          <option>United Kingdom · GBP</option>
          <option>Europe · EUR</option>
          <option>Japan · JPY</option>
        </select>
        <small>Shipping available to 24 states, $50 minimum.</small>
      </div>
    </div>
    <div class="foot__bot">
      <small>© 2026 GreenKart Organics · A design demo, not a live retailer.</small>
      <small><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cookies</a> · <a href="#">Accessibility</a></small>
    </div>
  </footer>
`;

function mountShell(active = '') {
  const h = document.getElementById('shell-header');
  if (h) h.innerHTML = shellHeader(active);
  const f = document.getElementById('shell-footer');
  if (f) f.innerHTML = shellFooter();
  const d = document.getElementById('shell-drawer');
  if (d) d.innerHTML = shellDrawer();
}

/* ===================== Drawer + menu wiring ===================== */
function initShellInteractions() {
  // side menu
  const menuBtn = $('#menuBtn'), menuClose = $('#menuClose');
  const menu = $('#sideMenu'), menuScrim = $('#menuScrim');
  const openMenu  = () => { menu.classList.add('is-open'); menuScrim.classList.add('is-open'); menuBtn?.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
  const closeMenu = () => { menu.classList.remove('is-open'); menuScrim.classList.remove('is-open'); menuBtn?.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
  menuBtn?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  menuScrim?.addEventListener('click', closeMenu);

  // cart drawer
  const cartBtn = $('#openCart'), cartDr = $('#cartDrawer'), cartScrim = $('#cartScrim');
  const cartClose = cartDr?.querySelector('.drawer__close');
  const openCart  = () => { cartDr.classList.add('is-open'); cartScrim.classList.add('is-open'); document.body.style.overflow='hidden'; };
  const closeCart = () => { cartDr.classList.remove('is-open'); cartScrim.classList.remove('is-open'); document.body.style.overflow=''; };
  cartBtn?.addEventListener('click', e => { e.preventDefault(); openCart(); });
  cartClose?.addEventListener('click', closeCart);
  cartScrim?.addEventListener('click', closeCart);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeCart(); } });

  // add to cart / remove via event delegation (works across pages)
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      Cart.add(Number(add.dataset.add));
      const p = PRODUCTS.find(x => x.id === Number(add.dataset.add));
      toast(`Added · ${p?.title?.split('—')[0]?.trim() || 'item'}`);
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { e.preventDefault(); Cart.remove(Number(rm.dataset.remove)); return; }
    const inc = e.target.closest('[data-inc]');
    if (inc) {
      const id = Number(inc.dataset.inc);
      const cur = Cart.read()[id] || 0;
      Cart.setQty(id, cur + 1);
      return;
    }
    const dec = e.target.closest('[data-dec]');
    if (dec) {
      const id = Number(dec.dataset.dec);
      const cur = Cart.read()[id] || 0;
      Cart.setQty(id, Math.max(0, cur - 1));
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      Wishlist.toggle(Number(wish.dataset.wish));
      wish.classList.toggle('is-on', Wishlist.has(Number(wish.dataset.wish)));
      return;
    }
  });

  document.addEventListener('cart:update', renderCartDrawer);
  renderCartDrawer();
}

/* ===================== Cart drawer render ===================== */
function renderCartDrawer() {
  const body = $('#cartBody');
  const count = Cart.count();
  const total = Cart.subtotal();
  $$('[data-cart-count]').forEach(e => {
    e.textContent = count;
    e.classList.toggle('is-zero', count === 0);
  });
  $$('[data-cart-total]').forEach(e => e.textContent = fmt(total));

  if (!body) return;
  const items = Cart.items();
  if (items.length === 0) {
    body.innerHTML = '<p class="drawer__empty">Your bag is empty.</p>';
  } else {
    body.innerHTML = items.map(({ product: p, qty }) => `
      <div class="cart-item">
        <a href="product.html?id=${p.id}"><img src="${p.img}" alt=""/></a>
        <div class="cart-item__body">
          <a href="product.html?id=${p.id}"><strong>${p.title}</strong></a>
          <span class="qty">${qty} × ${fmt(p.price)}</span>
          <div class="cart-item__actions">
            <button type="button" data-dec="${p.id}" aria-label="Decrease">−</button>
            <span>${qty}</span>
            <button type="button" data-inc="${p.id}" aria-label="Increase">+</button>
            <button type="button" class="rm" data-remove="${p.id}">Remove</button>
          </div>
        </div>
        <b>${fmt(p.price * qty)}</b>
      </div>`).join('');
  }

  // Shipping progress
  const bar = $('#shipBar'), msg = $('#shipMsg'), fill = $('#shipFill');
  if (bar && msg && fill) {
    const threshold = Number(bar.dataset.threshold || 50);
    const remaining = Math.max(0, threshold - total);
    const pct = Math.min(100, (total / threshold) * 100);
    fill.style.width = pct + '%';
    if (remaining <= 0) {
      msg.innerHTML = '<strong>Complimentary delivery unlocked.</strong>';
      bar.classList.add('is-unlocked');
    } else {
      msg.innerHTML = `<strong>${fmt(remaining)}</strong> from complimentary delivery`;
      bar.classList.remove('is-unlocked');
    }
  }
}

/* ===================== Toast ===================== */
let toastTimer;
function toast(msg) {
  const el = $('#toast'); if (!el) return;
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2200);
}

/* ===================== Reveal on scroll ===================== */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries, o) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); o.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ===================== Nav scroll state ===================== */
function initNavScroll() {
  const nav = $('#nav'); if (!nav) return;
  const hero = $('.hero');
  const heroHeight = () => hero ? hero.offsetHeight : 400;
  const tick = () => {
    const y = window.scrollY;
    if (y > heroHeight() * 0.8 || !hero) nav.classList.add('nav--scrolled', 'nav--hero-passed');
    else if (y > 40) { nav.classList.remove('nav--scrolled'); nav.classList.add('nav--hero-passed'); }
    else nav.classList.remove('nav--scrolled', 'nav--hero-passed');
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ===================== Page templates ===================== */
function productCardTpl(p) {
  const price = p.old ? `${fmt(p.price)}<s>${fmt(p.old)}</s>` : fmt(p.price);
  const tag = p.old ? '<span class="prod__tag">Sale</span>' : (p.featured ? '<span class="prod__tag">Featured</span>' : '');
  const wish = Wishlist.has(p.id) ? ' is-on' : '';
  return `
    <article class="prod" data-id="${p.id}" data-cat="${p.cat}">
      <a href="product.html?id=${p.id}" class="prod__img">
        ${tag}
        <button type="button" class="prod__fav${wish}" data-wish="${p.id}" aria-label="Save to wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.title}" loading="lazy"/>
      </a>
      <div class="prod__body">
        <span class="prod__meta">${p.subcat} · ${p.weight}</span>
        <h3 class="prod__title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
        <div class="prod__foot">
          <span class="prod__price">${price}</span>
          <button type="button" class="prod__add" data-add="${p.id}">Add to bag</button>
        </div>
      </div>
    </article>`;
}

/* ===================== Page bootstraps ===================== */
function bootHome() {
  // Hero crossfade
  const slides = $$('.hero__slide'), ticks = $$('.hero__ticker span');
  if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('is-in'); ticks[i]?.classList.remove('is-in');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-in');  ticks[i]?.classList.add('is-in');
    }, 6000);
  }
  // Featured products
  const feat = $('#featuredGrid');
  if (feat) feat.innerHTML = PRODUCTS.filter(p => p.featured).slice(0, 6).map(productCardTpl).join('');
  // Sale products in showcase
  const sale = $('#saleRail');
  if (sale) sale.innerHTML = PRODUCTS.filter(p => p.old).map(productCardTpl).join('');
  initNavScroll();
}

function bootShop() {
  const grid = $('#shopGrid'), catList = $('#catList'), count = $('#resultCount');
  const sortSel = $('#sortBy'), searchIn = $('#searchIn');
  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'all';
  let query = '';
  let sort = 'featured';

  function matches(p) {
    if (activeCat !== 'all' && p.cat !== activeCat) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!(p.title + ' ' + p.subtitle + ' ' + p.cat + ' ' + p.origin).toLowerCase().includes(q)) return false;
    }
    return true;
  }
  function sorted(list) {
    const arr = [...list];
    if (sort === 'price-asc') arr.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') arr.sort((a,b) => b.price - a.price);
    if (sort === 'rating') arr.sort((a,b) => b.rating - a.rating);
    if (sort === 'newest') arr.sort((a,b) => b.id - a.id);
    return arr;
  }
  function render() {
    const list = sorted(PRODUCTS.filter(matches));
    grid.innerHTML = list.map(productCardTpl).join('');
    if (count) count.textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    $$('[data-cat-btn]').forEach(b => b.classList.toggle('is-active', b.dataset.catBtn === activeCat));
    history.replaceState({}, '', activeCat === 'all' ? 'shop.html' : `shop.html?cat=${activeCat}`);
  }
  if (catList) catList.innerHTML = CATS.map(c =>
    `<button type="button" class="cat-row" data-cat-btn="${c.key}"><span>${c.label}</span><em>${c.key==='all'?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===c.key).length}</em></button>`
  ).join('');
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat-btn]');
    if (btn) { activeCat = btn.dataset.catBtn; render(); }
  });
  sortSel?.addEventListener('change', () => { sort = sortSel.value; render(); });
  searchIn?.addEventListener('input', () => { query = searchIn.value; render(); });
  render();
}

function bootProduct() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  if (!p) return;

  // breadcrumb
  $('#crumbCat')?.append(p.subcat);
  $('#crumbTitle')?.append(p.title);

  // gallery
  const mainImg = $('#pdpMain');
  const thumbs = $('#pdpThumbs');
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.img];
  if (mainImg) { mainImg.src = gallery[0]; mainImg.alt = p.title; }
  if (thumbs) {
    thumbs.innerHTML = gallery.map((src, i) => `
      <button type="button" class="pdp-thumb${i===0?' is-active':''}" data-src="${src}">
        <img src="${src}" alt="" />
      </button>`).join('');
    thumbs.addEventListener('click', e => {
      const b = e.target.closest('[data-src]');
      if (!b) return;
      thumbs.querySelectorAll('.pdp-thumb').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      mainImg.src = b.dataset.src;
    });
  }

  // details
  $('#pdpTitle').textContent = p.title;
  $('#pdpSubtitle').textContent = p.subtitle;
  $('#pdpPrice').innerHTML = p.old ? `${fmt(p.price)}<s>${fmt(p.old)}</s>` : fmt(p.price);
  $('#pdpDesc').textContent = p.description;
  $('#pdpStory').textContent = p.story;
  $('#pdpOrigin').textContent = p.origin;
  $('#pdpWeight').textContent = p.weight;
  $('#pdpKeeps').textContent = p.keeps;
  $('#pdpStock').textContent = `${p.stock} left in this batch`;
  $('#pdpRatingVal').textContent = p.rating.toFixed(1);
  $('#pdpReviewsCount').textContent = `(${p.reviews} reviews)`;
  $('#pdpFarmer').textContent = p.farmer;
  $('#pdpFarmerSince').textContent = p.farmerSince;
  $('#pdpFarmerQuote').textContent = p.farmerQuote;

  // tag pills
  const tagWrap = $('#pdpTags');
  if (tagWrap && p.tags) tagWrap.innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');

  // qty picker + add to bag
  let qty = 1;
  const qInp = $('#pdpQty'), qMinus = $('#pdpMinus'), qPlus = $('#pdpPlus'), addBtn = $('#pdpAdd');
  function syncQty() { qInp.value = qty; }
  qMinus?.addEventListener('click', () => { qty = Math.max(1, qty - 1); syncQty(); });
  qPlus?.addEventListener('click',  () => { qty = Math.min(p.stock, qty + 1); syncQty(); });
  qInp?.addEventListener('change',  () => { qty = Math.max(1, Math.min(p.stock, Number(qInp.value) || 1)); syncQty(); });
  addBtn?.addEventListener('click', () => {
    Cart.add(p.id, qty);
    toast(`Added · ${p.title}`);
  });

  // wishlist button
  const wishBtn = $('#pdpWish');
  if (wishBtn) {
    wishBtn.classList.toggle('is-on', Wishlist.has(p.id));
    wishBtn.dataset.wish = p.id;
  }

  // related
  const rel = $('#pdpRelated');
  if (rel) {
    const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    rel.innerHTML = related.map(productCardTpl).join('');
  }

  // reviews — synth from rating
  const rvList = $('#pdpReviewList');
  if (rvList) {
    const names = ['Emma R.', 'David O.', 'Sofia M.', 'Naomi H.', 'Paul M.', 'Lila S.'];
    const blurbs = [
      'Arrived beautifully packed and even more beautifully fresh. Hard to go back to the supermarket after.',
      'Flavor that\'s impossible to forget. My kids actually ask for it now.',
      'Honest provenance and immaculate delivery. I\'ve referred three friends.',
      'Exactly what the description said. No fuss, no filler.',
      'Easily the best version of this I\'ve tasted. Will reorder.',
    ];
    const n = Math.min(3, Math.max(2, Math.round(p.rating)));
    const html = Array.from({ length: n }, (_, i) => `
      <figure class="rv">
        <div class="rv__stars" aria-label="${p.rating} of 5">★★★★★</div>
        <blockquote>${blurbs[i % blurbs.length]}</blockquote>
        <figcaption>
          <strong>${names[i % names.length]}</strong>
          <span>Verified buyer · ${['Mar','Feb','Jan'][i]} 2026</span>
        </figcaption>
      </figure>`).join('');
    rvList.innerHTML = html;
  }

  // accordions
  $$('.acc').forEach(ac => {
    ac.querySelector('.acc__head')?.addEventListener('click', () => {
      ac.classList.toggle('is-open');
    });
  });
}

function bootCart() {
  const body = $('#cartRows');
  const sum = $('#cartSummary');

  function render() {
    const items = Cart.items();
    if (!body) return;
    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <h2>Your bag is empty.</h2>
          <p>Have a look around the shop — we have twenty seasonal items this month.</p>
          <a href="shop.html" class="btn-ink">Shop the harvest <span aria-hidden="true">→</span></a>
        </div>`;
      if (sum) sum.style.display = 'none';
      return;
    }
    if (sum) sum.style.display = '';
    body.innerHTML = `
      <table class="cart-table">
        <thead><tr><th>Item</th><th>Unit</th><th>Quantity</th><th>Line total</th><th></th></tr></thead>
        <tbody>
          ${items.map(({ product: p, qty }) => `
            <tr>
              <td class="cart-cell-item">
                <a href="product.html?id=${p.id}"><img src="${p.img}" alt=""/></a>
                <div>
                  <a href="product.html?id=${p.id}"><strong>${p.title}</strong></a>
                  <small>${p.subcat} · ${p.weight}</small>
                </div>
              </td>
              <td>${fmt(p.price)}</td>
              <td>
                <div class="qty-step">
                  <button type="button" data-dec="${p.id}">−</button>
                  <input type="number" min="1" max="${p.stock}" value="${qty}" data-qty-set="${p.id}" aria-label="Quantity"/>
                  <button type="button" data-inc="${p.id}">+</button>
                </div>
              </td>
              <td>${fmt(p.price * qty)}</td>
              <td><button type="button" class="cart-rm" data-remove="${p.id}" aria-label="Remove">Remove</button></td>
            </tr>`).join('')}
        </tbody>
      </table>`;
    // Summary
    const subtotal = Cart.subtotal();
    const shipping = subtotal >= 50 ? 0 : 8;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    $('#sumSubtotal').textContent = fmt(subtotal);
    $('#sumShipping').textContent = shipping === 0 ? 'Free' : fmt(shipping);
    $('#sumTax').textContent = fmt(tax);
    $('#sumTotal').textContent = fmt(total);
    $('#sumShippingNote').textContent = subtotal >= 50
      ? 'Complimentary delivery applied.'
      : `Add ${fmt(50 - subtotal)} for complimentary delivery.`;
  }
  render();
  document.addEventListener('cart:update', render);
  // direct qty input on cart page
  body?.addEventListener('change', e => {
    const inp = e.target.closest('[data-qty-set]');
    if (inp) {
      const id = Number(inp.dataset.qtySet);
      const qty = Math.max(1, Math.min(Number(inp.max || 999), Number(inp.value) || 1));
      Cart.setQty(id, qty);
    }
  });
}

function bootCheckout() {
  const items = Cart.items();
  const list = $('#coItems'), sumSub = $('#coSub'), sumShip = $('#coShip'), sumTax = $('#coTax'), sumTotal = $('#coTotal');
  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = '<p class="drawer__empty">Your bag is empty. <a href="shop.html">Shop the harvest →</a></p>';
    $('#coForm')?.setAttribute('hidden','');
    return;
  }

  list.innerHTML = items.map(({ product: p, qty }) => `
    <div class="co-item">
      <span class="co-item__img"><img src="${p.img}" alt=""/><em>${qty}</em></span>
      <div class="co-item__body">
        <strong>${p.title}</strong>
        <small>${p.subcat}</small>
      </div>
      <b>${fmt(p.price * qty)}</b>
    </div>`).join('');

  const subtotal = Cart.subtotal();
  const shipping = subtotal >= 50 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  if (sumSub)   sumSub.textContent   = fmt(subtotal);
  if (sumShip)  sumShip.textContent  = shipping === 0 ? 'Free' : fmt(shipping);
  if (sumTax)   sumTax.textContent   = fmt(tax);
  if (sumTotal) sumTotal.textContent = fmt(total);

  // Shipping method toggles
  $$('input[name=ship]').forEach(r => r.addEventListener('change', () => {
    const v = $('input[name=ship]:checked').value;
    const extra = v === 'express' ? 12 : 0;
    const ship2 = shipping + extra;
    const total2 = subtotal + ship2 + tax;
    if (sumShip) sumShip.textContent = ship2 === 0 ? 'Free' : fmt(ship2);
    if (sumTotal) sumTotal.textContent = fmt(total2);
  }));

  // Payment method UI
  $$('input[name=pay]').forEach(r => r.addEventListener('change', () => {
    const v = $('input[name=pay]:checked').value;
    $('#payCard').style.display = v === 'card' ? '' : 'none';
  }));

  $('#coForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (!data.email || !data.firstName || !data.address) return;
    // Persist order
    const order = {
      id: 'GK-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      when: new Date().toISOString(),
      items: items.map(({ product, qty }) => ({ id: product.id, title: product.title, price: product.price, qty })),
      totals: { subtotal, shipping, tax, total },
      ship: data,
    };
    localStorage.setItem('greenkart.lastOrder', JSON.stringify(order));
    Cart.clear();
    location.href = 'thanks.html?order=' + order.id;
  });
}

function bootThanks() {
  const order = JSON.parse(localStorage.getItem('greenkart.lastOrder') || 'null');
  if (!order) { $('#thankBody').innerHTML = '<p>No recent order found. <a href="shop.html">Shop the harvest →</a></p>'; return; }
  $('#orderId').textContent = order.id;
  $('#orderEmail').textContent = order.ship?.email || '—';
  $('#orderTotal').textContent = fmt(order.totals.total);
  const list = $('#orderItems');
  list.innerHTML = order.items.map(it => `
    <div class="co-item">
      <span class="co-item__img"><em>${it.qty}</em></span>
      <div class="co-item__body"><strong>${it.title}</strong></div>
      <b>${fmt(it.price * it.qty)}</b>
    </div>`).join('');
}

function bootJournalList() {
  const grid = $('#journalGrid'); if (!grid) return;
  grid.innerHTML = window.JOURNAL.map(a => `
    <article class="post">
      <a href="journal-post.html?slug=${a.slug}" class="post__img" aria-label="${a.title}"><img src="${a.img}" alt="" loading="lazy"/></a>
      <div class="post__body">
        <span class="post__tag">${a.category} · ${a.read} min</span>
        <h3><a href="journal-post.html?slug=${a.slug}">${a.title}</a></h3>
        <p>${a.excerpt}</p>
        <small>By ${a.author} · ${new Date(a.date).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</small>
      </div>
    </article>`).join('');
}

function bootJournalPost() {
  const slug = new URLSearchParams(location.search).get('slug');
  const a = (window.JOURNAL || []).find(x => x.slug === slug) || window.JOURNAL[0];
  if (!a) return;
  $('#postTitle').textContent = a.title;
  $('#postMeta').textContent = `${a.category} · By ${a.author} · ${a.read} min · ${new Date(a.date).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}`;
  const img = $('#postHero'); if (img) { img.src = a.img; img.alt = ''; }
  $('#postBody').innerHTML = a.body.map(p => `<p>${p}</p>`).join('');
  // Related posts
  const rel = $('#postRelated');
  const others = (window.JOURNAL || []).filter(x => x.slug !== a.slug).slice(0, 2);
  if (rel) rel.innerHTML = others.map(o => `
    <article class="post">
      <a href="journal-post.html?slug=${o.slug}" class="post__img" aria-label="${o.title}"><img src="${o.img}" alt="" loading="lazy"/></a>
      <div class="post__body">
        <span class="post__tag">${o.category}</span>
        <h3><a href="journal-post.html?slug=${o.slug}">${o.title}</a></h3>
      </div>
    </article>`).join('');
}

function bootFarms() {
  const grid = $('#farmsGrid'); if (!grid) return;
  grid.innerHTML = (window.FARMS || []).map(f => `
    <article class="farm">
      <div class="farm__img"><img src="${f.img}" alt="${f.name}" loading="lazy"/></div>
      <div class="farm__body">
        <p class="eyebrow">${f.location}</p>
        <h3>${f.name}</h3>
        <p>${f.text}</p>
        <dl class="farm__meta">
          <div><dt>Since</dt><dd>${f.since}</dd></div>
          <div><dt>Acreage</dt><dd>${f.acres || '—'}</dd></div>
          <div><dt>Speciality</dt><dd>${f.specialty}</dd></div>
        </dl>
      </div>
    </article>`).join('');
}

function bootContact() {
  $('#contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    $('#contactStatus').hidden = false;
    e.target.reset();
  });
}

function bootAccount() {
  $('#signinForm')?.addEventListener('submit', e => {
    e.preventDefault();
    $('#signinStatus').hidden = false;
  });
  const wishWrap = $('#wishList');
  if (wishWrap) {
    const ids = Wishlist.read();
    const items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    wishWrap.innerHTML = items.length === 0
      ? '<p class="drawer__empty">No items saved yet. Browse the <a href="shop.html">shop</a>.</p>'
      : items.map(productCardTpl).join('');
  }
}

/* ===================== Page router ===================== */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  mountShell(page);
  initShellInteractions();
  initReveal();
  if (page === 'home')         bootHome();
  if (page === 'shop')         bootShop();
  if (page === 'product')      bootProduct();
  if (page === 'cart')         bootCart();
  if (page === 'checkout')     bootCheckout();
  if (page === 'thanks')       bootThanks();
  if (page === 'journal')      bootJournalList();
  if (page === 'journal-post') bootJournalPost();
  if (page === 'farms')        bootFarms();
  if (page === 'contact')      bootContact();
  if (page === 'account')      bootAccount();
});
