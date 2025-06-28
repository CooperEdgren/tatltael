// A unique name for the cache, incremented to force an update
const CACHE_NAME = 'tatltael-cache-v2';

// The list of files to be cached, now including new scripts and icons
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'scripts/app.js',
  'scripts/audio.js',
  'scripts/data.js',
  'scripts/data-items.js', // New
  'scripts/dom.js',
  'scripts/items-view.js', // New
  'scripts/maps-view.js',
  'scripts/notebook-view.js',
  'scripts/song-view.js',
  'scripts/ui.js',
  // Key UI Images
  'images/moon.png',
  'images/tinglemyboy.png',
  // Nav Icons
  'images/songs_icon.png',
  'images/items_icon.png',
  'images/bombers-notebook.png',
  'images/masks_icon.png',
  'images/heart_container_icon.png',
  'images/maps_icon.png',
  // Item Images (add more as needed for offline support)
  'images/items/inventory/Ocarina_of_Time_3D.png',
  'images/items/inventory/Heros_Bow_3D.png',
  'images/items/equipment/Heros_Shield_3D.png',
  'images/items/masks/Deku_Mask_3D.png',
  'images/items/masks/Goron_Mask_3D.png',
  'images/items/masks/Zora_Mask_3D.png',
  'images/items/bottled/Empty_Bottle_3D.png'
];

// Event listener for the 'install' event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for the 'activate' event
// This is where we clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// Event listener for the 'fetch' event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's also a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // We don't want to cache everything, just GET requests
                if(event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
    );
});
