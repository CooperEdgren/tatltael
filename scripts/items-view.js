import { itemsData } from './data-items.js';
import * as dom from './dom.js';

/**
 * Creates and displays a modal with detailed information about a specific item.
 * @param {string} categoryKey - The key for the category (e.g., 'inventory').
 * @param {string} itemId - The ID of the item to display.
 */
function showItemDetailModal(categoryKey, itemId) {
    const category = itemsData[categoryKey];
    if (!category) return;

    const item = category.find(i => i.id === itemId);
    if (!item) return;

    const modalContent = document.createElement('div');
    modalContent.className = 'p-4 sm:p-6 rounded-lg relative max-w-lg w-11/12 main-container flex flex-col items-center text-center';

    let useSection = '';
    if (item.use) {
        useSection = `
            <div>
                <h4 class="font-bold text-lg text-purple-300 font-zelda mt-4">Use</h4>
                <p class="text-purple-100">${item.use}</p>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <button class="item-modal-close-btn">&times;</button>
        <img src="${item.image}" alt="${item.name}" class="w-24 h-24 mb-4 object-contain filter drop-shadow-lg" onerror="this.onerror=null;this.src='https://placehold.co/96x96/1e1b4b/a78bfa?text=?'">
        <h3 class="text-3xl font-zelda text-yellow-200 title-glow mb-2">${item.name}</h3>
        <div class="text-left w-full overflow-y-auto max-h-[50vh] pr-2 space-y-2 text-sm sm:text-base">
            <div>
                <h4 class="font-bold text-lg text-purple-300 font-zelda">Description</h4>
                <p class="text-purple-100">${item.description}</p>
            </div>
            <div>
                <h4 class="font-bold text-lg text-purple-300 font-zelda mt-4">Location</h4>
                <p class="text-purple-100">${item.location || 'Location not specified.'}</p>
            </div>
            ${useSection}
        </div>
    `;
    
    dom.itemDetailModal.innerHTML = '';
    dom.itemDetailModal.appendChild(modalContent);

    modalContent.querySelector('.item-modal-close-btn').addEventListener('click', () => {
        dom.itemDetailModal.classList.remove('is-visible');
    });

    dom.itemDetailModal.classList.add('is-visible');
}

/**
 * Populates the Items view with categorized grids of items.
 */
export function populateItemsView() {
    const container = dom.itemsContent;
    if (!container) return;

    container.innerHTML = ''; 

    const categoryOrder = ['inventory', 'equipment', 'masks', 'bottledItems', 'questItems', 'bossRemains'];

    for (const categoryKey of categoryOrder) {
        if (!itemsData[categoryKey] || itemsData[categoryKey].length === 0) {
            continue;
        }

        const category = itemsData[categoryKey];
        
        const header = document.createElement('h2');
        header.className = 'item-category-header';
        header.textContent = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        container.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'item-grid';
        
        for (const item of category) {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `<img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/80x80/1e1b4b/a78bfa?text=?'">`;
            
            card.addEventListener('click', () => showItemDetailModal(categoryKey, item.id));

            grid.appendChild(card);
        }
        
        container.appendChild(grid);
    }

    dom.itemDetailModal.addEventListener('click', (e) => {
        if (e.target === dom.itemDetailModal) {
            dom.itemDetailModal.classList.remove('is-visible');
        }
    });
}
