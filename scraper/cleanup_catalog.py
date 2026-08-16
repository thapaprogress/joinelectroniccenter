import json
import re
from collections import Counter
from pathlib import Path

BASE = Path(r"D:\Antigravity Project\store-catalog")
SRC = BASE / "data" / "merged" / "catalog_master.json"
OUT = BASE / "data" / "merged" / "catalog_master.json"

WHATSAPP = "9779765985999"


def fix_category(r):
    t = (r.get("product_name") or "").lower()
    c = r.get("category")
    if "freezer" in t:
        return "Refrigerator"
    if any(k in t for k in ["stove", "cooktop", "cook top", "cooker", "induction"]):
        return "Small Home Appliance"
    if "chimney" in t:
        return "Small Home Appliance"
    if "geyser" in t:
        return "Small Home Appliance"
    return c


def clean_model(r):
    m = (r.get("model_code") or "").strip()
    if m.lower() in ("", "no", "none") or "_NP-" in m or m.isdigit():
        name = r.get("product_name") or ""
        brand = r.get("brand") or ""
        # try to find a model-like token in title (uppercase alnum groups with digits)
        toks = re.findall(r"[A-Z0-9]{3,}[A-Z0-9\-/\.]*", name)
        cand = None
        for t in toks:
            if len(t) >= 3 and not t.isdigit():
                cand = t
                break
        if cand:
            return cand
        return (brand + "-" + re.sub(r"[^A-Za-z0-9]", "-", name)[:20]).strip("-")
    return m


def main():
    d = json.load(open(SRC, encoding="utf-8"))

    # 1) fix categories
    for r in d:
        r["category"] = fix_category(r)

    # 2) clean junk model codes
    junk_models = 0
    for r in d:
        new = clean_model(r)
        if new != (r.get("model_code") or "").strip():
            junk_models += 1
        r["model_code"] = new

    # 3) dedupe by (brand, product_name) keep first with photo
    seen = {}
    out = []
    for r in d:
        key = (r["brand"], re.sub(r"\s+", " ", r["product_name"]).strip().lower())
        if key in seen:
            # prefer the one with local photo / richer specs
            prev = seen[key]
            if not prev.get("photo_path") and r.get("photo_path"):
                out[out.index(prev)] = r
            continue
        seen[key] = r
        out.append(r)

    # 4) fill missing short_description from specs or name
    for r in out:
        if not r.get("short_description"):
            if r.get("detailed_specs"):
                r["short_description"] = r["detailed_specs"]
            else:
                r["short_description"] = (
                    f"{r['product_name']} — official MRP Rs. {r['mrp_npr']:,}. "
                    f"Available at our store with official warranty."
                )

    # 5) normalize specs: keep as text; also add specs_list
    for r in out:
        specs = r.get("detailed_specs") or ""
        parts = re.split(r"[;|\n]", specs)
        parts = [p.strip() for p in parts if p.strip()]
        r["specs_list"] = parts

    # 6) whatsapp number for site links
    r["whatsapp"] = WHATSAPP

    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    print("total after dedupe:", len(out))
    print("junk models fixed:", junk_models)
    print("by brand:", dict(Counter(x["brand"] for x in out)))
    print("by category:", dict(Counter(x["category"] for x in out)))
    print("with photo:", sum(1 for x in out if x.get("photo_path")))
    print("with specs_list:", sum(1 for x in out if x.get("specs_list")))


if __name__ == "__main__":
    main()