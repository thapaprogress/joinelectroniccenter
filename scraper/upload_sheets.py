import gspread
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

creds_file = r"C:\Users\USER\AppData\Local\google-vscode-extension\auth\application_default_credentials.json"
d = json.load(open(creds_file, encoding="utf-8"))
creds = Credentials(
    token=None,
    refresh_token=d.get("refresh_token"),
    token_uri="https://oauth2.googleapis.com/token",
    client_id=d.get("client_id"),
    client_secret=d.get("client_secret"),
    scopes=["https://www.googleapis.com/auth/spreadsheets"],
)
creds.refresh(Request())
print("auth OK")
gc = gspread.authorize(creds)
sh = gc.create("meta_ai_store_catalog")
print("sheet created:", sh.id)
print("url:", sh.url)

import csv
from pathlib import Path

BASE = Path(r"D:\Antigravity Project\store-catalog")
rows = json.load(open(BASE / "data" / "merged" / "catalog_master.json", encoding="utf-8"))
cols = ["brand", "category", "type", "capacity", "model_code", "product_name",
        "mrp_npr", "short_description", "detailed_specs", "specs_list",
        "image_url", "photo_path", "warranty", "source", "whatsapp"]

data = [cols]
for r in rows:
    row = []
    for c in cols:
        v = r.get(c) or ""
        if isinstance(v, list):
            v = " | ".join(str(x) for x in v)
        row.append(str(v))
    data.append(row)

ws = sh.get_worksheet(0)
ws.update("A1", data)
print("rows written:", len(data) - 1)
try:
    sh.share(None, perm_type="anyone", role="reader")
    print("shared: anyone with link (viewer)")
except Exception as e:
    print("share failed:", e)