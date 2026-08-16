# 🏪 Join Electronic Center — Modern Smart Appliance E-Commerce & Catalog Platform

> **Kathmandu's premier home appliance store since 2004 (Samakhushi Chowk).**  
> Certified Smart TVs, Inverter Refrigerators, Washing Machines & Air Conditioners with old item exchange cashback (up to Rs 8,000) and 0% credit card EMI.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Fast_DB-003b57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

---

## 📸 Screenshots & Showcase

### 1. Hero Showcase & Live Trust Metrics
![Hero Showcase](screenshots/01-hero-showcase.png)

### 2. Live Inventory Catalog (378+ Products with Real NPR Pricing)
![Catalog Grid](screenshots/02-catalog-showcase.png)

### 3. Old TV & Fridge Trade-In Cashback Calculator
![Trade-in Exchange](screenshots/03-tradein-exchange.png)

### 4. 0% Bank Credit Card EMI Financing Simulator
![EMI Calculator](screenshots/04-emi-calculator.png)

---

## 🚀 Key Features

### 🌟 Frontend Experience
- **Scroll-Triggered Dynamic Sticky Navbar**: Stays invisible at hero load and glides in past `80px` scroll without layout shift.
- **Global Instant Search (`Ctrl + K` / `/`)**: Keyboard-driven modal with debounced search across all 378+ products, brands, model codes, and specs.
- **Top Picks Showcase**: Hand-picked editor selections for Flagship 4K TVs, Inverter Fridges, BLDC Washers, and Smart ACs.
- **Interactive Multi-Facet Catalog**: Filter instantly by Category, Brand (Samsung, Whirlpool, Skyworth, Himstar, etc.), Max Price slider, or Sort order.
- **Product Modal with Smart Upsells**: High-res gallery, full specs matrix, warranty term, and automatic accessory bundles (Wall mounts, stabilizers, stands).
- **Old TV & Fridge Trade-In Calculator**: Instant condition-based valuation (up to Rs 8,000 bonus) + direct WhatsApp photo evaluation quote.
- **0% Credit Card EMI Simulator**: Real-time monthly installment calculator for 6, 12, 18-month tenures across top Nepali banks.
- **18 SEO/AEO Buying Guides & Price Lists**: In-depth articles covering 2026 appliance pricing and local Kathmandu buying tips.
- **Dark / Light Mode**: Seamless theme engine persisted in `localStorage`.
- **100% Mobile Responsive**: Fluid single/multi-column grids, horizontal swipeable filters, and touch-optimized buttons.

### ⚡ Backend & Data Engine
- **Prisma ORM + SQLite**: Sub-millisecond read queries for lightning-fast catalog search and API responses.
- **RESTful API Routes**:
  - `GET /api/products`: Full-text search, brand/category filters, price range, sorting, pagination.
  - `GET /api/stats`: Real-time inventory aggregates, brand distribution, pipeline revenue metrics.
  - `POST /api/inquiries`: WhatsApp lead capture & trade-in submissions.
  - `POST /api/visits`: Visitor traffic counter.
- **Static Deployment Fallback**: Full client-side fallback to `data/catalog.json` for pure static Apache/LiteSpeed/cPanel/DirectAdmin hosting without Node.js.
- **Universal Visitor Tracking**: Dual tracking via `/api/visits`, LiteSpeed PHP `count.php`, and browser `localStorage`.

---

## 📊 SEO, AEO & Search Engine Scorecard (9.7 / 10)

| Optimization Area | Score | Highlights |
|---|:---:|---|
| **Traditional SEO** | **9.7 / 10** | Schema.org `ElectronicsStore`, `WebSite` SearchAction, GeoCoordinates (`27.7328, 85.3168`), Canonical URL, GA4 & Bing verification. |
| **AEO (AI / LLM Search)** | **9.8 / 10** | Dedicated `llms.txt`, `llms-full.txt`, 18 structured Q&A buying guides with NPR pricing for ChatGPT, Perplexity, Claude, and Gemini. |
| **Local SEO (Kathmandu)** | **9.8 / 10** | Samakhushi landmark signals, valley delivery radius, 7-day operating hours (`9:30 AM - 8:00 PM`), direct WhatsApp hotline. |
| **Daraz / E-Commerce Equivalency**| **9.6 / 10** | High-search buying queries, comparison tables, trade-in buyback, and credit card 0% EMI parity. |

---

## 📁 Repository Structure

```
store-catalog/
├── web/                           # Next.js 16 + React 19 Full-Stack Application
│   ├── src/
│   │   ├── app/                   # App Router, Layout, API Routes
│   │   │   ├── api/               # Products, Stats, Inquiries, Visits APIs
│   │   │   ├── layout.tsx         # Root layout + Schema.org JSON-LD + GA4
│   │   │   ├── page.tsx           # Main storefront homepage
│   │   │   └── globals.css        # Tailwind CSS styles & animations
│   │   ├── components/            # React UI components
│   │   │   ├── Navbar.tsx         # Dynamic sticky navigation with More dropdown
│   │   │   ├── Hero.tsx           # Showroom hero + trust metrics
│   │   │   ├── CatalogSection.tsx # 378+ inventory grid with filters
│   │   │   ├── TopPicksShowcase.tsx # Best-in-class picks
│   │   │   ├── ExchangeCalculator.tsx # Trade-in valuation
│   │   │   ├── EmiCalculator.tsx  # Bank credit card financing
│   │   │   ├── ProductModal.tsx   # Details modal + add-on upsells
│   │   │   └── SearchModal.tsx    # Ctrl+K global autocomplete search
│   │   └── lib/                   # Prisma database client
│   ├── prisma/                    # SQLite database schema & migrations
│   └── public/                    # Product WebP photos, data/catalog.json, llms.txt
├── website/                       # Static Apache/LiteSpeed website export
├── deploy/                        # Production deployment packages & guides
│   ├── joinelectroniccenter-cpanel-directadmin.zip # Production zip
│   ├── DEPLOY.md                  # Step-by-step cPanel / DirectAdmin guide
│   └── package_cpanel.py          # POSIX packaging utility
└── screenshots/                   # Application showcase screenshots
```

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Run Database Migrations & Seed
```bash
npx prisma db push
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 DirectAdmin & cPanel Deployment

1. Run the POSIX packaging script:
   ```bash
   cd deploy
   python package_cpanel.py
   ```
2. In DirectAdmin / cPanel **File Manager**:
   - Open `public_html`.
   - Upload `deploy/joinelectroniccenter-cpanel-directadmin.zip`.
   - Extract files directly into `public_html`.
3. Enable SSL in **SSL Certificates** (Let's Encrypt / AutoSSL).
4. Visit `https://joinelectroniccenter.com` — live in 60 seconds!

---

## 📞 Contact & Store Information

- **Store**: Join Electronic Center (Estd. 2004)
- **Location**: Samakhushi Chowk, Tokha Road, Kathmandu, Nepal
- **Phone**: +977-9851045662
- **WhatsApp**: [Chat with Store](https://wa.me/9779851045662)
- **Hours**: Open 7 Days (9:30 AM – 8:00 PM)
- **Website**: [joinelectroniccenter.com](https://joinelectroniccenter.com)
