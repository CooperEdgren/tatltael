// A unique name for the cache
const CACHE_NAME = 'tatltael-cache-v1';

// The list of files to be cached
// Add any other critical assets here, like fonts or key images.
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'audio.js',
  'data.js',
  'dom.js',
  'maps-view.js',
  'notebook-view.js',
  'song-view.js',
  'ui.js',
  'images/moon.png',
  'images/clocktown.png',
  'images/tinglemyboy.png',
  'images/songs_icon.png',
  'images/items_icon.png',
  'images/bombers-notebook.png',
  'images/masks_icon.png'
];

// Event listener for the 'install' event
// This is where we populate the cache with the app shell files.
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified assets to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for the 'fetch' event
// This intercepts network requests and serves cached files if available.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the request is in the cache, return the cached response
        if (response) {
          return response;
        }
        // Otherwise, fetch the request from the network
        return fetch(event.request);
      }
    )
  );
});
