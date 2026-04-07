const CACHE_NAME = 'gas-delivery-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html', 
  '/driver.html',
  '/style.css',
  '/app.js',
  '/customer.js',
  '/admin.js',
  '/driver.js',
  '/firebase-config.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
