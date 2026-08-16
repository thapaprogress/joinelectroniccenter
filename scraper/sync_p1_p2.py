import os
import zipfile
import shutil

src_site = r"d:\Antigravity Project\store-catalog\website\site"
web_pub = r"d:\Antigravity Project\store-catalog\web\public"

for fname in ["store.jsonld", "llms.txt", "llms-full.txt", "sitemap.xml", "robots.txt", "manifest.json", "sw.js"]:
    fsrc = os.path.join(src_site, fname)
    if os.path.exists(fsrc):
        shutil.copyfile(fsrc, os.path.join(web_pub, fname))

if os.path.exists(os.path.join(src_site, "products")):
    shutil.copytree(os.path.join(src_site, "products"), os.path.join(web_pub, "products"), dirs_exist_ok=True)

if os.path.exists(os.path.join(src_site, "data")):
    shutil.copytree(os.path.join(src_site, "data"), os.path.join(web_pub, "data"), dirs_exist_ok=True)

if os.path.exists(os.path.join(src_site, "blog")):
    shutil.copytree(os.path.join(src_site, "blog"), os.path.join(web_pub, "blog"), dirs_exist_ok=True)

# Rebuild Zip packages
out_zip = r"d:\Antigravity Project\store-catalog\hosting\joinelectroniccenter-site.zip"
deploy_zip = r"d:\Antigravity Project\store-catalog\deploy\joinelectroniccenter-site.zip"

with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src_site):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, src_site)
            zip_path = rel_path.replace("\\", "/")
            zf.write(full_path, zip_path)

shutil.copyfile(out_zip, deploy_zip)
print("Synced all P1/P2 improvements and rebuilt production packages.")
