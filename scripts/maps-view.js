import * as data from './data.js';
import * as dom from './dom.js';
import * as ui from './ui.js';

let currentMapIndex = 0;
let maps = [];

/**
 * Updates the map modal with a specific map's HD image and details.
 * Also handles the visibility of the navigation arrows.
 * @param {number} index - The index of the map in the data.maps array.
 */
function showHdMap(index) {
    // Clamp the index to be within the bounds of the maps array
    currentMapIndex = Math.max(0, Math.min(maps.length - 1, index));
    
    const map = maps[currentMapIndex];
    if (!map) return;

    // Construct the path to the high-resolution image
    const hdSrc = map.src.replace('maps/', 'maps/HD/');
    
    dom.mapModalImage.src = hdSrc;
    dom.mapModalTitle.textContent = map.name;

    // Show/hide navigation arrows based on the current index
    dom.mapModalPrev.classList.toggle('hidden', currentMapIndex === 0);
    dom.mapModalNext.classList.toggle('hidden', currentMapIndex === maps.length - 1);
}

/**
 * Opens the map modal to a specific map and makes it visible.
 * @param {number} index - The index of the map to display.
 */
const openMapModal = (index) => {
    showHdMap(index); // Show the selected map first
    dom.mapModal.classList.add('is-visible');
    dom.mapModal.classList.add('enable-pinch-zoom');
};

/**
 * Closes the map modal.
 */
export function closeMapModal() {
    dom.mapModal.classList.remove('is-visible');
}

/**
 * Populates the grid with map items.
 */
export async function populateMapsGrid(game = 'majoras-mask') {
    const gameDataPath = game === 'ocarina-of-time' ? '../data/oot-game-data.json' : '../data/game-data.json';
    try {
        const response = await fetch(gameDataPath);
        const gameData = await response.json();
        maps = gameData.maps || [];
    } catch (error) {
        console.error('Failed to load game data:', error);
        maps = [];
    }

    dom.mapGrid.innerHTML = '';
    maps.forEach((map, index) => {
        const mapItem = document.createElement('div');
        mapItem.className = 'map-item';
        mapItem.innerHTML = `<img src="${map.src}" alt="${map.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400x300/0d0818/a78bfa?text=Map+Not+Found'"><h3>${map.name}</h3>`;
        // Pass the index to the click handler
        mapItem.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            openMapModal(index);
        });
        dom.mapGrid.appendChild(mapItem);
    });
}

/**
 * Switches to the maps view.
 */
export function showMapsView() {
    ui.switchView(dom.mapsView);
}

// --- INITIALIZE HD MAP VIEW EVENT LISTENERS ---

// Listener for the previous map button
dom.mapModalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    ui.triggerHapticFeedback();
    showHdMap(currentMapIndex - 1);
});

// Listener for the next map button
dom.mapModalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    ui.triggerHapticFeedback();
    showHdMap(currentMapIndex + 1);
});
