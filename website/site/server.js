const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const VISITS = path.join(ROOT, 'data', 'visits.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

function readVisits() {
  try { return JSON.parse(fs.readFileSync(VISITS, 'utf8')); } catch (e) { return { count: 0 }; }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/count' || pathname === '/count/') {
    const data = readVisits();
    data.count = (Number(data.count) || 0) + 1;
    try { fs.writeFileSync(VISITS, JSON.stringify(data)); } catch (e) { /* read-only FS */ }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ value: data.count }));
    return;
  }

  let file = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let abs = path.join(ROOT, file);
  if (!abs.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }

  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      if (st && st.isDirectory()) {
        abs = path.join(abs, 'index.html');
        return serveFile(abs, res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    serveFile(abs, res);
  });
});

function serveFile(abs, res) {
  fs.readFile(abs, (err, data) => {
    if (err) { res.writeHead(500); res.end('Server Error'); return; }
    const ext = path.extname(abs).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log('Join Electronic Center site running: http://localhost:' + PORT);
});