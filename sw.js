const CACHE_NAME = 'piriformis-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/hesaplayici.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/logo.png',
  '/arka-plan.jpg'
];

// Yükleme aşamasında dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Eski önbellekleri temizle
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

// Ağ isteklerini yakala (Önce önbelleğe bak, yoksa internetten çek)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});