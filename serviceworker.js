self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'index.html',
        'showdata.html,
        'scanner.js',
        'navbar.js',
        'style.css',
        '/pwa/ffhk.png',
        '/pwa/manifest.json',
        '/classes/camera.js',
        '/classes/init.js',
        '/classes/pdf.js',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(async function() {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;
    return fetch(event.request);
  }());
});

