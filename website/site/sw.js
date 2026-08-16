const CACHE_NAME = "jec-v1.0.1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/shop.html",
  "/exchange.html",
  "/second-hand.html",
  "/appliance-finder.html",
  "/brand.html",
  "/category.html",
  "/blog.html",
  "/contact.html",
  "/about.html",
  "/warranty.html",
  "/css/style.css",
  "/js/catalog.js",
  "/js/motion.js",
  "/js/search-modal.js",
  "/data/catalog.json",
  "/manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request).then((res) => {
          return res;
        }).catch(() => {
          if (e.request.destination === "document") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
