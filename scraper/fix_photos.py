import json
import re
import time
from collections import Counter
from pathlib import Path

import requests

BASE = Path(r"D:\Antigravity Project\store-catalog")
RECS = json.load(open(BASE / "data" / "merged" / "catalog_master.json", encoding="utf-8"))
PHOTOS = BASE / "photos"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}
SESSION = requests.Session()
SESSION.headers.update(HEADERS)


def safe(s):
    s = re.sub(r"[^A-Za-z0-9]+", "-", s or "").strip("-")
    return s[:60] or "unknown"


def download(url, out, timeout=25):
    try:
        resp = SESSION.get(url, timeout=timeout)
        if resp.status_code == 200 and len(resp.content) > 1000:
            # verify it's an image
            if resp.content[:2] in (b"\xff\xd8",) or resp.content[:4] in (
                b"\x89PNG", b"GIF8", b"RIFF"
            ) or resp.headers.get("Content-Type", "").startswith("image"):
                out.write_bytes(resp.content)
                return True
    except Exception:
        pass
    return False


def retry_daraz():
    """Retry all daraz/slatic image URLs."""
    ok = 0
    for r in RECS:
        if r.get("photo_path"):
            continue
        url = (r.get("image_url") or "").strip()
        if not url:
            continue
        if not url.startswith(("https://static-01.daraz.com.np", "https://np-live-21.slatic.net")):
            continue
        bd = PHOTOS / r["brand"]
        bd.mkdir(parents=True, exist_ok=True)
        model = safe(r.get("model_code") or r.get("product_name"))
        ext = Path(url.split("?")[0]).suffix or ".jpg"
        if len(ext) > 5 or not ext.startswith("."):
            ext = ".jpg"
        out = bd / f"{model}{ext}"
        if download(url, out):
            ok += 1
        time.sleep(0.3)
    return ok


def retry_brand_sites():
    """Retry samsung / skyworth / himstar / panasonic / whirlpool / hitachi urls."""
    ok = 0
    for r in RECS:
        if r.get("photo_path"):
            continue
        url = (r.get("image_url") or "").strip()
        if not url:
            continue
        if url.startswith(("https://static-01.daraz.com.np", "https://np-live-21.slatic.net")):
            continue
        # skip known-dead placeholder-looking urls (hash names on static-01)
        if "static-01.daraz.com.np/p/" in url and re.match(r"^[a-f0-9]{32}", Path(url).stem):
            continue
        bd = PHOTOS / r["brand"]
        bd.mkdir(parents=True, exist_ok=True)
        model = safe(r.get("model_code") or r.get("product_name"))
        ext = Path(url.split("?")[0]).suffix or ".jpg"
        if len(ext) > 5 or not ext.startswith("."):
            ext = ".jpg"
        out = bd / f"{model}{ext}"
        if download(url, out):
            ok += 1
        time.sleep(0.3)
    return ok


def main():
    r1 = retry_daraz()
    print("retry_daraz ok:", r1)
    r2 = retry_brand_sites()
    print("retry_brand_sites ok:", r2)
    # recount
    with_photo = sum(1 for r in RECS if r.get("photo_path"))
    print("with photo (catalog refs):", with_photo)
    print("photo files:", sum(1 for _ in PHOTOS.rglob("*") if _.is_file()))
    missing = Counter()
    for r in RECS:
        if not r.get("photo_path"):
            missing[r["brand"]] += 1
    print("missing by brand:", dict(missing))


if __name__ == "__main__":
    main()