// A unique name for the cache, incremented to force an update.
const CACHE_NAME = 'tatltael-cache-v13';

// The list of all files to be cached for offline access.
const urlsToCache = [
  'index.html',
  'oot.html',
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
  'images/heart_piece_sprites.png',

  // Pokedex App Files
  'pokedex.html',
  'css/pokedex.css?v=1.2',
  'scripts/pokedex/app.js',
  'scripts/pokedex/badges.js',
  'scripts/pokedex/cache.js',
  'scripts/pokedex/constants.js',
  'scripts/pokedex/favorites.js',
  'scripts/pokedex/filter.js',
  'scripts/pokedex/filter-manager.js',
  'scripts/pokedex/modal.js',
  'scripts/pokedex/pokemon.js',
  'scripts/pokedex/pokemon-selector.js',
  'scripts/pokedex/save-parser.js',
  'scripts/pokedex/state.js',
  'scripts/pokedex/team-analyzer.js',
  'scripts/pokedex/tracker.js',
  'scripts/pokedex/trainer-card.js',
  'scripts/pokedex/ui.js',

  // Pokedex Assets
  'images/pokedex-assets/delta.png',
  'images/pokedex-assets/pokedex.png',
  'images/pokedex-assets/trainercard.svg',
  'images/pokedex-assets/badges/balance.png',
  'images/pokedex-assets/badges/basic.png',
  'images/pokedex-assets/badges/beacon.png',
  'images/pokedex-assets/badges/bolt.png',
  'images/pokedex-assets/badges/boulder.png',
  'images/pokedex-assets/badges/cascade.png',
  'images/pokedex-assets/badges/coal.png',
  'images/pokedex-assets/badges/cobble.png',
  'images/pokedex-assets/badges/dynamo.png',
  'images/pokedex-assets/badges/earth.png',
  'images/pokedex-assets/badges/feather.png',
  'images/pokedex-assets/badges/fen.png',
  'images/pokedex-assets/badges/fog.png',
  'images/pokedex-assets/badges/forest.png',
  'images/pokedex-assets/badges/freeze.png',
  'images/pokedex-assets/badges/glacier.png',
  'images/pokedex-assets/badges/heat.png',
  'images/pokedex-assets/badges/hive.png',
  'images/pokedex-assets/badges/icicle.png',
  'images/pokedex-assets/badges/insect.png',
  'images/pokedex-assets/badges/jet.png',
  'images/pokedex-assets/badges/knuckle.png',
  'images/pokedex-assets/badges/legend.png',
  'images/pokedex-assets/badges/marsh.png',
  'images/pokedex-assets/badges/mind.png',
  'images/pokedex-assets/badges/mine.png',
  'images/pokedex-assets/badges/mineral.png',
  'images/pokedex-assets/badges/plain.png',
  'images/pokedex-assets/badges/quake.png',
  'images/pokedex-assets/badges/rain.png',
  'images/pokedex-assets/badges/rainbow.png',
  'images/pokedex-assets/badges/relic.png',
  'images/pokedex-assets/badges/rising.png',
  'images/pokedex-assets/badges/soul.png',
  'images/pokedex-assets/badges/stone.png',
  'images/pokedex-assets/badges/storm.png',
  'images/pokedex-assets/badges/thunder.png',
  'images/pokedex-assets/badges/toxic.png',
  'images/pokedex-assets/badges/trio.png',
  'images/pokedex-assets/badges/volcano.png',
  'images/pokedex-assets/badges/wave.png',
  'images/pokedex-assets/badges/zephyr.png',
  'images/pokedex-assets/icons/bug.svg',
  'images/pokedex-assets/icons/dark.svg',
  'images/pokedex-assets/icons/dragon.svg',
  'images/pokedex-assets/icons/electric.svg',
  'images/pokedex-assets/icons/eye.svg',
  'images/pokedex-assets/icons/fairy.svg',
  'images/pokedex-assets/icons/fighting.svg',
  'images/pokedex-assets/icons/fire.svg',
  'images/pokedex-assets/icons/flying.svg',
  'images/pokedex-assets/icons/ghost.svg',
  'images/pokedex-assets/icons/grass.svg',
  'images/pokedex-assets/icons/ground.svg',
  'images/pokedex-assets/icons/ice.svg',
  'images/pokedex-assets/icons/normal.svg',
  'images/pokedex-assets/icons/poison.svg',
  'images/pokedex-assets/icons/psychic.svg',
  'images/pokedex-assets/icons/rock.svg',
  'images/pokedex-assets/icons/steel.svg',
  'images/pokedex-assets/icons/upload.svg',
  'images/pokedex-assets/icons/user.svg',
  'images/pokedex-assets/icons/water.svg',
  'images/pokedex-assets/svg/pokeball.svg',
  'images/pokedex-assets/trainers/gen1.png',
  'images/pokedex-assets/trainers/gen1female.png',
  'images/pokedex-assets/trainers/gen2.png',
  'images/pokedex-assets/trainers/gen2female.png',
  'images/pokedex-assets/trainers/gen3.png',
  'images/pokedex-assets/trainers/gen3female.png',
  'images/pokedex-assets/trainers/gen4.png',
  'images/pokedex-assets/trainers/gen4female.png',
  'images/pokedex-assets/trainers/gen5.png',
  'images/pokedex-assets/trainers/gen5female.png',
  'images/pokedex-assets/trainers/gen5var2.png',
  'images/pokedex-assets/trainers/gen5var2female.png',
  'images/pokedex-assets/types/bug.png',
  'images/pokedex-assets/types/dark.png',
  'images/pokedex-assets/types/dragon.png',
  'images/pokedex-assets/types/electric.png',
  'images/pokedex-assets/types/fairy.png',
  'images/pokedex-assets/types/fighting.png',
  'images/pokedex-assets/types/fire.png',
  'images/pokedex-assets/types/flying.png',
  'images/pokedex-assets/types/ghost.png',
  'images/pokedex-assets/types/grass.png',
  'images/pokedex-assets/types/ground.png',
  'images/pokedex-assets/types/ice.png',
  'images/pokedex-assets/types/normal.png',
  'images/pokedex-assets/types/poison.png',
  'images/pokedex-assets/types/psychic.png',
  'images/pokedex-assets/types/rock.png',
  'images/pokedex-assets/types/steel.png',
  'images/pokedex-assets/types/water.png',
  'fonts/pokedex-assets/TATAMI.otf',
  'fonts/pokedex-assets/Westmount Black.otf',
  'fonts/pokedex-assets/Westmount Bold.otf',
  'fonts/pokedex-assets/Westmount Light.otf',
  'fonts/pokedex-assets/Westmount Regular.otf',
  'fonts/pokedex-assets/Westmount Thin.otf'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache one or more URLs:', error);
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients.
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
});