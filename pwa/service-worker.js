
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('Ces').then((cache) => 
            cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/icons/icon-512x512.png'
            ])
        )
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => 
            response || fetch(e.request)
        )
    );
});
            