
const CACHE_NAME = 'color-matrix-v1';
const ASSETS = ['./index.html', './manifest.webmanifest', './favicon.svg', './icons.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
