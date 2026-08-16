import json
import csv
from pathlib import Path

SITE = Path(r"D:\Antigravity Project\store-catalog\website\site")
BASE = Path(r"D:\Antigravity Project\store-catalog")
d = json.load(open(BASE / "data" / "merged" / "catalog_master.json", encoding="utf-8"))

(SITE / "data" / "catalog.json").write_text(
    json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")

cols = ["brand", "category", "model_code", "product_name", "mrp_npr",
        "photo_path", "warranty", "source", "whatsapp"]
with open(SITE / "products" / "ai-feed.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    for r in d:
        w.writerow({c: r.get(c, "") for c in cols})

(SITE / "products" / "products.json").write_text(
    json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")

lines = [
    "# Home Appliance Store - Product Catalog",
    "> Official product catalog for Meta AI agents and AI crawlers.",
    "",
    "WhatsApp Business: +977-9765985999",
    "",
    "## Products",
    "",
]
for r in d:
    lines.append(f"- {r['brand']} {r['product_name']} (MRP Rs. {r['mrp_npr']:,}) - Category: {r['category']}")
lines.append("")
lines.append("## API Endpoints")
lines.append("- /data/catalog.json - Full product catalog (JSON)")
lines.append("- /products/ai-feed.csv - Full product catalog (CSV)")
(SITE / "llms.txt").write_text("\n".join(lines), encoding="utf-8")

print("site data refreshed:", len(d), "products")