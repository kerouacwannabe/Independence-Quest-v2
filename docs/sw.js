const CACHE_NAME = 'independence-quest-v2-v2';
const APP_ROOT = '/Independence-Quest-v2/';
const ASSETS = [
  APP_ROOT,
  `${APP_ROOT}index.html`,
  `${APP_ROOT}manifest.webmanifest`,
  `${APP_ROOT}404.html`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';
  const isSameOrigin = requestUrl.origin === self.location.origin;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (isSameOrigin && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (isNavigation) {
        return (await caches.match(`${APP_ROOT}index.html`)) || Response.error();
      }
      return Response.error();
    }
  })());
});
