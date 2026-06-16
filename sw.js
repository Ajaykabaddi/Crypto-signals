const CACHE = 'crypto-signal-v2';
const ASSETS = [
  '/Crypto-signals/',
  '/Crypto-signals/index.html',
  '/Crypto-signals/manifest.json',
  '/Crypto-signals/icon-192.png',
  '/Crypto-signals/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Crypto Signal', {
      body: data.body || 'New signal detected!',
      icon: '/Crypto-signals/icon-192.png',
      badge: '/Crypto-signals/icon-192.png',
      vibrate: [300, 100, 300],
    })
  );
});
