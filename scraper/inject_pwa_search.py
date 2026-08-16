import os

site_dir = r"d:\Antigravity Project\store-catalog\website\site"
pwa_meta = '<link rel="manifest" href="manifest.json">\n  <meta name="theme-color" content="#2563eb">'
scripts_to_add = '<script src="js/search-modal.js"></script>\n  <script src="js/pwa.js"></script>'

html_files = [f for f in os.listdir(site_dir) if f.endswith(".html")]
for hf in html_files:
    fpath = os.path.join(site_dir, hf)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "manifest.json" not in content:
        content = content.replace("</head>", f"  {pwa_meta}\n</head>")
        
    if "search-modal.js" not in content:
        content = content.replace("</body>", f"  {scripts_to_add}\n</body>")
        
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Injected PWA and Search Modal across {len(html_files)} HTML pages.")
