const CACHE = 'workbook-constellation-__BUILD_ID__';
const SHELL = ['/', '/demo', '/privacy', '/terms', '/favicon.svg', '/art/hero-768-9e3e4d45.webp'];
self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  const html = await (await fetch('/')).text();
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(match => match[1]);
  if (assets.length) await cache.addAll(assets);
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  const cacheResponse = response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  };
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(cacheResponse).catch(async () => (await caches.match(event.request)) || (await caches.match('/'))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request).then(cacheResponse).catch(() => caches.match('/', { ignoreVary: true }))));
});
