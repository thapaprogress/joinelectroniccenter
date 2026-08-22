import os
import shutil
import zipfile
import subprocess
import time

def build_and_package_cpanel():
    web_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(web_dir)
    deploy_dir = os.path.join(root_dir, "deploy")
    os.makedirs(deploy_dir, exist_ok=True)

    output_zip = os.path.join(deploy_dir, "joinelectroniccenter-cpanel-ready.zip")
    temp_staging = os.path.join(deploy_dir, "cpanel_staging")
    api_dir = os.path.join(web_dir, "src", "app", "api")
    api_backup = os.path.join(web_dir, "_api_temp_backup")

    if os.path.exists(temp_staging):
        shutil.rmtree(temp_staging, ignore_errors=True)
    os.makedirs(temp_staging, exist_ok=True)

    print("=======================================================")
    print("  Join Electronic Center — DirectAdmin / cPanel Packager")
    print("=======================================================")
    print(f"Working Directory : {web_dir}")
    print(f"Output Zip File   : {output_zip}\n")

    # Step 1: Temporarily isolate Node API routes for clean static export
    api_moved = False
    if os.path.exists(api_dir):
        print("-> Temporarily shelving Node.js server routes for static HTML export...")
        shutil.move(api_dir, api_backup)
        api_moved = True

    try:
        # Step 2: Run Next.js static build to generate out/
        print("-> Running Next.js static compilation (SSG)...")
        build_env = os.environ.copy()
        build_env["NEXT_EXPORT"] = "true"
        build_process = subprocess.run(["npm", "run", "build"], cwd=web_dir, env=build_env, shell=True, capture_output=True, text=True)
        if build_process.returncode != 0:
            print("Build stdout:\n", build_process.stdout)
            print("Build stderr:\n", build_process.stderr)
            raise RuntimeError("Next.js build failed!")
        print("-> Next.js static compilation completed successfully.")
    finally:
        # Restore Node API routes immediately
        if api_moved and os.path.exists(api_backup):
            print("-> Restoring Node.js API routes for local development...")
            shutil.move(api_backup, api_dir)

    # Step 3: Copy static export 'out/' to staging
    out_dir = os.path.join(web_dir, "out")
    if os.path.exists(out_dir):
        print("-> Copying all pre-rendered HTML, JS, CSS, and blog pages from out/...")
        shutil.copytree(out_dir, temp_staging, dirs_exist_ok=True)
    else:
        raise RuntimeError("out/ directory was not produced!")

    # Step 4: Copy public assets & PHP backend bridges
    public_dir = os.path.join(web_dir, "public")
    if os.path.exists(public_dir):
        print("-> Syncing public assets (photos, data, sitemap, PHP APIs, .htaccess)...")
        shutil.copytree(public_dir, temp_staging, dirs_exist_ok=True)

    # Step 5: Compress into production ZIP
    print("-> Compressing into production zip archive...")
    if os.path.exists(output_zip):
        os.remove(output_zip)

    file_count = 0
    total_uncompressed_bytes = 0

    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, _, files in os.walk(temp_staging):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_staging)
                zipf.write(file_path, arcname)
                file_count += 1
                total_uncompressed_bytes += os.path.getsize(file_path)

    # Cleanup staging
    shutil.rmtree(temp_staging, ignore_errors=True)

    zip_size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    raw_size_mb = total_uncompressed_bytes / (1024 * 1024)

    print("\n=======================================================")
    print("  PRODUCTION ZIP READY FOR DIRECTADMIN / cPANEL!")
    print("=======================================================")
    print(f"Target Zip File : {output_zip}")
    print(f"Total Files     : {file_count}")
    print(f"Uncompressed    : {raw_size_mb:.2f} MB")
    print(f"Compressed Size : {zip_size_mb:.2f} MB")
    print("=======================================================\n")

if __name__ == "__main__":
    build_and_package_cpanel()
