import csv
import html
import json
import os
import re
from pathlib import Path

BASE = Path(r"D:\Antigravity Project\store-catalog")
SITE = BASE / "website" / "site"
MERGED = BASE / "data" / "merged" / "catalog_master.json"
PHOTOS = SITE / "photos"

STORE = {
    "name": "Join Electronic Center",
    "tagline": "Kathmandu's Trusted Home Appliance Store",
    "address": "Samakhushi Chowk, Tokha Road, Kathmandu, Nepal",
    "phone": "+977-9765985999",
    "whatsapp": "9779765985999",
    "whatsapp_secondary": "9851045662",
    "hours": "Open daily, 9 AM - 7 PM (NPT)",
    "delivery": "Free local delivery in Kathmandu valley; shipping across Nepal",
    "url": "https://joinelectroniccenter.com",
    "language": "ne, en",
    "currency": "NPR",
    "logo_initials": "JEC",
}

FAQS = [
    {
        "id": "delivery",
        "q_en": "Do you deliver across Nepal?",
        "a_en": "Yes, we deliver home appliances across Nepal. Free local delivery inside Kathmandu valley, and shipping is available to all districts.",
        "q_ne": "\u0915\u0947 \u0938\u092e\u094d\u092a\u0942\u0930\u094d\u0923 \u0928\u0947\u092a\u093e\u0932\u092d\u0930\u093f \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u0939\u0941\u0928\u094d\u092d?",
        "a_ne": "\u0939\u094b, \u0939\u093e\u092e\u0940 \u0938\u092e\u094d\u092a\u0942\u0930\u094d\u0923 \u0928\u0947\u092a\u093e\u0932\u092d\u0930\u093f \u0918\u0930\u093e\u092f\u0942 \u0909\u092a\u0915\u0930\u0923\u0939\u0930\u0942 \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u0917\u0930\u094d\u0926\u094d\u091b\u094c\u0902\u0964 \u0915\u093e\u0920\u092e\u093e\u0921\u094c\u0902 \u0909\u092a\u0924\u094d\u092f\u0915\u093e\u093e \u0932\u093e\u0917\u093f \u0928\u093f\u0936\u0941\u0932\u094d\u0915 \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u0930 \u0938\u092c\u0948 \u091c\u093f\u0932\u094d\u0932\u093e\u0939\u0930\u0941\u092e\u093e \u092a\u093e\u0920\u093e\u0909\u0928\u094d\u091b\u094c\u0902\u0964",
    },
    {
        "id": "emi",
        "q_en": "Do you offer EMI payment options?",
        "a_en": "Yes, easy monthly installment (EMI) options are available on selected products. Contact us on WhatsApp with the model you like and we will share the EMI plan.",
        "q_ne": "\u0915\u0947 \u0908\u090f\u092e\u0906\u0908 \u0924\u0930\u093f\u0915\u093e \u092a\u094d\u0930\u0926\u093e\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u0941\u0928\u094d\u091b?",
        "a_ne": "\u0939\u094b, \u091b\u0928\u0947\u0915\u093e \u0909\u0924\u094d\u092a\u093e\u0926\u0928\u0939\u0930\u0941\u092e\u093e \u0938\u0939\u091c \u092e\u093e\u0938\u093f\u0915 \u0915\u093f\u0938\u094d\u0924\u093e (EMI) \u0938\u0941\u092c\u093f\u0927\u093e \u0909\u092a\u0932\u092c\u094d\u0927 \u091b\u0964 \u092e\u0928 \u092a\u0930\u0947\u0915\u094b \u092e\u0949\u0921\u0947\u0932 WhatsApp \u092e\u093e \u092a\u0920\u093e\u0909\u0928\u0941\u0939\u094b\u0938 \u0930 \u0939\u093e\u092e\u0940 EMI \u092f\u094b\u091c\u0928\u093e \u092a\u0924\u093e\u0909\u0901\u091b\u094c\u0902\u0964",
    },
    {
        "id": "warranty",
        "q_en": "What warranty do your products have?",
        "a_en": "All products come with manufacturer warranty. Most refrigerators, TVs and washing machines carry 1 year full service warranty and compressors/panels are covered longer (check each product page).",
        "q_ne": "\u0915\u0947 \u0924\u092a\u093e\u0908\u0915\u093e \u0909\u0924\u094d\u092a\u093e\u0926\u0928\u0915\u094b \u0935\u093e\u0930\u0928\u094d\u091f\u0940 \u0915\u0938\u094d\u0924\u094b \u091b?",
        "a_ne": "\u0938\u092c\u0948 \u0909\u0924\u094d\u092a\u093e\u0926\u0928\u092e\u093e \u0928\u093f\u0930\u094d\u092e\u093e\u0924\u093e \u0935\u093e\u0930\u0928\u094d\u091f\u0940 \u0939\u0941\u0928\u094d\u091b\u0964 \u0927\u0947\u0930\u0948 \u092b\u094d\u0930\u093f\u091c, TV \u0930 \u0935\u093e\u0936\u093f\u0919 \u092e\u0938\u093f\u0928\u092e\u093e 1 \u0935\u0930\u094d\u0937 \u092b\u0941\u0932 \u0938\u0930\u094d\u0935\u093f\u0938 \u0935\u093e\u0930\u0928\u094d\u091f\u0940 \u0930 \u0915\u092e\u094d\u092a\u094d\u0930\u0947\u0938\u0930/\u092a\u0928\u0947\u0932 \u092e\u093e \u0932\u093e\u092e\u094b \u0935\u093e\u0930\u0928\u094d\u091f\u0940 \u0939\u0941\u0928\u094d\u091b (हेरेक \u0909\u0924\u094d\u092a\u093e\u0926\u0928 \u092a\u0947\u091c \u0939\u0947\u0930\u094d\u0928\u0941\u0939\u094b\u0938)\u0964",
    },
    {
        "id": "exchange",
        "q_en": "Can I exchange my old TV or fridge?",
        "a_en": "Yes! We accept old TV and fridge exchange with cashback value depending on the condition of your old unit. Send us a photo on WhatsApp for a quote.",
        "q_ne": "\u0915\u0947 \u092a\u0941\u0930\u093e\u0928\u094b TV \u0935\u093e \u092b\u094d\u0930\u093f\u091c \u0938\u093e\u091f\u092a\u093e\u091f \u0917\u0930\u094d\u0928 \u0938\u0915\u093f\u0928\u094d\u091b?",
        "a_ne": "\u0939\u094b! \u0939\u093e\u092e\u0940 \u092a\u0941\u0930\u093e\u0928\u094b TV \u0930 \u092b\u094d\u0930\u093f\u091c \u0938\u0935\u093e\u092a\u091f \u0932\u093f\u0928\u094d\u091b\u094c\u0902, \u092a\u0941\u0930\u093e\u0928\u094b \u0909\u092a\u0915\u0930\u0923\u0915\u094b \u0905\u0935\u0938\u094d\u0925\u093e \u0905\u0928\u0941\u0938\u093e\u0930 \u0915\u0947\u0936\u092c\u0947\u0915 \u092e\u0942\u0932\u094d\u092f \u0926\u093f\u0928\u094d\u091b\u094c\u0902\u0964 WhatsApp \u092e\u093e \u092b\u094b\u091f\u094b \u092a\u0920\u093e\u0909\u0928\u0941\u0939\u094b\u0938 \u0930 \u092d\u093e\u0935 \u092a\u093e\u0909\u0928\u0941\u0939\u0941\u0928\u094d\u091b\u0964",
    },
    {
        "id": "payment",
        "q_en": "What payment methods do you accept?",
        "a_en": "We accept cash on delivery (COD), bank transfer, eSewa/Khalti, and card payments. EMI available on selected products.",
        "q_ne": "\u0915\u0947 \u0915\u0941\u0928 \u0915\u0941\u0928 \u092d\u0941\u0915\u094d\u0924\u093e\u0928\u093f \u0935\u093f\u0927\u093f \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0917\u0930\u094d\u0928\u0941\u0939\u0941\u0928\u094d\u091b?",
        "a_ne": "\u0939\u093e\u092e\u0940 COD (\u0915\u0947\u0936 \u0911\u0928 \u0921\u093f\u0932\u093f\u0935\u0930\u0940), \u092c\u0948\u0902\u0915 \u091f\u094d\u0930\u093e\u0928\u094d\u0938\u092b\u0930, eSewa/Khalti \u0930 \u0915\u093e\u0930\u094d\u0921 \u092d\u0941\u0915\u094d\u0924\u093e\u0928\u093f \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0917\u0930\u094d\u0926\u094d\u091b\u094c\u0902\u0964 \u091b\u0928\u0947\u0915\u093e \u0909\u0924\u094d\u092a\u093e\u0926\u0928\u092e\u093e EMI \u092a\u0928\u093f \u0909\u092a\u0932\u092c\u094d\u0927 \u091b\u0964",
    },
    {
        "id": "order",
        "q_en": "How do I order a product?",
        "a_en": "Simple: open any product page and tap 'Chat on WhatsApp', or send us the model code. We confirm price, availability, delivery and warranty, then arrange delivery.",
        "q_ne": "\u0915\u0947 \u092e \u0915\u0938\u0930\u0940 \u0905\u0930\u094d\u0921\u0930 \u0917\u0930\u094d\u0928\u0947?",
        "a_ne": "\u0938\u092c\u0948\u092d\u0928\u094d\u0926\u093e \u0938\u091c\u093f\u0932\u094b: \u0915\u0941\u0928\u0948 \u0909\u0924\u094d\u092a\u093e\u0926\u0928 \u092a\u0947\u091c \u0916\u094b\u0932\u0947\u0930 \u2018Chat on WhatsApp\u2019 \u0925\u093f\u091a\u094d\u091a \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938, \u0935\u093e \u092e\u094b\u0921\u0947\u0932 \u0915\u094b\u0921 \u092a\u0920\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u0964 \u0939\u093e\u092e\u0940 \u092e\u0942\u0932\u094d\u092f, \u0909\u092a\u0932\u092c\u094d\u0927\u0924\u093e, \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u0930 \u0935\u093e\u0930\u0928\u094d\u091f\u0940 \u092a\u0915\u094d\u0937\u093e \u0917\u0930\u0947\u0930 \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u092e\u093f\u0932\u093e\u0909\u0902\u091b\u094c\u0902\u0964",
    },
]


def slugify(text):
    s = re.sub(r"[^A-Za-z0-9]+", "-", text or "").strip("-").lower()
    return s[:80]


def clean_html(s):
    return re.sub(r"\s+", " ", html.unescape(str(s or ""))).strip()


def emi12(price):
    r = 0.015
    n = 12
    f = r * (1 + r) ** n / ((1 + r) ** n - 1)
    return int(round(price * f))


GENERIC_KEYWORDS = {
    "Television": "TV price in Nepal",
    "Refrigerator": "refrigerator price in Nepal",
    "Washing Machine": "washing machine price in Nepal",
    "Air Conditioner": "AC price in Nepal",
    "Air Cooler": "air cooler price in Nepal",
    "Water Purifier": "water purifier price in Nepal",
    "Water Dispenser": "water dispenser price in Nepal",
    "Microwave Oven": "microwave oven price in Nepal",
    "Small Home Appliance": "small home appliance price Nepal",
}


def product_keywords(r):
    """Generate targeted SEO keywords for one product (max 8, de-duplicated)."""
    brand = r.get("brand") or ""
    cat = r.get("category") or ""
    cap = r.get("capacity") or ""
    name = r.get("product_name") or ""
    model = r.get("model_code") or ""
    kw = []
    parts = [p for p in [brand, cap, cat] if p]
    if parts:
        kw.append(" ".join(parts))
        kw.append(" ".join(parts) + " price in Nepal")
    if brand and cat:
        kw.append(f"{brand} {cat} Nepal")
    if brand and model and model.lower()[: len(brand)] != brand.lower():
        kw.append(f"{brand} {model}")
    if name:
        kw.append(name + " price")
    if cat in GENERIC_KEYWORDS:
        kw.append(GENERIC_KEYWORDS[cat])
    if model:
        kw.append(model)
    out, seen = [], set()
    for k in kw:
        k = re.sub(r"\s+", " ", k).strip()
        lk = k.lower()
        if k and lk not in seen:
            seen.add(lk)
            out.append(k)
    return out[:8]


def assign_photo_paths(records):
    """Fill photo_path for any record with an existing local file."""
    updated = 0
    for r in records:
        if r.get("photo_path") and (PHOTOS / r["photo_path"].replace("\\", "/").replace("photos/", "")).exists():
            continue
        brand = r["brand"]
        bd = PHOTOS / brand
        if not bd.exists():
            continue
        old = (r.get("photo_path") or "").replace("\\", "/").replace("photos/", "")
        stem = os.path.splitext(os.path.basename(old))[0] if old else ""
        if stem:
            f = bd / f"{stem}.webp"
            if f.exists():
                r["photo_path"] = f"photos\\{brand}\\{stem}.webp"
                updated += 1
                continue
        model = r.get("model_code") or r.get("product_name") or ""
        for ext in (".webp", ".jpg", ".jpeg", ".png", ".gif", ".JPG", ".PNG", ".JPEG"):
            f = bd / f"{model}{ext}"
            if f.exists():
                r["photo_path"] = f"photos\\{brand}\\{model}{ext}"
                updated += 1
                break
    return updated


def write_llms_full(enriched):
    """Plain-text full product index for AI crawlers (llms-full.txt)."""
    lines = [
        f"# {STORE['name']} - Full Product Index",
        "> Machine-readable product catalog for AI agents and AI crawlers.",
        "",
        f"Store: {STORE['name']}",
        f"Address: {STORE['address']}",
        f"Phone: {STORE['phone']} | WhatsApp: +{STORE['whatsapp']}",
        f"Currency: NPR (Nepali Rupee) | Delivery: {STORE['delivery']}",
        f"Product count: {len(enriched)}",
        "",
        "## Products",
    ]
    for r in enriched:
        price = f"Rs {r['mrp_npr']:,}" if r.get("mrp_npr") else "price on request"
        lines.append(
            f"- /product-{r['slug']}.html - {r['product_name']} ({r['model_code']}) | "
            f"{r['brand']} | {r['category']} | {price} NPR | warranty: {r.get('warranty') or 'official'}"
        )
    (SITE / "llms-full.txt").write_text("\n".join(lines), encoding="utf-8")


def static_product_schema(r):
    """Product + Breadcrumb JSON-LD for a static product page."""
    page_url = f"{STORE['url']}/product-{r['slug']}.html"
    price = str(r["mrp_npr"])
    img = r.get("photo_url") or r.get("image_url") or f"{STORE['url']}/photos/AURA/AU12FSWAC.png"
    return [
        {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": r["product_name"],
            "image": [img],
            "description": r.get("meta_description") or r.get("short_description") or r["product_name"],
            "sku": r["model_code"],
            "mpn": r["model_code"],
            "brand": {"@type": "Brand", "name": r["brand"]},
            "category": r.get("category") or "Home Appliances",
            "keywords": r.get("keywords") or [],
            "offers": {
                "@type": "Offer",
                "url": page_url,
                "priceCurrency": "NPR",
                "price": price,
                "priceValidUntil": "2027-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock",
                "seller": {"@type": "Store", "name": STORE["name"], "telephone": STORE["phone"], "url": STORE["url"]},
            },
        },
        {
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": STORE["url"] + "/"},
                {"@type": "ListItem", "position": 2, "name": r.get("category") or "Shop",
                 "item": f"{STORE['url']}/category.html?cat={r.get('category', 'Shop').replace(' ', '%20')}"},
                {"@type": "ListItem", "position": 3, "name": r["product_name"], "item": page_url},
            ],
        },
    ]


def write_static_products(enriched):
    """Generate one static HTML page per product with inline Product JSON-LD."""
    tpl = (SITE / "product.html").read_text(encoding="utf-8")
    if "{MC}" not in tpl:
        print("static product pages: template missing {MC} placeholder; skip")
        return
    written = 0
    for r in enriched:
        mc = html.escape(r["model_code"], quote=True)
        page = tpl.replace("{MC}", mc, 1)
        page_url = f"/product-{r['slug']}.html"
        page = page.replace(
            'href="https://joinelectroniccenter.com/product.html"',
            f'href="https://joinelectroniccenter.com{page_url}"',
            1,
        )
        ld = '<script type="application/ld+json" id="product-jsonld">\n' + \
            json.dumps(static_product_schema(r), ensure_ascii=False, indent=2) + '\n</script>'
        page = page.replace("</head>", ld + "\n</head>", 1)
        (SITE / f"product-{r['slug']}.html").write_text(page, encoding="utf-8")
        written += 1
    print("static product pages written:", written)


def main():
    records = json.load(open(MERGED, encoding="utf-8"))
    assigned = assign_photo_paths(records)
    json.dump(records, open(MERGED, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    live_map = {}
    live_file = BASE / "data" / "raw" / "image_live.json"
    if live_file.exists():
        live_map = json.load(open(live_file, encoding="utf-8"))

    have_photo = sum(1 for r in records if r.get("photo_path"))
    print(f"photo_path assigned newly: {assigned}; now {have_photo}/{len(records)} have local photo")

    enriched = []
    seen_slugs = set()
    for r in records:
        e = dict(r)
        live = live_map.get(r.get("model_code"))
        if live is False:
            e["image_url"] = ""
            e["image_live"] = False
        else:
            e["image_live"] = True
        e["slug"] = slugify(r.get("product_name"))
        base_slug = e["slug"]
        k = 1
        while e["slug"] in seen_slugs:
            e["slug"] = f"{base_slug}-{k}"
            k += 1
        seen_slugs.add(e["slug"])
        price_val = int(r.get("mrp_npr") or 0)
        e["meta_title"] = f"{r.get('product_name')} Price in Nepal | {STORE['name']}"
        e["meta_description"] = f"{r.get('product_name')} ({r.get('model_code')}) price in Nepal: Rs. {price_val:,}. {r.get('warranty') or 'Official warranty'}, 0% EMI & free delivery in Kathmandu."[:160]
        e["keywords"] = product_keywords(r)
        e["meta_keywords"] = ", ".join(e["keywords"])
        e["emi_monthly_12"] = emi12(price_val)
        e["has_local_photo"] = bool(r.get("photo_path"))
        e["currency"] = "NPR"
        e["url"] = f"/product-{e['slug']}.html"
        pp = r.get("photo_path") or ""
        if pp:
            e["photo_url"] = f"{STORE['url']}/{pp.replace(chr(92), '/')}"
        else:
            e["photo_url"] = ""
        enriched.append(e)

    (SITE / "data" / "catalog.json").write_text(
        json.dumps(enriched, ensure_ascii=False, indent=2), encoding="utf-8")

    cols = ["brand", "category", "type", "capacity", "model_code", "product_name",
            "mrp_npr", "photo_path", "photo_url", "image_url", "warranty", "source", "whatsapp"]
    with open(SITE / "products" / "ai-feed.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in enriched:
            w.writerow({c: r.get(c, "") for c in cols})

    store_meta = dict(STORE)
    store_meta["product_count"] = len(enriched)
    (SITE / "products" / "products.json").write_text(
        json.dumps({"store": store_meta, "products": enriched}, ensure_ascii=False, indent=2),
        encoding="utf-8")

    (SITE / "products" / "ai-faq.json").write_text(
        json.dumps(FAQS, ensure_ascii=False, indent=2), encoding="utf-8")

    write_llms_full(enriched)
    write_static_products(enriched)

    # llms.txt v2
    lines = [
        f"# {STORE['name']} - Home Appliance Store, Kathmandu, Nepal",
        "> Official store + product index for AI agents and AI crawlers.",
        "",
        f"Store: {STORE['name']}",
        f"Tagline: {STORE['tagline']}",
        f"Address: {STORE['address']}",
        f"Hours: {STORE['hours']}",
        f"Phone: {STORE['phone']}",
        f"WhatsApp: +{STORE['whatsapp']} (primary), +{STORE['whatsapp_secondary']} (secondary)",
        f"Delivery: {STORE['delivery']}",
        "Currency: NPR (Nepali Rupee)",
        "Language: Nepali + English (bilingual service)",
        "",
        "## Pages",
        "- / - Home page (hero, brands, categories, featured products, EMI/exchange offers)",
        "- /shop.html - All products with filter, search, sort",
        "- /product.html?model=MODEL - Product detail page (dynamic; each product also has a static page /product-SLUG.html)",
        "- /llms-full.txt - Full product index: all 378 products (name, model, brand, category, NPR price)",
        "- /brand.html?brand=NAME - Products by brand",
        "- /category.html?cat=NAME - Products by category",
        "- /appliance-finder.html - Find your perfect appliance (budget + family size wizard) + EMI calculator",
        "- /exchange.html - Old appliance exchange: send photo, get cashback quote on WhatsApp",
        "- /second-hand.html - Checked, serviced pre-owned appliances (condition grades A/B/C)",
        "- /blog.html - Appliance buying guides (SEO/AEO). Single post: /blog.html?post=SLUG",
        "- /posts.json - Store offers and news posts",
        "- /contact.html - Contact, address, WhatsApp, lead form",
        "- /about.html - About the store: 20+ years, what we sell, why customers trust us",
        "- /warranty.html - Warranty, delivery and return policies",
        "",
        "## Blog Posts",
        "- /blog.html?post=how-to-choose-a-refrigerator-in-nepal - How to choose a refrigerator in Nepal (size, energy, brands)",
        "- /blog.html?post=emi-on-appliances-in-nepal-explained - EMI on appliances in Nepal explained",
        "- /blog.html?post=old-tv-exchange-cashback-nepal - Old TV exchange cashback guide",
        "- /blog.html?post=air-cooler-vs-air-conditioner-nepal - Air cooler vs air conditioner in Nepal",
        "- /blog.html?post=buying-a-second-hand-appliance-in-nepal-what-to-check - Second-hand appliance buying guide (grading, checks, discounts)",
        "- /blog.html?post=where-to-buy-a-washing-machine-in-kathmandu - Washing machine prices in Kathmandu (top load vs front load)",
        "- /blog.html?post=tv-price-in-nepal-2026 - TV price in Nepal 2026 (smart, LED, 4K UHD prices by size)",
        "- /blog.html?post=best-55-inch-4k-tv-nepal - Best 55 inch 4K TV in Nepal 2026 under Rs 1 lakh",
        "- /blog.html?post=skyworth-tv-price-nepal - Skyworth TV price in Nepal (32 to 65 inch, 4K UHD Google TV)",
        "- /blog.html?post=refrigerator-price-nepal-2026 - Refrigerator price in Nepal 2026 (single, double door, frost free)",
        "- /blog.html?post=best-refrigerator-in-nepal-2026 - Best refrigerator in Nepal 2026 for every budget",
        "- /blog.html?post=washing-machine-price-nepal-2026 - Washing machine price in Nepal 2026 (top load, front load, semi-auto)",
        "- /blog.html?post=best-washing-machine-nepal-2026 - Best washing machine in Nepal 2026 for every budget",
        "- /blog.html?post=ac-price-nepal-2026 - AC price in Nepal 2026 (1 ton, 1.5 ton, inverter)",
        "- /blog.html?post=air-cooler-price-nepal-2026 - Air cooler price in Nepal 2026 (desert cooler)",
        "- /blog.html?post=water-purifier-price-nepal-2026 - Water purifier price in Nepal 2026 (RO, UV, UF)",
        "- /blog.html?post=second-hand-appliance-price-nepal-2026 - Second-hand appliance prices in Nepal 2026 + old appliance exchange",
        "- /blog.html?post=small-appliances-price-nepal-2026 - Small home appliance prices in Nepal 2026 (geyser, dispenser, microwave, fans)",
        "",
        "## Social",
        "- Facebook: https://www.facebook.com/joinelectroniccenter",
        "- Instagram: https://www.instagram.com/joinelectronic",
        "- TikTok: https://www.tiktok.com/@joinelectronicscentre",
        "- YouTube: https://www.youtube.com/results?search_query=Join+Electronic+Center+Samakhushi",
        "- Tripadvisor: https://www.tripadvisor.com/Attraction_Review-g293890-d25300420-Reviews-Join_Electronic_Center-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html",
        "- Google Business (reviews): https://g.page/r/CRBpNA834DU9EBM/review",
        "",
        "## Brands",
        "- Himstar, Samsung, Skyworth, Whirlpool, Videocon, Livpure, AURA, Panasonic, Hitachi, Miriza, Galanz",
        "",
        "## FAQ",
    ]
    for faq in FAQS:
        lines.append(f"- Q: {faq['q_en']}")
        lines.append(f"  A: {faq['a_en']}")
    lines += [
        "",
        "## Data Endpoints",
        "- /data/catalog.json - Full product catalog (JSON, enriched)",
        "- /products/ai-feed.csv - Full product catalog (CSV)",
        "- /products/products.json - Store meta + full product catalog (JSON)",
        "- /products/ai-faq.json - Bilingual FAQ (JSON)",
        "- /posts.json - Store offers and news (JSON)",
        "- /blog/blog.json - Blog posts (JSON)",
        "- /social.json - Social platforms and recent posts (JSON)",
        "",
        f"## Product Count: {len(enriched)}",
    ]
    (SITE / "llms.txt").write_text("\n".join(lines), encoding="utf-8")

    # robots.txt
    (SITE / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\n"
        "Sitemap: https://joinelectroniccenter.com/sitemap.xml\n"
        "# llms.txt for AI crawlers (https://llmstxt.org/llms.txt)\n"
        "Sitemap: https://joinelectroniccenter.com/llms.txt\n"
        "User-agent: GPTBot\nAllow: /\n"
        "User-agent: Google-Extended\nAllow: /\n"
        "User-agent: ClaudeBot\nAllow: /\n"
        "User-agent: PerplexityBot\nAllow: /\n"
        "User-agent: ChatGPT-User\nAllow: /\n",
        encoding="utf-8")

    # sitemap.xml
    base = STORE["url"]
    urls = ["/", "/shop.html", "/brand.html", "/category.html", "/appliance-finder.html",
            "/exchange.html", "/second-hand.html", "/blog.html", "/contact.html",
            "/about.html", "/warranty.html", "/llms.txt"]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append(f"  <url><loc>{base}{u}</loc></url>")
    blog_file = SITE / "blog" / "blog.json"
    if blog_file.exists():
        for post in json.load(open(blog_file, encoding="utf-8")):
            sm.append(f"  <url><loc>{base}/blog.html?post={post['slug']}</loc></url>")
    for r in enriched[:500]:
        sm.append(f"  <url><loc>{base}/product-{r['slug']}.html</loc></url>")
    sm.append("</urlset>")
    (SITE / "sitemap.xml").write_text("\n".join(sm), encoding="utf-8")

    # store.jsonld with ALL 378 products in OfferCatalog
    products_schema = []
    for r in enriched:
        products_schema.append({
            "@type": "Product",
            "name": r["product_name"],
            "description": r["meta_description"],
            "sku": r["model_code"],
            "mpn": r["model_code"],
            "brand": {"@type": "Brand", "name": r["brand"]},
            "category": r.get("category", "Home Appliances"),
            "keywords": r.get("keywords", []),
            "image": r.get("photo_url") or r.get("image_url") or f"{base}/photos/AURA/AU12FSWAC.png",
            "offers": {
                "@type": "Offer",
                "priceCurrency": "NPR",
                "price": str(r["mrp_npr"]),
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
                "url": f"{base}/product-{r['slug']}.html",
                "seller": {
                    "@type": "Store",
                    "name": STORE["name"],
                    "telephone": STORE["phone"],
                    "url": STORE["url"],
                },
            },
        })
    ld = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Store"],
        "name": STORE["name"],
        "description": STORE["tagline"],
        "url": STORE["url"],
        "address": {"@type": "PostalAddress", "streetAddress": STORE["address"], "addressLocality": "Kathmandu", "addressCountry": "NP"},
        "telephone": STORE["phone"],
        "openingHours": "Mo-Su 09:00-19:00",
        "currenciesAccepted": "NPR",
        "paymentAccepted": "Cash, Bank Transfer, eSewa, Khalti, Card",
        "priceRange": "Rs. 120 - Rs. 400,000",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "3",
            "bestRating": "5",
        },
        "review": [
            {
                "@type": "Review",
                "author": {"@type": "Person", "name": "Bibek Acharya"},
                "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
                "reviewBody": "I recently had the pleasure of visiting Join Electronic Center, and it's safe to say that it's Paradise for Home Appliances. This place is a hidden gem for all your electronic needs, and I couldn't be more impressed.",
            },
            {
                "@type": "Review",
                "author": {"@type": "Person", "name": "Bidur Aryal"},
                "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
                "reviewBody": "Best place for all electronic appliances at the best price in Kathmandu. I got all my electronic appliances under the same roof.",
            },
        ],
        "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": f"+{STORE['whatsapp']}",
            "contactType": "sales",
            "availableLanguage": ["Nepali", "English"],
        }],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Home Appliances Catalog",
            "itemListElement": products_schema,
        },
    }
    (SITE / "store.jsonld").write_text(json.dumps(ld, ensure_ascii=False, indent=2), encoding="utf-8")

    print("site v2 data + feeds written:", len(enriched), "products")


if __name__ == "__main__":
    main()