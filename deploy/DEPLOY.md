# Join Electronic Center — DirectAdmin & cPanel Deployment Guide

**Target Domain**: `joinelectroniccenter.com`  
**Production Zip**: [`deploy/joinelectroniccenter-cpanel-directadmin.zip`](file:///d:/Antigravity%20Project/store-catalog/deploy/joinelectroniccenter-cpanel-directadmin.zip) (30.9 MB)  
**Source Path**: [`website/site`](file:///d:/Antigravity%20Project/store-catalog/website/site)  

---

## 1. DirectAdmin Deployment Steps

1. **Log in to DirectAdmin**:
   - Access your DirectAdmin control panel URL (e.g. `https://your-server-ip:2222` or `https://server.domain.com:2222`).
2. **Open File Manager**:
   - Go to **System Info & Files** → **File Manager**.
   - Navigate to: `domains` → `joinelectroniccenter.com` → `public_html`.
3. **Clear Default / Placeholder Files**:
   - Select and delete default files (`index.html`, `default.php`, or old CMS folders).
4. **Upload the Production Zip**:
   - Click the **Upload File** button.
   - Drag & drop [`joinelectroniccenter-cpanel-directadmin.zip`](file:///d:/Antigravity%20Project/store-catalog/deploy/joinelectroniccenter-cpanel-directadmin.zip).
5. **Extract Files**:
   - Right-click the zip file → click **Extract**.
   - Ensure the extraction destination is set to `public_html` (root).
6. **Verify File Hierarchy in `public_html`**:
   - `index.html` (Homepage)
   - `shop.html`, `exchange.html`, `second-hand.html`, `blog.html`, `brand.html`, `category.html`, `contact.html`
   - `css/`, `js/`, `data/`, `photos/`, `products/`, `blog/`
   - `.htaccess`, `sitemap.xml`, `robots.txt`, `llms.txt`, `store.jsonld`, `count.php`
7. **Enable SSL (HTTPS)**:
   - Go to **Account Manager** → **SSL Certificates**.
   - Choose **Free & automatic certificate from Let's Encrypt** → check domain & `www` → click **Save**.

---

## 2. cPanel Deployment Steps

1. **Log in to cPanel**:
   - Access your cPanel portal (e.g. `https://joinelectroniccenter.com:2083` or your host URL).
2. **Open File Manager**:
   - Under **Files**, click **File Manager**.
   - Open `public_html` directory.
3. **Delete Old Files**:
   - Delete any default `index.html`, `cgi-bin`, or parked domain files.
4. **Upload & Extract**:
   - Click **Upload** in the top toolbar → select `joinelectroniccenter-cpanel-directadmin.zip`.
   - Once the progress bar turns green (100%), return to `public_html`.
   - Select the zip file → click **Extract** in the toolbar → confirm extract to `/public_html`.
5. **Enable Free SSL**:
   - Under **Security**, open **SSL/TLS Status** → click **Run AutoSSL** to ensure Let's Encrypt HTTPS is active.

---

## 3. Post-Deployment Verification Checklist

| Test Target | URL to Check | Expected Result |
|---|---|---|
| **Homepage** | `https://joinelectroniccenter.com` | Renders high-speed JEC catalog, slider, and exchange banner. |
| **Catalog API** | `https://joinelectroniccenter.com/data/catalog.json` | Returns JSON of 378+ verified products. |
| **18 SEO Buying Guides** | `https://joinelectroniccenter.com/blog.html` | Displays all 18 buying guides & price lists. |
| **Old TV Exchange** | `https://joinelectroniccenter.com/exchange.html` | Trade-in calculator with WhatsApp instant quote. |
| **AEO LLMs Feed** | `https://joinelectroniccenter.com/llms.txt` | Clean markdown summary for ChatGPT/Claude/Perplexity. |
| **XML Sitemap** | `https://joinelectroniccenter.com/sitemap.xml` | 400+ indexed URLs with timestamps. |
| **Visitor Counter** | `https://joinelectroniccenter.com/count.php` | LiteSpeed/Apache PHP live counter fallback active. |

---

## 4. Google Search Console & Bing Submission
1. Verification tags are already built into the `<head>` of all pages (`google-site-verification` & `msvalidate.01`).
2. Go to [Google Search Console](https://search.google.com/search-console) → Add Property `https://joinelectroniccenter.com` → Instant HTML Tag Verification.
3. Submit Sitemap URL: `https://joinelectroniccenter.com/sitemap.xml`.