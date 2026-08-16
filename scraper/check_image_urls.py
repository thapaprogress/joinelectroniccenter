import json
import re
from pathlib import Path
import requests

BASE = Path(r"D:\Antigravity Project\store-catalog")
RECS = json.load(open(BASE / "data" / "merged" / "catalog_master.json", encoding="utf-8"))
OUT = BASE / "data" / "raw" / "image_live.json"

S = requests.Session()
S.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0"})


def looks_image(url):
    stem = Path(url.split("?")[0]).name.lower()
    return stem.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif"))


def main():
    result = {}
    for r in RECS:
        if r.get("photo_path"):
            continue
        url = (r.get("image_url") or "").strip()
        if not url:
            result[r["model_code"]] = False
            continue
        if not looks_image(url):
            result[r["model_code"]] = False
            continue
        try:
            resp = S.get(url, timeout=12, stream=True)
            if resp.status_code == 200:
                chunk = next(resp.iter_content(64), b"")
                ok = len(chunk) > 0
                if ok and not (chunk.startswith(b"\xff\xd8") or chunk.startswith(b"\x89PNG")
                               or chunk.startswith(b"GIF8") or chunk.startswith(b"RIFF")):
                    ctype = resp.headers.get("Content-Type", "")
                    ok = ctype.startswith("image")
                result[r["model_code"]] = ok
            else:
                result[r["model_code"]] = False
        except Exception:
            result[r["model_code"]] = False
    json.dump(result, open(OUT, "w", encoding="utf-8"), indent=2)
    live = sum(1 for v in result.values() if v)
    print(f"checked {len(result)} urls, live: {live}, dead: {len(result) - live}")


if __name__ == "__main__":
    main()