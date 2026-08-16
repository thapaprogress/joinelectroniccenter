# Meta AI Messenger Agent — Setup Guide

Goal: Messenger / Instagram DMs auto-answer with real catalog data (prices,
models, photos) for **Join Electronic Center**.

## Prerequisites
- Domain **joinelectroniccenter.com** live (site deployed — see DEPLOY.md)
- Google Sheet with catalog uploaded (see below, Google Sheets section)

## Step 1 — Deploy site with photos
Site is a static folder. All 378 products + 220 photos must be reachable at:
`https://joinelectroniccenter.com/` (catalog.json, products/, photos/, llms.txt).
**Photos are served from `https://joinelectroniccenter.com/photos/<brand>/<file>.png`**
— the agent reads Photo URLs from the catalog. Without deploy, agent has no photos.
→ See `DEPLOY.md` for cPanel / Netlify steps.

## Step 2 — Google Sheet catalog (data source for the agent)
1. Create service account:
   https://console.cloud.google.com/ → project → enable **Google Sheets API**
   → Credentials → Create Credentials → **Service Account** → Keys → Add Key →
   JSON → save as `store-catalog\credentials\service_account.json`
2. Tell the assistant "credentials ready" — it runs `upload_sheets.py` to:
   - Create spreadsheet **Store Catalog** (Master tab: 378 products, all fields
     incl. **Photo URL** and **Product URL**; plus one tab per brand)
   - Auto-share "anyone with link (viewer)"
   - Print the Sheet URL

## Step 3 — Build the AI agent in Meta Business Suite
1. Go to **business.facebook.com** → your Page (Join Electronic Center).
2. **Settings → AI Agent** (or **Meta AI Agent** under WhatsApp/Inbox tools).
3. Name: `Join Electronic Center Assistant`.
4. **Connect data**:
   - Primary: paste the **Google Sheet URL** from Step 2 as the product data source.
   - Optional backup: paste `https://joinelectroniccenter.com/products/products.json`
     and `https://joinelectroniccenter.com/llms.txt` as reference data.
5. **Instructions**: paste the full text from
   `reports\META_AI_AGENT_INSTRUCTIONS.md`. It teaches the agent:
   - store identity, address, hours, both numbers
   - to always show the product **Photo URL**
   - the 2–3 product recommendation format
   - EMI / exchange / warranty / delivery policies
   - WhatsApp handoff link for orders
6. **Set defaults**: timezone `Asia/Kathmandu`, currency NPR.
7. Enable the agent on **Messenger** and optionally Instagram.

## Step 4 — Test
Send these test messages from a second Facebook account:
- "Show me refrigerators under 90,000 NPR" → expect 2–3 products + photos + prices
- "What is the price of AURA AU12FSWAC?" → expect exact price + photo
- "Do you have EMI for a Samsung 55 inch TV?" → expect EMI policy + handoff link
- "कोई फ्रिज सस्तो छ?" (Nepali) → expect Nepali answer with options

## Step 5 — Keep data fresh
Whenever the catalog changes:
1. Run `python scraper\build_site_v2.py` (regenerates site + feeds)
2. Run `python upload_sheets.py` (refreshes the Sheet; `--new` to recreate)
3. Re-upload `website\site` to the host (if photos changed)

## Troubleshooting
- Agent answers without photos → Photo URL column empty for that model, or site
  not deployed. Fix deploy, re-upload Sheet.
- Agent makes up prices → remove the model from catalog or refresh Sheet; make
  sure instructions say "never invent prices".
- Handoff link not opening → confirm WhatsApp number format `9779765985999`
  (no `+`) in the instructions.