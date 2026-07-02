// PŘI KAŽDÉ DALŠÍ ZMĚNĚ WEBU ZVEDNI TOTO ČÍSLO (v2, v3, v4...)
const CACHE_NAME = 'maximosmyko-v2'; 

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './korunka.png',
  './vnitrekmaximo.jpg'
];

// Instalace a uložení do paměti
self.addEventListener('install', event => {
  self.skipWaiting(); // Vnutí okamžitou instalaci nové verze
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Smazání staré paměti při vydání nové verze
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Smaže staré verze (v1)
          }
        })
      );
    })
  );
});

// Načítání souborů
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
