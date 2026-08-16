import json
import os
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
CRED_DIR = BASE / "credentials"
MERGED = BASE / "data" / "merged" / "catalog_master.json"
STORE_URL = "https://joinelectroniccenter.com"

FIELDS = [
    "brand", "category", "type", "capacity", "model_code",
    "product_name", "mrp_npr", "short_description", "detailed_specs",
    "photo_path", "photo_url", "image_url", "warranty", "source", "url",
]

HEADERS = [
    "Brand", "Category", "Type", "Capacity", "Model Code",
    "Product Name", "MRP (NPR)", "Short Description", "Detailed Specifications",
    "Photo Path", "Photo URL", "Image URL", "Warranty", "Source", "Product URL",
]


def find_credentials():
    cands = [
        CRED_DIR / "service_account.json",
        CRED_DIR / "credentials.json",
        Path(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")),
    ]
    for c in cands:
        if c and Path(c).exists():
            return Path(c)
    return None


def get_sheet(cred_path):
    import gspread
    return gspread.service_account(filename=str(cred_path))


def build_rows(records):
    rows = []
    for r in records:
        pp = (r.get("photo_path") or "").replace("\\", "/")
        photo_url = f"{STORE_URL}/{pp}" if pp else ""
        rows.append([
            r.get("brand", ""), r.get("category", ""), r.get("type", ""),
            r.get("capacity", ""), r.get("model_code", ""), r.get("product_name", ""),
            r.get("mrp_npr", ""), r.get("short_description", ""),
            r.get("detailed_specs", ""), pp, photo_url, r.get("image_url", ""),
            r.get("warranty", ""), r.get("source", ""),
            f"{STORE_URL}/product.html?model={r.get('model_code', '')}",
        ])
    return rows


def upload(cred_path, sheet_name="Store Catalog", new=False, url=None):
    with open(MERGED, encoding="utf-8") as f:
        records = json.load(f)

    gc = get_sheet(cred_path)
    if url:
        sh = gc.open_by_url(url)
        print(f"Opened existing sheet: {sh.title}")
    elif new:
        sh = gc.create(sheet_name)
        print(f"Created new sheet: {sheet_name}")
    else:
        sh = gc.open(sheet_name)

    rows = build_rows(records)

    # master sheet
    try:
        ws = sh.worksheet("Master")
    except Exception:
        ws = sh.add_worksheet(title="Master", rows=str(len(rows) + 5), cols=str(len(HEADERS)))
    ws.clear()
    ws.update([HEADERS] + rows)
    print(f"Master tab: {len(records)} rows")

    # per-brand tabs
    brands = {}
    for r, row in zip(records, rows):
        brands.setdefault(r["brand"], []).append(row)

    for brand, brand_rows in brands.items():
        tab = brand[:100]
        try:
            ws_b = sh.worksheet(tab)
            ws_b.clear()
        except Exception:
            ws_b = sh.add_worksheet(title=tab, rows=str(len(brand_rows) + 5), cols=str(len(HEADERS)))
        ws_b.update([HEADERS] + brand_rows)
        print(f"  {tab}: {len(brand_rows)} rows")

    # share publicly so Meta AI can read it
    try:
        sh.share(None, perm_type="anyone", role="reader", with_link=True)
        print("  Shared: anyone with link can view (read-only)")
    except Exception as e:
        print("  Could not auto-share (may already be shared):", e)

    print(f"Sheet URL: {sh.url}")
    return sh


if __name__ == "__main__":
    cred = find_credentials()
    if not cred:
        print("NO CREDENTIALS. Place service-account credentials.json in "
              "store-catalog/credentials/")
        sys.exit(1)
    name = sys.argv[1] if len(sys.argv) > 1 else "Store Catalog"
    new = "--new" in sys.argv
    url = None
    if "--url" in sys.argv:
        url = sys.argv[sys.argv.index("--url") + 1]
    upload(cred, name, new=new, url=url)