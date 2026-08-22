import os
from PIL import Image

def optimize_directory(dir_path):
    if not os.path.exists(dir_path):
        return
    
    total_saved = 0
    converted_count = 0

    for root, _, files in os.walk(dir_path):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in [".jpg", ".jpeg", ".png"]:
                full_path = os.path.join(root, f)
                webp_path = os.path.splitext(full_path)[0] + ".webp"
                
                try:
                    orig_size = os.path.getsize(full_path)
                    with Image.open(full_path) as img:
                        img = img.convert("RGB")
                        # Max dimension cap for web performance
                        max_dim = 1600
                        if max(img.size) > max_dim:
                            img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                        
                        img.save(webp_path, "WEBP", quality=82, method=6)
                    
                    new_size = os.path.getsize(webp_path)
                    saved = orig_size - new_size
                    total_saved += max(0, saved)
                    converted_count += 1
                    print(f"Converted: {f} ({orig_size//1024} KB -> {new_size//1024} KB)")
                except Exception as e:
                    print(f"Error converting {f}: {e}")

    print(f"\nDone! Converted {converted_count} images. Saved {total_saved // 1024} KB.")

if __name__ == "__main__":
    web_dir = os.path.dirname(os.path.abspath(__file__))
    optimize_directory(os.path.join(web_dir, "public", "images"))
    optimize_directory(os.path.join(web_dir, "public", "photos"))
