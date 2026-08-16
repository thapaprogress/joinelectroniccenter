import json
import re
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
RAW = BASE / "data" / "raw"
MERGED = BASE / "data" / "merged"
MERGED.mkdir(parents=True, exist_ok=True)
JOIN = Path(r"d:\Antigravity Project\join-data")

BRAND_ALIASES = {
    "samsung": ["samsung", "sam "],
    "himstar": ["himstar"],
    "videocon": ["videocon"],
    "panasonic": ["panasonic", "national"],
    "whirlpool": ["whirlpool"],
    "hitachi": ["hitachi"],
    "aura": ["aura"],
    "miriza": ["miriza"],
}

FIELD_MAP = {
    "brand": "brand",
    "category": "category",
    "type": "type",
    "capacity": "capacity",
    "model_code": "model_code",
    "product_name": "product_name",
    "mrp": "mrp",
    "description": "description",
    "specs": "specs",
    "image_url": "image_url",
    "warranty": "warranty",
}


def norm(s):
    return (s or "").strip().lower()


def brand_matches(rec_brand, title):
    aliases = BRAND_ALIASES.get(norm(rec_brand), [norm(rec_brand)])
    t = norm(title)
    return any(a in t for a in aliases)


def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def cat_norm(c):
    c = norm(c)
    if "television" in c or "tv" in c:
        return "Television"
    if "refrigerator" in c or "fridge" in c:
        return "Refrigerator"
    if "washing" in c or "washer" in c:
        return "Washing Machine"
    if "air conditioner" in c or "aircondition" in c or "ac " in c or c == "ac":
        return "Air Conditioner"
    if "cooler" in c:
        return "Air Cooler"
    if "dispenser" in c:
        return "Water Dispenser"
    if "microwave" in c:
        return "Microwave Oven"
    if "purifier" in c:
        return "Water Purifier"
    return "Small Home Appliance"


def cap_type(s):
    return (s or "").strip()


def main():
    raw_daraz = load_json(RAW / "daraz_scrape.json")
    local = load_json(JOIN / "local_extracted_catalog.json")
    daraz_market = load_json(JOIN / "daraz_market_catalog.json")

    records = []
    seen = set()

    def add(rec, source):
        if not rec or not rec.get("product_name"):
            return
        brand = (rec.get("brand") or "").strip() or rec.get("brand_name") or ""
        title = rec.get("product_name", "")
        mrp = rec.get("mrp") or rec.get("mrp_npr") or rec.get("MRP") or rec.get("MRP_NPR")
        # normalize mrp to int
        if isinstance(mrp, str):
            m = re.search(r"[\d,]+", mrp)
            mrp = int(m.group().replace(",", "")) if m else None
        if not mrp:
            return
        key = (norm(brand), norm(rec.get("model_code")))
        if key in seen:
            return
        seen.add(key)
        row = {
            "brand": brand,
            "category": cat_norm(rec.get("category") or rec.get("Category") or ""),
            "type": cap_type(rec.get("type") or rec.get("Type") or ""),
            "capacity": rec.get("capacity") or rec.get("Capacity_or_Size") or rec.get("Capacity") or "",
            "model_code": rec.get("model_code") or rec.get("Model_Code") or "",
            "product_name": title,
            "mrp_npr": mrp,
            "short_description": rec.get("description") or rec.get("Short_Description") or "",
            "detailed_specs": rec.get("specs") or rec.get("Detailed_Specifications") or "",
            "image_url": rec.get("image_url") or rec.get("Image_URL") or "",
            "warranty": rec.get("warranty") or rec.get("Warranty") or "",
            "source": source,
        }
        records.append(row)

    # 1) local extracted (authoritative, from price lists) — keep all
    for r in local:
        add(r, "local_price_list")

    # 2) daraz market catalog (hand-built baseline)
    for r in daraz_market:
        add(r, "daraz_market")

    # 3) fresh daraz scrape — only keep rows whose title contains the target brand
    target_brands = list(BRAND_ALIASES.keys())
    junk_re = re.compile(
r"(cover|remote|windshield|deflector|pump|descaler|purification|refill|gasket|"
            r"thermostat|sensor|filter|hose|adaptor|adapter|voltage|stabilizer|switch|"
            r"valve|cable|stand|bracket|cleaning|descale|sticker|drain|pipe|frame|cap|"
            r"universal|for all|spare|part|accessory|mica|plate|replacement|sheet|tablet|"
            r"detergent|cleaner|cover|bag|holder|clip)", re.I)
    for r in raw_daraz:
        rec_brand = norm(r.get("brand"))
        if not any(rec_brand == b or brand_matches(rec_brand, r.get("product_name")) for b in target_brands):
            continue
        # junk accessories / wrong product types
        if junk_re.search(r.get("product_name") or ""):
            continue
        # if the explicit brand field disagrees with title, trust title
        title_brand = next((b for b in target_brands if brand_matches(b, r.get("product_name"))), None)
        if title_brand:
            r["brand"] = title_brand.title() if title_brand != "aura" else "AURA"
        add(r, "daraz_scrape")

    # sort
    records.sort(key=lambda x: (x["brand"], x["category"], x["product_name"]))

    out_json = MERGED / "catalog_master.json"
    out_csv = MERGED / "catalog_master.csv"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    cols = ["brand", "category", "type", "capacity", "model_code",
            "product_name", "mrp_npr", "short_description", "detailed_specs",
            "image_url", "warranty", "source"]
    with open(out_csv, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in records:
            w.writerow({c: r[c] for c in cols})

    print(f"TOTAL: {len(records)} records")
    from collections import Counter
    for k, v in Counter(r["brand"] for r in records).most_common():
        print(f"  {k}: {v}")
    print(f"  by category:")
    for k, v in Counter(r["category"] for r in records).most_common():
        print(f"    {k}: {v}")
    print(f"\nJSON -> {out_json}")
    print(f"CSV  -> {out_csv}")


if __name__ == "__main__":
    main()