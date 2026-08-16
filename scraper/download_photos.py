import json
import re
from pathlib import Path

import requests

BASE = Path(__file__).resolve().parent.parent
MERGED = BASE / "data" / "merged"
PHOTOS = BASE / "photos"
PHOTOS.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
}


def safe_name(s):
    s = re.sub(r'[^A-Za-z0-9]+', '-', s or '').strip('-')
    return s[:60] or 'unknown'


def main():
    with open(MERGED / "catalog_master.json", encoding="utf-8") as f:
        records = json.load(f)

    ok = 0
    fail = 0
    no_url = 0
    for r in records:
        url = (r.get("image_url") or "").strip()
        if not url:
            no_url += 1
            continue
        brand_dir = PHOTOS / r["brand"]
        brand_dir.mkdir(parents=True, exist_ok=True)
        model = safe_name(r.get("model_code") or r.get("product_name"))
        ext = Path(url.split("?")[0]).suffix or ".jpg"
        if len(ext) > 5:
            ext = ".jpg"
        out = brand_dir / f"{model}{ext}"
        if out.exists():
            ok += 1
            continue
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            if resp.status_code == 200 and len(resp.content) > 1000:
                out.write_bytes(resp.content)
                ok += 1
            else:
                fail += 1
        except Exception:
            fail += 1

    print(f"downloaded/existing: {ok}, failed: {fail}, no url: {no_url}")


if __name__ == "__main__":
    main()