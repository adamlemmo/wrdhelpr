const CACHE_NAME = "my-pwa-cache-v4"; // 🔁 Bump this version on every update

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js"
];

// Install and cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Optional: activate immediately
});

// Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // Optional: take control immediately
});

// Intercept fetch and serve from cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});