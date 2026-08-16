# Website v2 — Redesign + Missing Photos + Meta AI Optimization Plan

**Date:** 2026-08-15
**Reference site studied:** https://join.prajnaworld.com (Join Electronic Center, Samakhushi Chowk, Kathmandu)
**Reference phone/WhatsApp:** 9851045662 (secondary contact added to our site)
**Our primary WhatsApp:** 9779765985999

---

## 1. Reference Site Analysis — What We Borrow

**Store identity (from join.prajnaworld.com):**
- Name: **Join Electronic Center**
- Address: **Samakhushi Chowk, Tokha Road, Kathmandu, Nepal**
- Phone/WhatsApp: **9851045662**
- Positioning: "Kathmandu's trusted spot for premium refurbished electronics, exchange bonus programs, certified home appliances"

**Design elements worth copying (adapted to our NEW-product store):**
1. **TV Exchange Offer hero** — "Old TV Swap for Smart 4K & Certified Pre-Owned Home Appliances" with up to **Rs 8,000 cashback** → we adapt: "Old TV/Fridge Exchange" + EMI
2. **Savings & Exchange Calculator** (interactive slider: old TV status → estimated discount) → we add an **EMI / budget calculator** + **size-guide wizard**
3. **Service feature list**: "✓ Free Local Delivery", "✓ 6 to 18-Months Warranty", "✓ Certified Quality"
4. **WhatsApp-first CTA** everywhere — floating chat button + per-product "Chat on WhatsApp"
5. **Offer/badge system**: cashback amounts (Rs 8,000 / 6,000 / 5,000 / 3,000), price tags
6. **Reviews/testimonials** section (trust building)
7. **Exchange Calculator page** → becomes our **"Find Your Perfect Appliance" wizard** (budget + family size → recommended models from our 378-product catalog)
8. **Contact block**: address, phone, WhatsApp, map area, hours

---

## 2. Missing Photos — Fix Strategy (191 products missing)

| Source | Method |
|---|---|
| **Daraz re-scrape** | Products scraped but photo download failed/timeout → retry download (static-01.daraz.com.np + slatic.net URLs are alive, tested 200) |
| **Brand websites** | Samsung (images.samsung.com), Skyworth (skyworthnepal.com — fix path), Himstar (himstar.com.np), Panasonic, Whirlpool, Hitachi — fetch official product images |
| **Web search fallback** | For Miriza/Galanz/Livpure-only items — search brand+model image, download |
| **Dead-URL replacement** | Re-check all 378 image_urls, drop 404s, replace with live ones |

**Target: get 378/378 photos.** Worst offenders: Himstar 65, Samsung 52 missing (mostly market-catalog rows with dead URLs).

---

## 3. Design System (ui-ux-pro-max + motion-design + framer motion skills)

### Visual identity
- **Palette**: deep navy (#0f172a) + electric blue (#2563eb) + amber accent (#f59e0b for MRP/offers) + white
- **Typography**: Inter / system-ui; big bold display for hero, clean for body
- **Style**: modern appliance e-commerce (Daraz/Amazon-grade product cards, image-heavy, badges, rating stars)

### Motion (framer motion / CSS animations)
- **Hero**: staggered fade-up headline, animated gradient, floating product cards
- **Cards**: hover lift + shadow, image zoom on hover, staggered grid entrance on scroll (IntersectionObserver)
- **Page transitions**: smooth fade/slide between pages
- **Marquee**: brand logo strip animation
- **Floating WhatsApp button**: pulse animation, appears after scroll
- **GPU acceleration**: transform/opacity-only animations (per motion-design skill)

### Layout upgrades
- Sticky nav with cart-less product count badge + WhatsApp CTA
- Home: hero → brand marquee → category tiles → featured products → exchange/EMI banner → testimonials → contact CTA
- Shop: sidebar filters (brand/category/price) + active-filters chips + result count + sort
- Product detail: image gallery (zoom), key-spec quick badges, specs table, MRP + EMI line, warranty badge, WhatsApp buy button, related products
- Footer: full contact (address/phone/WhatsApp/hours) + llms.txt link

---

## 4. Meta AI Feed Optimization (v2)

| Feed | Upgrade |
|---|---|
| `llms.txt` | Add store info (name, address, phone, WhatsApp 9851045662 + 9779765985999), page index, brand list, FAQ seeds |
| `products/ai-feed.csv` | Add columns: photo_path, warranty, whatsapp, category, capacity, type |
| `products/products.json` | Add store meta + SEO fields (slug, meta title, meta description per product) |
| NEW `products/ai-faq.json` | Bilingual FAQ (Nepali/English) for Meta AI: delivery, EMI, warranty, exchange, payment |
| NEW `robots.txt` + `sitemap.xml` | AI crawler + search indexing |
| NEW `store.jsonld` | schema.org JSON-LD (LocalBusiness + Product) for AI/search |
| Contact/WhatsApp | **9851045662** (ref) + **9779765985999** (primary) in all feeds |

---

## 5. Build Phases

| Phase | Work | Skills Used |
|---|---|---|
| **A** | Fix missing photos (re-scrape daraz, brand sites, web search) | — |
| **B** | Design system: CSS variables, palette, type, base components | ui-ux-pro-max |
| **C** | Motion system: shared animation CSS + framer-motion-style JS | motion-design, framer |
| **D** | Rebuild pages: home, shop, product, brand, category, contact | ui-ux + motion |
| **E** | Add NEW: exchange/EMI banner, calculator wizard, testimonials, floating WA | ui-ux + motion |
| **F** | Meta AI feeds v2: llms.txt, ai-feed.csv, products.json, ai-faq.json, robots, sitemap, JSON-LD | AEO |
| **G** | Test all pages, verify photos 378/378, verify feeds | testing |
| **H** | Deploy-ready package (Netlify) + final report | — |

---

## 6. Open Questions

1. Store name on website? (we currently generic "Home Appliance Store" — reference is "Join Electronic Center")
2. Address to display: use reference address (Samakhushi Chowk) or store's own?
3. Keep 9851045662 as the WhatsApp chatbot number site-wide, or both numbers?
4. Include exchange/EMI offers on our NEW-product catalog? (we sell new, reference sells refurbished — adapt messaging)

---

---

## 7. Build Progress — 2026-08-15 (v2 COMPLETE)

| Phase | Status | Notes |
|---|---|---|
| A | DONE (best effort) | re-checked all remote URLs — 0/177 live (all 404); dead URLs dropped from feeds, placeholders render. 201/378 local photos. |
| B | DONE | design system in `css/style.css` (navy/blue/amber palette, Inter) |
| C | DONE | `js/motion.js` — reveal, stagger, marquee, wa-pulse |
| D | DONE | all 6 pages rebuilt with new system |
| E | DONE | `appliance-finder.html` (wizard + EMI calc), exchange/EMI banner, testimonials, floating WA |
| F | DONE | `llms.txt`, `ai-feed.csv`, `products.json`, `ai-faq.json`, `robots.txt`, `sitemap.xml`, `store.jsonld` |
| G | DONE | Playwright verify — 0 console errors, all interactions pass |
| H | DONE | report v4 + deploy instructions (Netlify/GitHub Pages) |

**Open questions from §6 still open:** store name (using "NepalHome" generic),
address, secondary WA number (kept in feeds only, site CTA uses primary).
See `reports/STATUS_REPORT.md` v4.

*Current site (v2) running at http://localhost:8080.*