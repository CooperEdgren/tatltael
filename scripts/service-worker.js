// A unique name for the cache, incremented to force an update.
// Incrementing this version (e.g., to v3) forces the service worker to update and re-cache all files.
const CACHE_NAME = 'tatltael-cache-v9';

// The list of all files to be cached for offline access.
const urlsToCache = [
  'index.html',
  'style.css',
  // Scripts
  'scripts/app.js',
  'scripts/audio.js',
  'scripts/dom.js',
  'scripts/items-view.js',
  'scripts/maps-view.js',
  'scripts/notebook-view.js',
  'scripts/song-view.js',
  'scripts/ui.js',
  'scripts/hearts-view.js',
  // Data
  'data/fairies.json',
  'data/hearts.json',
  'data/items.json',
  'data/notebook.json',
  'data/game-data.json',
  // Key UI Images & Icons
  'images/moon.png',
  'images/tinglemyboy.png',
  'images/tatl.png',
  'images/tael.png',
  'images/linkOcarina.webp',
  // Nav Icons
  'images/songs_icon.png',
  'images/items_icon.png',
  'images/bombers-notebook.png',
  'images/heart_container_icon.png',
  'images/map_icon.png',
  'images/SS_Heart_Model.png',
  'images/heart_piece_sprites.png'
];

// Event listener for the 'install' event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        // Use addAll to ensure all assets are cached together.
        // If one fails, the entire cache operation fails.
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache one or more URLs:', error);
          // Log the URLs to see which one might be causing the issue
          console.log('URLs to cache:', urlsToCache);
        });
      })
  );
});

// Event listener for the 'activate' event
// This is where we clean up old, unused caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      ).catch(error => {
        console.error('Error deleting old cache:', error);
      });
    })
  );
});


// Event listener for the 'fetch' event
// This intercepts network requests and serves cached files if available (cache-first strategy).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }

        // If not in cache, fetch from the network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // We only cache GET requests.
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
