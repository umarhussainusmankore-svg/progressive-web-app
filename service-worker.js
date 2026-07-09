const CACHE_NAME = 'abdull-nura-portfolio-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './images/profile.svg',
  './icons/icon-72x72.svg',
  './icons/icon-96x96.svg',
  './icons/icon-128x128.svg',
  './icons/icon-144x144.svg',
  './icons/icon-152x152.svg',
  './icons/icon-192x192.svg',
  './icons/icon-384x384.svg',
  './icons/icon-512x512.svg',
  './icons/icon-512x512-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match('./index.html');
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const networkPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  const cacheableExtensions = ['.css', '.js', '.json', '.svg', '.html', '.jpg', '.jpeg', '.png'];
  const shouldCache = cacheableExtensions.some((extension) => url.pathname.endsWith(extension));

  if (shouldCache) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
