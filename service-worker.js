const CACHE_NAME = 'carimbozando-player-v6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './musicas/album_cover.png',
  './musicas/A%20Dona%20do%20Mundo.mp3',
  './musicas/A%20Dona%20do%20Mundo.txt',
  './musicas/O%20Norte%20%C3%A9%20o%20Adiante.mp3',
  './musicas/O%20Norte%20%C3%A9%20o%20Adiante.txt',
  './musicas/O%20Of%C3%ADcio%20de%20Ser.mp3',
  './musicas/O%20Of%C3%ADcio%20de%20Ser.txt',
  './musicas/O%20Rio%20que%20eu%20Era.mp3',
  './musicas/O%20Rio%20que%20eu%20Era.txt',
  './musicas/Onde%20a%20Voz%20Mora.mp3',
  './musicas/Onde%20a%20Voz%20Mora.txt',
  './musicas/Onde%20o%20Sol%20se%20Demora.mp3',
  './musicas/Onde%20o%20Sol%20se%20Demora.txt'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async (url) => {
      try { await cache.add(url); } catch {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const isAudioOrText = request.destination === 'audio' || url.pathname.includes('/musicas/');
  if (isAudioOrText) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      } catch {
        return new Response('', { status: 404, statusText: 'Offline' });
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch {
      return caches.match('./index.html');
    }
  })());
});
