const CACHE_NAME = 'ispotifai-carimbozando-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './musicas/album_cover.png',
  './musicas/A%20Dona%20do%20Mundo.mp3',
  './musicas/A%20Dona%20do%20Mundo.txt',
  './musicas/O%20Norte%20%C3%A9%20o%20Adiante.mp3',
  './musicas/O%20Norte%20%C3%A9%20o%20Adiante.txt',
  './musicas/O%20Of%C3%ADcio%20de%20Ser.mp3',
  './musicas/O%20Of%C3%ADcio%20de%20Ser.txt',
  './musicas/O%20Rio%20que%20eu%20Era.mp3',
  './musicas/O%20Rio%20que%20eu%20Era.txt',
  './musicas/Onde%20o%20Sol%20se%20Demora.mp3',
  './musicas/Onde%20o%20Sol%20se%20Demora.txt'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        const cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return networkResponse;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
