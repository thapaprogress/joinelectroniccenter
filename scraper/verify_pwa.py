import os

site_dir = r"d:\Antigravity Project\store-catalog\website\site"
files = [f for f in os.listdir(site_dir) if f.endswith(".html")]

pwa_count = 0
search_count = 0

for f in files:
    content = open(os.path.join(site_dir, f), encoding="utf-8").read()
    if "manifest.json" in content:
        pwa_count += 1
    if "search-modal.js" in content:
        search_count += 1

print(f"Verified {pwa_count}/{len(files)} pages with PWA manifest.")
print(f"Verified {search_count}/{len(files)} pages with search-modal.js.")
