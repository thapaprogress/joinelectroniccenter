import pathlib
from PIL import Image

PHOTOS = pathlib.Path(r"D:\Antigravity Project\store-catalog\website\site\photos")

EXT = (".jpg", ".jpeg", ".png", ".gif", ".JPG", ".PNG", ".JPEG")
converted = 0
skipped = 0
for f in PHOTOS.rglob("*"):
    if not f.is_file() or f.suffix not in EXT:
        continue
    target = f.with_suffix(".webp")
    try:
        im = Image.open(f)
        im.load()
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")
        im.save(target, "WEBP", quality=82, method=4)
    except Exception as e:
        print(f"SKIP {f.name}: {e}")
        skipped += 1
        continue
    old = f.stat().st_size
    new = target.stat().st_size
    if new >= old * 0.95 and f.suffix.lower() in (".jpg", ".jpeg"):
        target.unlink(missing_ok=True)
        print(f"KEEP {f.name} (webp bigger)")
        skipped += 1
        continue
    f.unlink()
    converted += 1

print(f"converted {converted} to WebP, skipped {skipped}")