import os
import shutil
import zipfile

source_dir = r"D:\Antigravity Project\store-catalog\web\out"
images_src = r"D:\Antigravity Project\store-catalog\web\public\images"
images_dst = os.path.join(source_dir, "images")

if os.path.exists(images_src):
    print(f"Syncing images from {images_src} to {images_dst}...")
    shutil.copytree(images_src, images_dst, dirs_exist_ok=True)

output_zip = r"D:\Antigravity Project\store-catalog\deploy\joinelectroniccenter-cpanel-directadmin.zip"

print(f"Packaging {source_dir} into {output_zip} with standard Linux POSIX forward-slash paths...")

file_count = 0
with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            file_path = os.path.join(root, file)
            # Enforce Unix forward slashes for Linux cPanel/DirectAdmin
            arcname = os.path.relpath(file_path, source_dir).replace("\\", "/")
            zipf.write(file_path, arcname)
            file_count += 1

size_mb = os.path.getsize(output_zip) / (1024 * 1024)
print(f"Successfully packaged {file_count} files into {output_zip} ({size_mb:.2f} MB)")
