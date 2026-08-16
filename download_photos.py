import json
import os
import sys
import time
import urllib.request
from pathlib import Path

BASE = Path(__file__).resolve().parent
PHOTOS = BASE / "photos"
MERGED = BASE / "data" / "merged" / "catalog_master.json"

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def sanitize(name):
    return "".join(c if c.isalnum() or c in "-_" else "_" for c in name)


def download(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


PLACEHOLDER_DOMAINS = ("static-01.daraz.com.np",)


def is_placeholder(url):
    return any(d in url for d in PLACEHOLDER_DOMAINS) or not url


def main(brand_filter=None):
    with open(MERGED, encoding="utf-8") as f:
        records = json.load(f)

    # live scrape image_urls take priority
    live = {}
    live_path = BASE / "data" / "raw" / "daraz_scrape.json"
    if live_path.exists():
        with open(live_path, encoding="utf-8") as f:
            for rec in json.load(f):
                b = (rec.get("brand") or "").lower()
                m = (rec.get("model_code") or "").lower()
                imgs = rec.get("image_urls") or []
                if imgs:
                    live.setdefault((b, m), imgs)

    total = 0
    failed = 0
    for rec in records:
        brand = rec["brand"]
        if brand_filter and brand.lower() != brand_filter.lower():
            continue
        key = (brand.lower(), (rec.get("model_code") or "").lower())
        imgs = live.get(key) or ([rec.get("image_url")] if rec.get("image_url") else [])
        imgs = [i for i in imgs if not is_placeholder(i)]
        if not imgs:
            continue
        base = rec.get("model_code") or rec.get("product_name") or "product"
        fname = sanitize(base)[:80] + ".jpg"
        brand_dir = PHOTOS / sanitize(brand)
        brand_dir.mkdir(parents=True, exist_ok=True)
        dest = brand_dir / fname
        if dest.exists():
            continue
        ok = False
        for img in imgs:
            try:
                download(img, dest)
                total += 1
                ok = True
                break
            except Exception as e:
                failed += 1
        if not ok:
            print(f"  FAIL {rec['brand']} {rec.get('model_code')}")
        time.sleep(0.3)

    print(f"Downloaded {total} photos, {failed} failed -> {PHOTOS}")


if __name__ == "__main__":
    f = sys.argv[1] if len(sys.argv) > 1 else None
    main(f)
