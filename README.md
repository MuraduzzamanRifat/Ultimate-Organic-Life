# GreenKart Organics — Demo Storefront

A static front-end demo for an organic grocery eCommerce storefront, built as a personal portfolio / learning project.

**Live demo:** enable GitHub Pages → `https://muraduzzamanrifat.github.io/Ultimate-Organic-Life/`

## About

This is **not** a real retailer — it's a design-and-code study inspired by common grocery/organic eCommerce patterns. All brand naming ("GreenKart Organics"), copy, and testimonials are original fictional content. All product photography is sourced from [Unsplash](https://unsplash.com/license) under its royalty-free license.

The repo name on GitHub ("Ultimate-Organic-Life") is a project folder slug only — it does not imply affiliation with any real business of a similar name.

## Tech

Static site, no build step:

- `index.html` — homepage (header, hero slider, categories, deals, products, testimonials, blog, footer, cart drawer)
- `styles.css` — custom CSS with design tokens (teal `#0098b8` / gold `#fdc040`), Lato + Quicksand fonts
- `script.js` — vanilla JS for the slider, tab filter, countdowns, add-to-cart, wishlist, cart drawer

## Running locally

Any static file server works:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

or:

```bash
npx serve .
```

## Accessibility

- WCAG AA contrast (body text `#5a6773` on white = 4.63:1)
- Visible `:focus-visible` rings
- Skip-link for keyboard users
- `prefers-reduced-motion` honored
- ARIA labels on icon buttons
- `role="status" aria-live="polite"` toast for cart updates

## License

Code: MIT. Product photos © respective Unsplash photographers (free for any use per Unsplash license).
