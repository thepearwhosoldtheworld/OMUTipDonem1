const CACHE_NAME = 'piriformis-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/hesaplayici.html',
  '/kaynaklar.html',
  '/iletisim.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/arka-plan.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
