import os
import json
import sqlite3

def find_photo_for_brand_model(photos_base, brand_name, model_code, item_name=""):
    brand_dir = os.path.join(photos_base, brand_name)
    if not os.path.exists(brand_dir):
        return None
        
    available_files = os.listdir(brand_dir)
    
    # 1. Direct and sanitized candidate checks
    sanitized = model_code.replace("/", "_").replace("-", "_").replace(" ", "_").replace("(", "_").replace(")", "_")
    
    candidates = [
        f"{model_code}.webp",
        f"{model_code}.jpg",
        f"{model_code}.png",
        f"{model_code.replace('/', '_')}.webp",
        f"{model_code.replace('/', '_')}.jpg",
        f"{model_code.replace('/', '-')}.webp",
        f"{model_code.replace('/', '-')}.jpg",
        f"{model_code.replace('/', '_').replace(' ', '_')}.webp",
        f"{model_code.replace(' ', '_')}.webp",
        f"{model_code.replace(' ', '-')}.webp",
        f"{model_code.replace(' ', '')}.webp",
        f"{sanitized}.webp",
        f"{sanitized}.jpg",
    ]
    
    for c in candidates:
        if c in available_files:
            return f"photos/{brand_name}/{c}"
            
    # 2. Normalized alphanumeric match
    norm_m = "".join(ch for ch in model_code.lower() if ch.isalnum())
    for f in available_files:
        name_no_ext = os.path.splitext(f)[0]
        norm_f = "".join(ch for ch in name_no_ext.lower() if ch.isalnum())
        if norm_m and (norm_m == norm_f or norm_m in norm_f or norm_f in norm_m):
            return f"photos/{brand_name}/{f}"
            
    return None

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(base_dir, "public")
    photos_base = os.path.join(public_dir, "photos")
    catalog_json_path = os.path.join(public_dir, "data", "catalog.json")
    db_path = os.path.join(base_dir, "dev.db")
    
    with open(catalog_json_path, "r", encoding="utf-8") as f:
        catalog_items = json.load(f)
        
    updated_count = 0
    total_with_photos = 0
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    for item in catalog_items:
        raw_brand = item.get("brand")
        brand_name = raw_brand if isinstance(raw_brand, str) else (raw_brand.get("name") if isinstance(raw_brand, dict) else "Join Electronic")
        model = item.get("model_code") or item.get("modelCode") or ""
        name = item.get("item_name") or item.get("name") or ""
        current_photo = item.get("photo_path") or item.get("photoPath") or ""
        
        # Verify current photo exists on disk
        clean_current = current_photo.replace("\\", "/").lstrip("/")
        photo_exists = bool(clean_current and os.path.exists(os.path.join(public_dir, clean_current)))
        
        resolved_photo = clean_current if photo_exists else None
        
        if not resolved_photo and model:
            found = find_photo_for_brand_model(photos_base, brand_name, model, name)
            if found:
                resolved_photo = found
                updated_count += 1
                
        if resolved_photo:
            total_with_photos += 1
            item["photo_path"] = resolved_photo
            item["photoPath"] = resolved_photo
            item["has_local_photo"] = True
            item["hasLocalPhoto"] = True
            
            # Update SQLite Product table
            cur.execute("""
                UPDATE Product 
                SET photoPath = ?, hasLocalPhoto = 1
                WHERE modelCode = ? OR name = ?
            """, (resolved_photo, model, name))
            
    conn.commit()
    conn.close()
    
    with open(catalog_json_path, "w", encoding="utf-8") as f:
        json.dump(catalog_items, f, indent=2, ensure_ascii=False)
        
    print(f"Catalog reconciliation complete!")
    print(f"Total Products: {len(catalog_items)}")
    print(f"Products Newly Fixed & Linked: {updated_count}")
    print(f"Total Products with Verified Local Photos: {total_with_photos} / {len(catalog_items)}")

if __name__ == "__main__":
    main()
