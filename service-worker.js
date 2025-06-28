const CACHE_NAME = 'wrdhelpr-cache-v1';
const ASSETS_TO_CACHE = [
  '/',            // index.html root
  '/index.html',
  '/manifest.json',
  '/style.css',   // or your CSS file(s)
  '/main.js',     // or your JS file(s)
  '/icon-192.png',
  '/icon-512.png',
  // Add other assets you want cached
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) =>
      cachedResponse || fetch(event.request)
    )
  );
});
