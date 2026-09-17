// PŘI KAŽDÉ DALŠÍ ZMĚNĚ WEBU ZVEDNI TOTO ČÍSLO (v2, v3, v4...)
const CACHE_NAME = 'maximosmyko-v4'; 

const urlsToCache = [
'./',
  './index.html',
  './style.css',
  './script.js',
  './ruleta.html', // <-- ZDE PŘIDANÁ RULETA
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
// --- ODESLÁNÍ JMEN DO RULETY ---
const btnRoulette = document.getElementById('go-to-roulette');
if (btnRoulette) {
    btnRoulette.addEventListener('click', function() {
        const nameInputs = document.querySelectorAll('#player-names input');
        let names = [];
        
        // Posbíráme jen ta políčka, ve kterých je něco napsané
        nameInputs.forEach(input => {
            if(input.value.trim() !== "") {
                names.push(input.value.trim());
            }
        });
        
        if(names.length < 2) {
            alert("Pro ruletu musíte zadat alespoň 2 jména!");
            return;
        }

        const teamSize = document.getElementById('team-size-input').value;
        
        // Uložení do paměti prohlížeče
        sessionStorage.setItem('maximo_roulette_names', JSON.stringify(names));
        sessionStorage.setItem('maximo_roulette_size', teamSize);
        
        // Přepnutí na ruletu
        window.location.href = 'ruleta.html';
    });
}
