const CACHE_NAME = 'carimbozando-pwa-v7';
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-64.png",
  "./musicas/a-dona-do-mundo.mp3",
  "./musicas/a-dona-do-mundo.txt",
  "./musicas/album-cover.png",
  "./musicas/o-norte-e-o-adiante.mp3",
  "./musicas/o-norte-e-o-adiante.txt",
  "./musicas/o-oficio-de-ser.mp3",
  "./musicas/o-oficio-de-ser.txt",
  "./musicas/o-rio-que-eu-era.mp3",
  "./musicas/o-rio-que-eu-era.txt",
  "./musicas/onde-a-voz-mora.mp3",
  "./musicas/onde-a-voz-mora.txt",
  "./musicas/onde-o-sol-se-demora.mp3",
  "./musicas/onde-o-sol-se-demora.txt"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
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

  const isAudio = request.destination === 'audio' || url.pathname.includes('/musicas/');

  if (isAudio) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      } catch {
        return new Response('', { status: 404, statusText: 'Offline' });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch {
      return cache.match('./index.html');
    }
  })());
});
