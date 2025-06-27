import * as data from './data.js';
import * as dom from './dom.js';
import * as ui from './ui.js';

/**
 * Opens the map modal with the selected map image.
 * @param {string} src - The source URL of the map image.
 */
const openMapModal = (src) => {
    dom.mapModalImage.src = src;
    dom.mapModal.classList.add('is-visible');
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
export function populateMapsGrid() {
    dom.mapGrid.innerHTML = '';
    data.maps.forEach(map => {
        const mapItem = document.createElement('div');
        mapItem.className = 'map-item';
        mapItem.innerHTML = `<img src="${map.src}" alt="${map.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400x300/0d0818/a78bfa?text=Map+Not+Found'"><h3>${map.name}</h3>`;
        mapItem.addEventListener('click', () => openMapModal(map.src));
        dom.mapGrid.appendChild(mapItem);
    });
}

/**
 * Switches to the maps view.
 */
export function showMapsView() {
    ui.switchView(dom.mapsView);
}
