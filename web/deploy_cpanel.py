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

    output_zip = os.path.join(deploy_dir, "joinelectroniccenter-cpanel-directadmin.zip")
    api_dir = os.path.join(web_dir, "src", "app", "api")
    api_backup = os.path.join(web_dir, "_api_temp_backup")
    dot_next = os.path.join(web_dir, ".next")
    out_dir = os.path.join(web_dir, "out")

    print("=======================================================")
    print("  Join Electronic Center — DirectAdmin / cPanel Packager")
    print("=======================================================")
    print(f"Working Directory : {web_dir}")
    print(f"Target Zip File   : {output_zip}\n")

    # Step 1: Clean previous .next cache & out
    if os.path.exists(dot_next):
        print("-> Clearing .next cache...")
        shutil.rmtree(dot_next, ignore_errors=True)
    if os.path.exists(out_dir):
        print("-> Clearing old out directory...")
        shutil.rmtree(out_dir, ignore_errors=True)

    # Step 2: Temporarily shelve Node.js API routes for clean static SSG export
    api_moved = False
    if os.path.exists(api_dir):
        print("-> Temporarily shelving Node.js server routes for static HTML export...")
        shutil.move(api_dir, api_backup)
        api_moved = True

    try:
        # Step 3: Run Next.js static build to generate out/
        print("-> Running Next.js static compilation (SSG)...")
        build_env = os.environ.copy()
        build_env["NEXT_EXPORT"] = "true"
        build_process = subprocess.run(["npx", "next", "build"], cwd=web_dir, env=build_env, shell=True, capture_output=True, text=True)
        if build_process.returncode != 0:
            print("Build stdout:\n", build_process.stdout)
            print("Build stderr:\n", build_process.stderr)
            raise RuntimeError("Next.js static export failed!")
        print("-> Next.js static compilation completed successfully.")
    finally:
        # Restore Node API routes immediately
        if api_moved and os.path.exists(api_backup):
            print("-> Restoring Node.js API routes for local development...")
            shutil.move(api_backup, api_dir)

    # Step 4: Ensure public assets & PHP backend bridges are in out/
    public_dir = os.path.join(web_dir, "public")
    if os.path.exists(public_dir):
        print("-> Syncing public assets (photos, images, admin, PHP APIs, .htaccess)...")
        shutil.copytree(public_dir, out_dir, dirs_exist_ok=True)

    # Step 5: Compress into production ZIP with POSIX forward slashes
    print("-> Compressing into production zip archive...")
    if os.path.exists(output_zip):
        os.remove(output_zip)

    file_count = 0
    total_uncompressed_bytes = 0

    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, _, files in os.walk(out_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, out_dir).replace("\\", "/")
                zipf.write(file_path, arcname)
                file_count += 1
                total_uncompressed_bytes += os.path.getsize(file_path)

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
