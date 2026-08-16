import csv
import json
import os
from collections import OrderedDict
from pathlib import Path

BASE = Path(__file__).resolve().parent
MERGED = BASE / "data" / "merged"
MERGED.mkdir(parents=True, exist_ok=True)

BRAND_CASE = {
    "samsung": "Samsung", "himstar": "Himstar", "skyworth": "Skyworth",
    "videocon": "Videocon", "panasonic": "Panasonic", "whirlpool": "Whirlpool",
    "hitachi": "Hitachi", "aura": "AURA", "AURA": "AURA", "miriza": "Miriza",
    "livpure": "Livpure", "galanz": "Galanz",
}

FIELDS = [
    "brand", "category", "type", "capacity", "model_code",
    "product_name", "mrp_npr", "short_description", "detailed_specs",
    "image_url", "warranty", "source", "daraz_url",
]


def norm_brand(b):
    if not b:
        return ""
    return BRAND_CASE.get(b.lower(), b.strip())


def load_json(path):
    if not Path(path).exists():
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_csv(path):
    rows = []
    if not Path(path).exists():
        return rows
    with open(path, encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            rows.append(r)
    return rows


def make_rec(source, row, source_name):
    def g(*keys):
        for k in keys:
            if k in row and row[k]:
                return row[k]
        return ""

    brand = norm_brand(g("brand", "Brand"))
    if not brand or brand.lower() in ("all", "n/a", "unknown"):
        return None
    mrp = g("mrp", "mrp_npr", "MRP_NPR", "MRP", "price")
    try:
        mrp = int(str(mrp).replace(",", "").replace("Rs.", "").replace("NPR", "").strip())
    except Exception:
        mrp = None

    return {
        "brand": brand,
        "category": (g("category", "Category") or "").title(),
        "type": g("type", "Type"),
        "capacity": g("capacity", "capacity_or_size", "Capacity_or_Size", "Capacity"),
        "model_code": g("model_code", "Model_Code", "model"),
        "product_name": g("product_name", "Product_Name", "title"),
        "mrp_npr": mrp,
        "short_description": (g("description", "Short_Description", "short_description") or "")[:600],
        "detailed_specs": (g("specs", "Detailed_Specifications", "detailed_specs") or "")[:1500],
        "image_url": g("image_url", "Image_URL", "image_url"),
        "warranty": (g("warranty", "Warranty") or "")[:200],
        "source": source_name,
        "daraz_url": g("daraz_url", "url"),
    }


def main():
    records = {}

    # 1. existing local catalog (join-data)
    local = load_json(BASE.parent / "join-data" / "local_extracted_catalog.json")
    for row in local:
        rec = make_rec(None, row, "local_price_list")
        if rec:
            records[(rec["brand"].lower(), (rec["model_code"] or "").lower())] = rec

    # 2. existing daraz market catalog (hand-built in join-data)
    dm = load_json(BASE.parent / "join-data" / "daraz_market_catalog.json")
    for row in dm:
        rec = make_rec(None, row, "daraz_hand_built")
        if rec:
            key = (rec["brand"].lower(), (rec["model_code"] or "").lower())
            if key not in records:
                records[key] = rec

    # 3. existing csv
    csv_rows = load_csv(BASE.parent / "join-data" / "meta_ai_store_catalog.csv")
    for row in csv_rows:
        rec = make_rec(None, row, "existing_csv")
        if rec:
            key = (rec["brand"].lower(), (rec["model_code"] or "").lower())
            if key not in records:
                records[key] = rec

    # 4. fresh daraz scrape (highest priority, real MRP)
    daraz = load_json(BASE / "data" / "raw" / "daraz_scrape.json")
    for row in daraz:
        rec = make_rec(None, row, "daraz_scrape_live")
        if rec:
            key = (rec["brand"].lower(), (rec["model_code"] or "").lower())
            records[key] = rec

    # also merge by product_name when model_code missing
    name_map = OrderedDict()
    for rec in records.values():
        nm = (rec["brand"].lower(), (rec["product_name"] or "").lower().strip())
        if nm[1]:
            name_map.setdefault(nm, rec)

    final = []
    for rec in records.values():
        final.append({k: rec.get(k) for k in FIELDS})

    # sort by brand, category, mrp
    final.sort(key=lambda r: (r["brand"], r["category"], r["mrp_npr"] or 0))

    json_path = MERGED / "catalog_master.json"
    csv_path = MERGED / "catalog_master.csv"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in final:
            w.writerow(r)

    # stats
    brands = {}
    cats = {}
    missing_mrp = 0
    for r in final:
        brands[r["brand"]] = brands.get(r["brand"], 0) + 1
        cats[r["category"]] = cats.get(r["category"], 0) + 1
        if not r["mrp_npr"]:
            missing_mrp += 1

    print(f"Total unique records: {len(final)}")
    print(f"Missing MRP: {missing_mrp}")
    print("By brand:", dict(brands))
    print("By category:", dict(cats))
    print(f"Wrote {json_path}")
    print(f"Wrote {csv_path}")


if __name__ == "__main__":
    main()
