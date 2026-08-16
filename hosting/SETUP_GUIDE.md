# Hosting Setup Guide: DirectAdmin & cPanel

Zip location: `hosting/joinelectroniccenter-site.zip`

---

## 1. DirectAdmin Setup Guide

1. Log into **DirectAdmin** panel (`https://your-domain.com:2222`).
2. Go to **System Info & Files** -> **File Manager**.
3. Navigate to domain directory: `domains/yourdomain.com/public_html`.
4. Delete default placeholder files (`index.html`, `logo.png`, `default.html`).
5. Click **Upload File** -> Select `joinelectroniccenter-site.zip`.
6. Right-click / hover `joinelectroniccenter-site.zip` -> Select **Extract** -> Extract to `public_html`.
7. Verify file layout in `public_html`:
   - `index.html`
   - `shop.html`
   - `count.php`
   - `css/`
   - `js/`
   - `data/`
   - `photos/`
   - `products/`
8. Delete `joinelectroniccenter-site.zip` from server to save disk space.
9. Enable SSL: Go to **Account Manager** -> **SSL Certificates** -> Select **Free & automatic certificate from Let's Encrypt** -> **Save**.

---

## 2. cPanel Setup Guide

1. Log into **cPanel** (`https://your-domain.com:2083`).
2. Open **File Manager** -> double-click `public_html`.
3. Select & delete existing temporary/placeholder files.
4. Click **Upload** (top bar) -> Choose `joinelectroniccenter-site.zip`.
5. Back in `public_html`, select `joinelectroniccenter-site.zip` -> click **Extract** (top toolbar).
6. Confirm extraction path: `/public_html`.
7. Remove `joinelectroniccenter-site.zip` after extraction.
8. Enable SSL: Open **SSL/TLS Status** in cPanel -> Click **Run AutoSSL**.

---

## 3. Visit Counter & Dynamic Fallbacks

- `count.php` handles visit counter automatically on Apache / LiteSpeed / Nginx PHP-FPM servers.
- Fallback: LocalStorage in browser if PHP is disabled.
- Optional Node.js server (`server.js`): Use cPanel "Setup Node.js App" or DirectAdmin Node selector pointing application root to `public_html` and startup file to `server.js`.
