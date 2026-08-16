# Store Catalog — Status Report v5 (Rebranded + Deploy-ready)

**Date:** 2026-08-15
**Brand:** Join Electronic Center — joinelectroniccenter.com
**WhatsApp Business:** +977-9765985999 / 9851045662
**Server:** http://localhost:8080 (PID 10584)

## 1. Catalog (unchanged from v3)
- **378 records**, deduped, all with description/specs/model_code/whatsapp
- 11 brands, 9 categories, MRP NPR 120 – 399,990

## 2. Website v2 — REBUILT (PLAN_v2_redesign.md, phases B–H done)
New design system: navy `#0f172a` + electric blue `#2563eb` + amber `#f59e0b`.
Motion: scroll-reveal (IntersectionObserver), staggered grids, floating hero badges,
brand marquee, pulsing floating WhatsApp button (GPU-only transforms).

| Page | Route | Status |
|---|---|---|
| Home | index.html | hero + stats + marquee + brand/category tiles + EMI/exchange banner + featured + testimonials |
| Shop | shop.html | filter/search/sort + active-filter chips + result count |
| Appliance Finder | appliance-finder.html | NEW — budget + family-size wizard + EMI calculator |
| Product detail | product.html?model=X | gallery, key-spec badges, EMI line, warranty, related products |
| Brand | brand.html?brand=Name | landing + grid |
| Category | category.html?cat=Name | landing + grid |
| Contact | contact.html | phone/WA/location/EMI-exchange cards + WhatsApp lead form |

**All pages render with zero console errors (Playwright verified).**

## 3. Photos (Phase A — best effort)
- **201/378 products have local photos** (220 files in `photos/`)
- **177 remaining have NO working source** — every remote `image_url` re-checked:
  **0/177 live** (all 404). Dead URLs now dropped from feeds; site shows brand
  placeholder instead of broken image. No more 404 console noise.
- Full Daraz re-scrape (Playwright) still possible later if desired — blocked by
  time/captcha in this session, not by tooling.

## 4. Meta AI / AEO feeds v2 (Phase F) — ALL READY
| Feed | Content |
|---|---|
| `llms.txt` | store info, page index, brands, 6 FAQ, endpoints |
| `products/ai-feed.csv` | 378 rows; cols: brand, category, type, capacity, model_code, name, mrp, photo_path, image_url, warranty, source, whatsapp |
| `products/products.json` | `{store, products}` — store meta + per-product slug, meta_title, meta_description, emi_monthly_12 |
| `products/ai-faq.json` | 6 bilingual (Nepali/English) FAQ |
| `robots.txt` | allow all + sitemap |
| `sitemap.xml` | 378 product URLs + pages |
| `store.jsonld` | LocalBusiness/Store + 40 Product offers, schema.org |

## 5. Data pipeline
- `scraper/build_site_v2.py` — regenerates all site data + feeds from `catalog_master.json`
  (assigns photo_path by scanning `photos/`, adds SEO/EMI fields, drops dead URLs)
- `scraper/check_image_urls.py` — probes remote image URLs, writes `data/raw/image_live.json`
- Existing: `daraz_scraper.py`, `fix_photos.py`, `merge_catalog.py`, `refresh_site_data.py`

## 6. Remaining gaps
| # | Gap | Fix |
|---|---|---|
| 1 | Google Sheets upload blocked | create `credentials\service_account.json`, run `scraper\upload_sheets.py` |
| 2 | 177 products photo-less | re-scrape Daraz via `daraz_scraper.py` (Playwright) or add brand-site images manually |
| 3 | Live deploy pending | upload `deploy\joinelectroniccenter-site.zip` via cPanel `public_html` — see `deploy\DEPLOY.md` |
| 4 | Meta AI Messenger agent build | follow `reports\META_AI_MESSENGER_SETUP.md` once Sheet + deploy are live |

## 6b. v5 changes (this session)
- **Rebranded to Join Electronic Center** across all 7 pages + `catalog.js`
  (logo `JEC`, titles, footer, JSON-LD). No "NepalHome" references remain.
- **Real store info live**: Samakhushi Chowk, Tokha Road, Kathmandu + both numbers.
- **Domain = https://joinelectroniccenter.com** in every feed: `llms.txt`,
  `sitemap.xml` (387 URLs), `store.jsonld`, `products.json`, `ai-feed.csv`,
  `data/catalog.json`.
- **Photo URLs added**: new `photo_url` column (absolute `.../photos/...` URLs,
  201 populated) + `Product URL` in feeds so the Meta agent can fetch images.
- **Deploy package**: `deploy\joinelectroniccenter-site.zip` (240 files incl.
  all photos, 104 MB) + `deploy\DEPLOY.md` (cPanel + Netlify options).
- **Meta AI agent**: `reports\META_AI_AGENT_INSTRUCTIONS.md` (paste-ready) +
  `reports\META_AI_MESSENGER_SETUP.md` (step-by-step build & test).
- `upload_sheets.py` upgraded: adds Photo URL + Product URL columns, auto-shares
  "anyone with link (viewer)", supports `--url <sheet-url>` for existing sheets.
- Playwright re-verify after rebrand: **0 console errors, PASS**.

## 6d. v5.1 — Reviews, posts, Exchange & Second Hand
- **Real reviews on home**: 3 actual Tripadvisor reviews (Bibek Acharya x2, Bidur
  Aryal) replace placeholder testimonials, with "Rated 5.0 on Tripadvisor" + links
  to the Tripadvisor page and a "share your review" WhatsApp CTA.
- **Schema**: `store.jsonld` now has `aggregateRating` (5.0 / 3 reviews) + 2
  `Review` objects (generated in `build_site_v2.py`).
- **NEW `posts.json` feed** (offers + news): exchange cashback promo, EMI promo,
  20+ years legacy. Rendered in a new "Offers & news" section on home.
- **NEW `exchange.html`**: how it works (photo → quote → pickup → cashback off),
  what we accept (TV/fridge/WM/AC/purifier/office electronics, any brand, working
  or not), condition-based cashback, FAQ + FAQPage schema, WhatsApp quote CTA.
- **NEW `second-hand.html`**: condition grades A/B/C, tested + serviced, 30-day
  service guarantee, 40-60% below new, "ask on WhatsApp for today's stock",
  FAQ + FAQPage schema.
- **Site-wide**: nav + footer now include Exchange + Second Hand on all 9 pages;
  sitemap.xml + llms.txt include both pages + posts.json; new About/why-us section
  on home (20+ years, sales/service/exchange/repair, free delivery).
- `META_AI_AGENT_INSTRUCTIONS.md` updated: agent now handles exchange + second-hand.
- Deploy ZIP regenerated. Playwright: **0 console errors, PASS** on all pages.

## 6e. v5.2 — Socials, Blog, Visit counter, Google review box
- **Social links everywhere**: footer icon row (FB / Instagram / TikTok / YouTube
  / Tripadvisor) on all 10 pages. Real handles: facebook.com/joinelectroniccenter,
  instagram.com/joinelectronic, tiktok.com/@joinelectronicscentre.
- **`social.json`** feed (platforms + 3 real posts: Rs 17,000 WM offer, stock
  clearance, 20+ years). Rendered as "Follow us & latest posts" on home + social
  list on contact.
- **Blog (SEO/AEO)**: `blog.html` hub + 4 guides in `blog/blog.json`
  (refrigerator buying guide, EMI explained, old TV exchange, cooler vs AC).
  Each post: CITE structure (core answer → sections → CTA), `BlogPosting` schema
  injected per post, canonical to `?post=slug`, keyword meta. Blog + posts in
  sitemap.xml (4 URLs) and llms.txt (with socials). Nav link on all pages.
- **Visit counter**: `count.php` (real global count on cPanel/LiteSpeed host,
  writes `data/visits.json`) with localStorage fallback for static hosts
  (Netlify). Visit box on home hero + contact. countapi.xyz was tested and is
  **dead** (DNS fail) — self-hosted PHP chosen instead.
- **Google review box** (contact.html #reviews): "Write a Google review" button
  (link to Google Maps listing — replace with your `g.page` short link when you
  have it), WhatsApp quick-review form (name + rating + review → wa.me), and a
  "Follow us" card.
- Deploy ZIP regenerated (248 files). Playwright: **0 console errors, PASS**.

## 6f. v6 — Offers & testimonials upgrade (animated) + Node.js server
- **Offers & news**: 5 posts (added: second-hand clearance, free delivery/install).
  New `.post-card` design — gradient top accent, hover lift + shadow, Offer/News
  chips, arrow CTA; entire card is a link. Section subtitle added.
- **What our customers say**: now a **carousel** — 4 slides (3 real Tripadvisor
  reviews + Facebook "100% recommend" card), prev/next arrows, clickable dots,
  auto-rotate every 5s, pauses on hover, slide transition. Added animated
  **ratings strip** (count-up on scroll into view): 5.0 Tripadvisor, 100%
  recommend on Facebook, 12 Google/FB reviews, 20+ years.
- **Node.js**: `server.js` — static file server + **`/count` endpoint** (live visit
  counter, writes `data/visits.json`). `package.json` with `npm start`. Counter
  chain: `/count` (Node) → `count.php` (cPanel/PHP) → localStorage. Works in dev
  (`node server.js` → http://localhost:8080) and on cPanel with PHP fallback.
- Verified with Playwright against the Node server: 5 post cards, carousel advances
  (`translateX(-100%)` on Next), 4 dots, counters animate, live counter responds,
  **0 console errors, PASS**. Deploy ZIP regenerated (now includes server.js +
  package.json).

## 6g. v6.1 — Blocker/Conversion/SEO/Performance/Trust pass
- **Photos (blocker)**: all 201 local photos converted to **WebP** (q82). Zip dropped
  **104.5 MB → 15.8 MB (-85%)**. Fixed `PHOTOS` path bug in `build_site_v2.py` +
  stem-based remap → 201/201 photo_paths resolve (199 webp + 2 jpg kept). 177
  photo-less products keep branded placeholders with "Ask on WhatsApp for photo"
  hint; real stock photos need user-supplied shots (best quality anyway).
- **Conversion**: availability badges on every card — "✓ In stock" (green, has
  photo) vs "Ask availability" (amber) → drives WhatsApp inquiry for photo-less
  items. Product page shows matching in-stock / ask-availability banner. EMI moved
  to card-body line (badge row now availability). Lead form gained optional email
  field (included in WhatsApp text) for future broadcast capture.
- **Traffic/SEO**: GA4 (gtag) injected on all 13 pages (placeholder `G-XXXXXXX` —
  user pastes real ID). Search Console + Bing verification meta placeholders in
  head (commented). +2 blog posts (second-hand buying guide, washing machine
  prices) → 6 posts total, all in llms.txt + sitemap. New pages in sitemap/llms.
- **Performance**: WebP above; `.htaccess` (gzip/deflate, 1-year image cache, JSON/
  HTML caching, security headers, custom 404, optional www+HTTPS redirects). No
  hero `<img>` (text hero) so fetchpriority skipped.
- **Trust**: new `about.html` (20+ years, brands, how we work + AboutPage schema),
  `warranty.html` (warranty/delivery/returns + FAQPage schema), `404.html`
  (noindex, home/shop/WhatsApp CTAs). About + Warranty added to footer quick links
  on 6+ pages. sitemap + llms updated (about, warranty).
- Verified full site on Node server: 14 pages + `/count` — **0 console errors,
  PASS** (5 posts, 4 testimonial slides, 378 cards, availability badges both
  states, 74 brand / 95 category cards). Deploy ZIP regenerated at 15.8 MB.
- **Needs user**: stock photos for the 177 photo-less products (everything else set).

## 6h. v6.2 — Live tracking + review link configured
- **GA4 active**: `G-JYNYWLHKZJ` gtag on all 13 pages (incl. 404). Data will flow
  once deployed.
- **Search Console**: `<meta name="google-site-verification"
  content="eN_w_K_cmJ3DwzAIVwAXQ4dtziGlorjbp03BR3TeAYI">` on all pages.
- **Bing Webmaster**: `<meta name="msvalidate.01"
  content="132FD1EBFB4DC860368794F461320DB9">` on all pages.
- **Google review link**: contact.html "Write a Google review" button now points to
  `https://g.page/r/CRBpNA834DU9EBM/review`. Added to `llms.txt` Social (and kept in
  build script so rebuilds keep it). "Ask us for the link" placeholder removed.
- Verified served headers contain GA + both verification metas + g.page. Deploy ZIP
  regenerated (15.8 MB).

## 6i. v6.3 — 74 keywords mapped + official GA snippet + photo cleanup
- **Keyword → page mapping** (74 researched keywords, E + H buckets):
  - **12 new blog posts** added to `blog/blog.json` (6 → 18 posts) via 3 parallel content
    agents; each targets a head term + related keywords with real NPR prices:
    TV cluster (tv-price-in-nepal-2026, best-55-inch-4k-tv-nepal, skyworth-tv-price-nepal),
    fridge (refrigerator-price-nepal-2026, best-refrigerator-in-nepal-2026),
    washing (washing-machine-price-nepal-2026, best-washing-machine-nepal-2026),
    AC/cooler (ac-price-nepal-2026, air-cooler-price-nepal-2026),
    purifier (water-purifier-price-nepal-2026), second-hand + exchange
    (second-hand-appliance-price-nepal-2026), small appliances
    (small-appliances-price-nepal-2026).
  - **Dynamic keyword meta** on `category.html` (9 categories) + `brand.html`
    (12 brands): sets title + meta description + OG/Twitter per selection, keyword-rich
    (e.g. "TV price in Nepal", "Skyworth TV price in Nepal", "Refrigerator price in Nepal").
  - `shop.html` + `index.html` meta updated for local cluster
    (appliance store Kathmandu / Samakhushi / best appliance prices).
- **Official GA snippet**: compressed one-liner replaced with the exact multi-line
  Google tag (`gtag('js',...)` + `gtag('config','G-JYNYWLHKZJ')`) on all 13 pages.
  Verified: `window.gtag` defined + gtag.js requested + dataLayer pushed on all 40
  test URLs (pages, categories, brands, all 18 blog posts).
- **Feeds**: sitemap.xml + llms.txt updated via `build_site_v2.py` (blog list now
  includes all 18 posts, generated + kept in build script).
- **Photo cleanup**: 204 orphan/unreferenced webp removed from `site/photos`
  (18.6 MB) — deploy ZIP back under 30 MB (27 MB).
- **Verify**: Playwright, node server — 40 URLs, **0 console errors**; all 18 blog
  posts render with title; dynamic meta confirmed on 9 categories + 12 brands.
- Deploy ZIP regenerated (27 MB). Stale node server on 8080 killed (old build
  lacked /count) and restarted.

## 6j. v6.4 — Per-product SEO/AEO closed (all gaps fixed)
Fixes the audit gaps: product pages now fully structured for LLMs + search engines.
- **Per-product keywords**: `product_keywords()` generator in `build_site_v2.py` —
  every one of 378 products gets a `keywords[]` + `meta_keywords` string (brand +
  category + capacity combos, "{brand} {category} price in Nepal", product-name
  price phrase, category head term, model code). De-duplicated, max 8, brand/model
  redundancy filtered.
- **product.html**: now uses enriched `meta_title` ("{product} Price in Nepal | JEC")
  + `meta_description` (price + warranty + 0% EMI + free delivery); sets OG/Twitter
  image/title/desc + **`meta keywords` tag**; injects full **Product JSON-LD**
  per product (name, sku, mpn, brand, category, `keywords[]`, image, offers{NPR
  price, InStock, NewCondition, seller Store}).
- **store.jsonld**: `hasOfferCatalog.itemListElement` = **all 378 products** (was
  40) with keywords, mpn, category, image, seller.
- **Verify**: Playwright — 12 sample product pages: Product schema + offers +
  keywords meta + description meta present, **0 console errors**. Full 40-URL
  regression still **0 errors**, GA on all pages.
- Deploy ZIP regenerated (27.1 MB).

## 6k. v6.5 — P1: internal links, llms-full.txt, static product pages, breadcrumbs, map
- **Blog internal links**: `blog.json` — all 18 posts got a "Shop related products &
  guides" section linking category pages, 3 real products (same category, with Rs
  price), a related guide, exchange/second-hand/appliance-finder. `blog.html` now
  renders list items as HTML so links work. 7+ anchors per post.
- **llms-full.txt**: generated by build script — 378 lines of `- /product-SLUG.html -
  NAME (MODEL) | BRAND | CATEGORY | Rs X NPR | warranty`. AI crawlers read full
  catalog in one file. Linked from llms.txt.
- **Static product pages**: `write_static_products()` in build script generates
  378 `product-<slug>.html` files — each has inline **Product + BreadcrumbList
  JSON-LD** in raw HTML (no JS needed for crawlers), static canonical, model-code
  meta. `catalog.json` `url` switched to static pages; product.html still works via
  `?model=` fallback. Sitemap now lists 378 static URLs. Slugs deduped.
- **BreadcrumbList schema**: added to product pages (Home › Category › Product),
  category.html, brand.html, blog.html posts (Home › Blog › Post).
- **Google Maps**: contact.html — embedded map iframe + "Get Directions" link
  (local-pack boost).
- **Verify**: Playwright — static product (inline schema + render + 0 errors),
  7 blog links render, category/brand breadcrumbs, contact map, llms-full 378
  lines — all pass; full 40-URL regression still **0 console errors**, GA on all.
- Deploy ZIP regenerated: **29.3 MB / 714 files** (was 27.1 / 336) due to 378 static pages.

## 6m. v6.7 — SEO/AEO gap fixes (post-audit)
- **GA4 dedup**: removed duplicate `gtag('config')` block injected in every `<head>` (cleanup regex didn't match multiline). 391 pages now load exactly one config; regression 40 URLs, 0 console errors.
- **Meta descriptions ≤160**: index (156), shop (152), blog (157), exchange (155), second-hand (154), plus runtime `BRAND_META` (Samsung/Himstar/AURA) and `CAT_META` (Refrigerator) trimmed.
- **ItemList schema**: new `C.itemListSchema()` in catalog.js — shop/category/brand pages now emit `ItemList` JSON-LD (top 20 items with static URLs) on render, alongside BreadcrumbList.
- **Static product canonical fix**: JS `pageUrl` now detects `/product-` path and canonicalizes to own static URL instead of rewriting to `product.html?model=`. Confirmed live on product page.
- **robots.txt**: llms.txt Sitemap entry + explicit Allow for GPTBot / Google-Extended / ClaudeBot / PerplexityBot / ChatGPT-User (build script updated too).
- Verify: all 13 page checks green (title, desc 50-160, canonical, 1 h1, 1 gtag config, JSON-LD); zip rebuilt 29.3 MB.

## 6l. v6.6 — P2: GA4 ecommerce events + Meta Pixel (ready)
- **`js/analytics.js`** (new, on all 391 HTML pages): GA4 + Meta tracking helpers.
  - **GA4 enhanced ecommerce events**: `view_item` (product page, with
    items[NPR price]), `view_item_list` (shop / category / brand, cap 10),
    `select_item` (card click, via `data-model` + delegated listener in
    catalog.js), `whatsapp_contact` (any WhatsApp link click, delegated),
    `generate_lead` (contact form submit, fires only after validation passes).
  - **Meta Pixel**: loader + `fbq` helpers (`PageView`, `ViewContent`,
    `Contact`, `Lead`) — **disabled until Pixel ID set**. Set it two ways:
    (a) edit `PIXEL_ID` at top of `js/analytics.js`, or (b) call
    `JEC.setPixelId('...')` — e.g. paste into browser console or a script tag.
  - `catalog.js` product cards now link to static `/product-SLUG.html` and carry
    `data-model` for tracking.
- **Verify**: Playwright — view_item ✓, view_item_list ✓, select_item ✓,
  whatsapp_contact ✓, generate_lead ✓, **0 console errors** (40-URL regression
  still 0). Note: gtag.js stores events as array-like objects
  (`{"0":"event","1":"view_item"}`), which is normal.
- Deploy ZIP regenerated (29.3 MB).

## 6c. SEO + AEO pass (CITE framework, adapted)
Applied CITE + hub-and-spoke to the 7-page hub (shop = product hub; brand/category
pages = spokes linking back; index links all spokes in nav).
- **Canonical + Open Graph + Twitter cards** on all 7 pages (local keyword titles,
  e.g. "Home Appliances Store in Kathmandu, Nepal").
- **Local SEO keywords** in H1/meta: Kathmandu, Samakhushi, Tokha Road, NPR pricing.
- **Schema**: Organization + LocalBusiness on index; full LocalBusiness (address,
  hours, price range) + **FAQPage** on contact; Product offers in `store.jsonld`.
- **Dynamic canonical** on product.html set via JS to the real model URL.
- **JEC favicon** fixed (was NH) on all pages.
- **AEO**: `llms.txt` (store facts, pages, brands, 6 FAQ, data endpoints),
  `ai-feed.csv` (378 rows incl. photo_url + product URL), `products.json`,
  `ai-faq.json` (bilingual), `sitemap.xml`, `robots.txt` — all point at live domain.
- Re-verify: **0 console errors, PASS**. Note: `og:image` uses a sample product
  photo; swap to a brand card image later if desired.

## 7. Deploy (Phase H)
Deploy package ready: `deploy\joinelectroniccenter-site.zip` + `deploy\DEPLOY.md`.
Site is pure static — cPanel File Manager extract into `public_html`, or Netlify.
After deploy: verify `https://joinelectroniccenter.com/data/catalog.json` and a
sample photo URL, then run Meta AI setup (`reports\META_AI_MESSENGER_SETUP.md`).

## 8. How to view
- Node server (visit counter live): `node server.js` from
  `store-catalog\website\site` → **http://localhost:8080**
- Plain static: `python -m http.server 8080 --directory "d:\Antigravity Project\store-catalog\website\site"`