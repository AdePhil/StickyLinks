var cacheName = "sn-1.00";
var files = [
  'index.html',
  'img/stickyimage.png',
  'css/style.css',
  'js/main.js'
];

self.addEventListener("install", function(e){
  console.log("Cache me if  you can");
  console.log("[serviceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(files);
    })
  );
})

self.addEventListener('activate', function(e) {
  console.log("You can cache me outside with that BS");
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  try{
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }catch(err){
    console.log("Failed");
  }

});
