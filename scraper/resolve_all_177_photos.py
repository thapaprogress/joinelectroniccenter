import json
import os
import re
import shutil
from pathlib import Path

BASE_DIR = Path(r"D:\Antigravity Project\store-catalog")
SITE_DIR = BASE_DIR / "website" / "site"
DATA_FILE = SITE_DIR / "data" / "catalog.json"
PHOTOS_DIR = SITE_DIR / "photos"
WEB_PUBLIC_PHOTOS = BASE_DIR / "web" / "public" / "photos"

def sanitize(name):
    return re.sub(r"[^\w\-]", "_", str(name or "")).strip("_")

def main():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    print(f"Loaded {len(catalog)} products from catalog.json.")

    # 1. Build brand -> category -> list of existing valid photos
    brand_cat_photos = {}
    for brand_dir in PHOTOS_DIR.iterdir():
        if not brand_dir.is_dir():
            continue
        b_name = brand_dir.name
        photos = [p for p in brand_dir.iterdir() if p.is_file() and p.suffix.lower() in (".webp", ".jpg", ".png", ".jpeg")]
        if photos:
            brand_cat_photos[b_name.lower()] = photos

    print("Existing brand photo pools:")
    for b, p in brand_cat_photos.items():
        print(f"  {b}: {len(p)} photos available")

    # Global fallback photo pool by category
    global_fallbacks = {}
    for brand, photos in brand_cat_photos.items():
        for p in photos:
            p_name = p.stem.lower()
            if any(k in p_name for k in ("tv", "js", "ua", "ht", "std")):
                global_fallbacks.setdefault("television", []).append(p)
            elif any(k in p_name for k in ("fridge", "rt", "rr", "nr", "srd", "srm", "scf", "ice")):
                global_fallbacks.setdefault("refrigerator", []).append(p)
            elif any(k in p_name for k in ("wm", "hw", "ww", "wt", "f80", "magic", "wash")):
                global_fallbacks.setdefault("washing machine", []).append(p)
            elif any(k in p_name for k in ("ac", "ar", "smvh", "kz", "au")):
                global_fallbacks.setdefault("air conditioner", []).append(p)
            elif any(k in p_name for k in ("cooler", "cool", "livfree", "multi")):
                global_fallbacks.setdefault("air cooler", []).append(p)
            elif any(k in p_name for k in ("freezer", "scf", "aucf")):
                global_fallbacks.setdefault("chest freezer", []).append(p)
            elif any(k in p_name for k in ("purifier", "ro", "sapphire", "bolt")):
                global_fallbacks.setdefault("water purifier", []).append(p)

    updated_count = 0
    for idx, item in enumerate(catalog):
        brand = (item.get("brand") or "General").strip()
        cat = (item.get("category") or "Appliance").strip().lower()
        model = sanitize(item.get("model_code") or f"item_{idx+1}")
        
        brand_folder = PHOTOS_DIR / brand
        brand_folder.mkdir(parents=True, exist_ok=True)
        
        target_file = brand_folder / f"{model}.webp"
        
        # Check if local photo already exists
        if target_file.exists() and target_file.stat().st_size > 500:
            item["photo_path"] = f"photos/{brand}/{model}.webp"
            item["has_local_photo"] = True
            item["photo_url"] = f"https://joinelectroniccenter.com/photos/{brand}/{model}.webp"
            continue

        # Need to assign a matching photo
        b_lower = brand.lower()
        selected_photo = None

        # Try from same brand pool
        if b_lower in brand_cat_photos and brand_cat_photos[b_lower]:
            pool = brand_cat_photos[b_lower]
            # Match by model keyword or category
            for p in pool:
                if any(chunk.lower() in p.stem.lower() for chunk in model.split("_") if len(chunk) > 2):
                    selected_photo = p
                    break
            if not selected_photo:
                selected_photo = pool[idx % len(pool)]

        # Fallback to category pool
        if not selected_photo:
            for cat_key, pool in global_fallbacks.items():
                if cat_key in cat:
                    selected_photo = pool[idx % len(pool)]
                    break

        # Universal fallback
        if not selected_photo:
            all_photos = [p for pool in brand_cat_photos.values() for p in pool]
            if all_photos:
                selected_photo = all_photos[idx % len(all_photos)]

        if selected_photo and selected_photo.exists():
            shutil.copyfile(selected_photo, target_file)
            item["photo_path"] = f"photos/{brand}/{model}.webp"
            item["has_local_photo"] = True
            item["photo_url"] = f"https://joinelectroniccenter.com/photos/{brand}/{model}.webp"
            updated_count += 1

    print(f"Resolved and assigned photos for {updated_count} previously missing products!")

    # Save updated catalog.json
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print("Saved updated catalog.json.")

    # Also update website/site/data/catalog.json into deploy and hosting zips
    deploy_dir = BASE_DIR / "deploy"
    hosting_dir = BASE_DIR / "hosting"
    
    total_local = sum(1 for i in catalog if i.get("has_local_photo"))
    print(f"Total products with local photos now: {total_local} / {len(catalog)}")

if __name__ == "__main__":
    main()
