# Home Appliance Store Website + Meta AI Chat Agent — Plan

**Date:** 2026-08-15
**Folder:** `D:\Antigravity Project\store-catalog\website\`

## 1. The Idea (summary)

Build a product showcase website from the **393-record catalog** (`catalog_master.json`) that does TWO jobs:

1. **Customer-facing**: browse/search products by brand & category, view MRP, specs, photos, warranty, contact to buy.
2. **Meta AI-ready**: expose the catalog as structured data (JSON feed + `llms.txt` + Google Sheet link) so the **Meta AI Business Agent** (WhatsApp/Instagram/FB Messenger) can answer customer chats with live prices, specs, photos, and recommendations.

**Flow:**
```
Customer chats in WhatsApp/IG  <-->  Meta AI Agent
        |                                  |
        |                          reads catalog data
        v                                  v
   Website (browse + search)      catalog_master.json / Google Sheet
```

## 2. Website Sections

| # | Page | Content |
|---|------|---------|
| 1 | **Home** | Hero + brand grid (11 brands) + category tiles + popular products |
| 2 | **Shop / Browse** | Filter by brand + category + price range, search box, sort |
| 3 | **Product Detail** | Photo gallery, model code, MRP, specs table, description, warranty, "Chat on WhatsApp" button |
| 4 | **Brands page** | Per-brand landing (logo, product count, all models) |
| 5 | **Categories** | Per-category landing (TV, Fridge, Washing Machine, AC, Cooler, etc.) |
| 6 | **Contact** | Phone, WhatsApp, location, lead form |
| 7 | **API / Agent feed** | `/api/products.json`, `/llms.txt`, `/products/ai-feed.csv` — machine-readable for Meta AI |

## 3. Tech Stack (chosen)

- **Static site**: HTML + CSS + JS (no build step — cheap, fast, easy to host) OR **Next.js** if more interactive needed
- **Data**: single `catalog_master.json` drives all pages (generated at build time)
- **Photos**: served from `photos/` folder
- **Meta AI integration**: 
  - Google Sheet (existing plan) for Meta's built-in "Price list" feature
  - `llms.txt` + JSON feed so Meta AI / crawlers read full catalog
- **Hosting**: GitHub Pages / Netlify / Vercel / local

## 4. Why This Works for Meta AI Agent

Meta AI Agent (WhatsApp Business) supports:
- **Price list via Google Sheets** — already prepared (`meta_ai_store_catalog.csv`)
- **Catalog sync** — product feed via URL
- **AI instructions** — already written in `meta_ai_agent_instructions.md` (bilingual Nepali/English)

The website adds a **public product feed** the agent can reference for up-to-date specs + photos, and a **click-to-chat** button so website visitors reach the agent directly.

## 5. Build Phases

| Phase | Work | Output |
|-------|------|--------|
| **A** | Scaffold static site structure, copy catalog JSON + photos in | `website/` skeleton |
| **B** | Build home + browse + search + filter (JS) | `index.html`, `shop.html` |
| **C** | Build product detail + brands + categories pages | `product.html`, `brand.html`, `category.html` |
| **D** | Generate `/api/products.json`, `/llms.txt`, AI feed CSV | agent-ready files |
| **E** | Click-to-WhatsApp + contact + lead form | conversion paths |
| **F** | Test locally, then deploy decision | working site + deploy target |

## 6. Design Direction

- **Clean appliance-store aesthetic**: white + brand-blue, product-card grid, big photos
- **Bilingual touches**: Nepali + English labels (नमस्ते / MRP रु.)
- **Mobile-first** (most customers on WhatsApp/phone)
- **Fast**: static pages, lazy-loaded images

## 7. Open Questions

1. Hosting preference? (GitHub Pages / Netlify / Vercel / local-only)
2. Store name + logo available? (currently using generic branding)
3. Static site or Next.js app?
4. WhatsApp Business number for click-to-chat link?
5. Deploy now or build locally first?

---

*Data source: `store-catalog\data\merged\catalog_master.json` (393 products, 201 photos, 11 brands).*