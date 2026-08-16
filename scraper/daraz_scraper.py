import json
import os
import re
import sys
import time
import random
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")

BRANDS = ["samsung", "himstar", "videocon", "panasonic",
          "whirlpool", "hitachi", "aura", "miriza"]

CATEGORIES = [
    "refrigerator", "television", "washing machine", "air conditioner",
    "air cooler", "water dispenser", "microwave oven", "water purifier",
]

QUERY_VARIANTS = {
    "refrigerator": ["refrigerator", "fridge"],
    "television": ["television", "smart tv"],
    "washing machine": ["washing machine", "washer"],
    "air conditioner": ["air conditioner", "ac split"],
    "air cooler": ["air cooler", "desert cooler"],
    "water dispenser": ["water dispenser"],
    "microwave oven": ["microwave oven"],
    "water purifier": ["water purifier"],
}

PAGES_PER_QUERY = 2

CHROME_ARGS = [
    "--disable-blink-features=AutomationControlled",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
]

GOTO_TIMEOUT = 30000
MAX_RETRY = 3


def clean_int(text):
    if not text:
        return None
    m = re.search(r"[\d,]+", str(text))
    return int(m.group().replace(",", "")) if m else None


def extract_specs(spec_obj):
    feats = (spec_obj or {}).get("features") or {}
    return "; ".join(f"{k}: {v}" for k, v in feats.items())


def extract_model_capacity(title, specs):
    model, capacity = None, None
    for k, v in (specs or {}).items():
        lk = k.lower()
        if "model" in lk or "sku" in lk:
            model = v
        if "capacity" in lk or "litres" in lk:
            capacity = v
    if not model:
        m = re.search(r"([A-Z]{1,6}[\d\-]+[A-Z0-9/]*)", title)
        if m:
            model = m.group(1)
    if not capacity:
        m = re.search(r"(\d+(?:\.\d+)?)\s*(litres|liters|l)", title, re.I)
        if m:
            capacity = f"{m.group(1)} L"
    return model, capacity


def scrape_product(pg, url):
    """One pass: goto -> scroll -> capture getdetailinfo JSON from network."""
    bodies = []

    def on_resp(r):
        try:
            if "getdetailinfo" in r.url and r.status == 200:
                t = r.text()
                if len(t) > 1000:
                    bodies.append(t)
        except Exception:
            pass

    pg.on("response", on_resp)
    for attempt in range(MAX_RETRY):
        try:
            pg.goto(url, timeout=GOTO_TIMEOUT, wait_until="domcontentloaded")
            break
        except Exception:
            if attempt == MAX_RETRY - 1:
                return None
            time.sleep(2)
    try:
        time.sleep(1.5)
        for _ in range(12):
            pg.mouse.wheel(0, 700)
            time.sleep(0.2)
        time.sleep(1)
    except Exception:
        pass

    if not bodies:
        return None

    try:
        mod = json.loads(json.loads(bodies[-1])["data"]["module"])
    except Exception:
        return None

    prod = mod.get("product") or {}
    title = prod.get("title") or ""
    brand = (prod.get("brand") or {}).get("name") or ""
    desc_html = prod.get("desc") or ""
    highlights = prod.get("highlights") or ""
    desc = re.sub(r"<[^>]+>", " ", desc_html)
    desc = re.sub(r"\s+", " ", desc).strip()
    if highlights:
        hl = re.sub(r"<[^>]+>", " | ", highlights)
        hl = re.sub(r"\s+", " ", hl).strip().strip("| ")
        desc = f"{desc} Highlights: {hl}" if desc else hl

    sku_id = (mod.get("primaryKey") or {}).get("defaultSkuId")
    sku_infos = mod.get("skuInfos") or {}
    si = sku_infos.get(str(sku_id)) or (list(sku_infos.values())[0] if sku_infos else {})
    price = (si or {}).get("price") or {}
    orig = price.get("originalPrice") or {}
    sale = price.get("salePrice") or {}
    mrp = orig.get("value") or sale.get("value")
    current = sale.get("value")
    discount = price.get("discount")

    specs_obj = None
    specifications = mod.get("specifications") or {}
    if specifications:
        specs_obj = list(specifications.values())[0]
    spec_str = extract_specs(specs_obj)
    feat_dict = (specs_obj or {}).get("features") or {}
    model, capacity = extract_model_capacity(title, feat_dict)

    galleries = mod.get("skuGalleries") or {}
    gallery = list(galleries.values())[0] if galleries else None
    imgs = [g.get("src") for g in gallery if g.get("src")] if gallery else []
    main_img = si.get("image") or (imgs[0] if imgs else None)

    warranty = ""
    warranties = mod.get("warranties") or {}
    if warranties:
        w = list(warranties.values())[0]
        if isinstance(w, list):
            parts = []
            for item in w:
                if not isinstance(item, dict):
                    continue
                if str(item.get("dataType", "")).lower() != "warranty":
                    continue
                t = re.sub(r"<[^>]+>", " ", item.get("description") or item.get("name") or item.get("title") or "")
                if t.strip():
                    parts.append(re.sub(r"\s+", " ", t).strip())
            warranty = " | ".join(parts)[:300]
        elif isinstance(w, dict):
            warranty = str(w.get("name") or w.get("description") or "")[:200]

    return {
        "brand": brand,
        "category": None,
        "type": None,
        "capacity": capacity,
        "model_code": model,
        "product_name": title,
        "mrp": mrp,
        "current_price": current,
        "discount": discount,
        "description": desc[:1200],
        "specs": spec_str[:1500],
        "image_url": main_img,
        "image_urls": imgs[:8],
        "warranty": warranty,
        "daraz_url": url,
        "seller": (mod.get("seller") or {}).get("name") or "",
    }


def search_urls(pg, term):
    urls = []
    for page in range(1, PAGES_PER_QUERY + 1):
        u = f"https://www.daraz.com.np/catalog/?q={term}&page={page}"
        for attempt in range(MAX_RETRY):
            try:
                pg.goto(u, timeout=GOTO_TIMEOUT, wait_until="domcontentloaded")
                break
            except Exception as e:
                if attempt == MAX_RETRY - 1:
                    print(f"    search p{page} ERR: {e}", flush=True)
                    urls = []
                    break
                time.sleep(2)
        else:
            continue
        try:
            time.sleep(1.5)
            for _ in range(4):
                pg.mouse.wheel(0, 900)
                time.sleep(0.2)
            links = pg.eval_on_selector_all(
                "a", "els => els.filter(e => e.href.includes('/products/')).map(e => e.href)")
            urls.extend(dict.fromkeys(links))
        except Exception as e:
            print(f"    search p{page} ERR: {e}", flush=True)
    return list(dict.fromkeys(urls))


def save_incremental(brand, records):
    """Append-write records so partial progress survives crashes."""
    out = RAW_DIR / f"daraz_brand_{brand}.json"
    if records:
        with open(out, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)


def scrape_brand(brand, categories, limit):
    """Runs in its own process. Own browser. Writes per-brand json incrementally."""
    brand_final = "AURA" if brand == "aura" else brand.capitalize()
    out = RAW_DIR / f"daraz_brand_{brand}.json"
    records = []
    if out.exists():
        try:
            with open(out, encoding="utf-8") as fh:
                records = json.load(fh)
            print(f"[{brand}] resume with {len(records)} existing", flush=True)
        except Exception:
            records = []
    seen = {r.get("daraz_url") for r in records}

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, args=CHROME_ARGS)
        ctx = b.new_context(user_agent=UA, viewport={"width": 1366, "height": 768}, locale="en-US")
        pg = ctx.new_page()
        for category in categories:
            variants = QUERY_VARIANTS.get(category, [category])
            collected = 0
            for variant in variants:
                if collected >= limit:
                    break
                term = f"{brand} {variant}".replace(" ", "+")
                print(f"[{brand}] search: {term}", flush=True)
                try:
                    urls = search_urls(pg, term)
                except Exception as e:
                    print(f"[{brand}] search ERR {e}, recreating page", flush=True)
                    try:
                        ctx.close()
                    except Exception:
                        pass
                    ctx = b.new_context(user_agent=UA, viewport={"width": 1366, "height": 768}, locale="en-US")
                    pg = ctx.new_page()
                    continue
                fresh = [u for u in urls if u not in seen]
                for u in fresh[: max(0, limit - collected)]:
                    try:
                        rec = scrape_product(pg, u)
                    except Exception as e:
                        print(f"[{brand}] ERR {e}", flush=True)
                        continue
                    if not rec:
                        continue
                    rec["brand"] = brand_final
                    rec["category"] = category
                    rec["type"] = variant
                    records.append(rec)
                    seen.add(u)
                    collected += 1
                    print(f"[{brand}] -> {rec['product_name'][:60]} | MRP {rec['mrp']}", flush=True)
                    save_incremental(brand, records)
                    time.sleep(random.uniform(1.0, 2.0))
                if collected >= limit:
                    break
        try:
            b.close()
        except Exception:
            pass

    print(f"[{brand}] saved {len(records)} -> {out}", flush=True)
    return records


def main(brands, categories, limit_per_query):
    """Single-process sequential scrape. Call per brand group from separate tasks."""
    for brand in brands:
        scrape_brand(brand, categories, limit_per_query)
    merge_partials()


def merge_partials():
    merged = []
    for f in sorted(RAW_DIR.glob("daraz_brand_*.json")):
        try:
            with open(f, encoding="utf-8") as fh:
                merged.extend(json.load(fh))
        except Exception as e:
            print(f"skip {f}: {e}")
    out = RAW_DIR / "daraz_scrape.json"
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(merged, fh, ensure_ascii=False, indent=2)
    print(f"\nMERGED {len(merged)} records -> {out}", flush=True)
    return merged


if __name__ == "__main__":
    a1 = sys.argv[1] if len(sys.argv) > 1 else "all"
    a2 = sys.argv[2] if len(sys.argv) > 2 else "all"
    a3 = sys.argv[3] if len(sys.argv) > 3 else "6"
    brands = BRANDS if a1.lower() == "all" else a1.split(",")
    cats = CATEGORIES if a2.lower() == "all" else a2.split(",")
    main(brands, cats, int(a3))