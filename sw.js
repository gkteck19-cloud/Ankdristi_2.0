const CACHE_NAME = 'ankdristi-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/logic.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. सर्विस वर्कर को इंस्टॉल करना और फाइलों को सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Ankdristi: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. फाइलों को कैश से लोड करना (ताकि ऐप तेज़ी से खुले)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 3. पुराने कैश को साफ करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
