import { items } from './data-items.js';
import * as dom from './dom.js';
import * as ui from './ui.js';

let currentCategory = 'All';

/**
 * Renders the items in the grid based on the current category and search term.
 * @param {string} category - The category to display.
 * @param {string} [searchTerm=''] - The search term to filter by.
 */
function renderItems(category, searchTerm = '') {
    const grid = dom.itemGrid;
    if (!grid) return;

    grid.innerHTML = '';
    const searchTermLower = searchTerm.toLowerCase();

    const itemsToRender = items[category].filter(item => 
        item.name.toLowerCase().includes(searchTermLower)
    );

    if (itemsToRender.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-purple-200">No items found.</p>`;
        return;
    }

    itemsToRender.forEach((item, index) => {
        const card = document.createElement('button');
        card.className = 'item-card';
        card.style.animationDelay = `${index * 30}ms`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/80x80/1e1b4b/a78bfa?text=?'">
            <h3>${item.name}</h3>
        `;
        card.addEventListener('click', () => showItemDetailView(item));
        grid.appendChild(card);
    });
}

/**
 * Shows the detailed view for a specific item.
 * @param {object} item - The item object to display.
 */
function showItemDetailView(item) {
    dom.itemDetailTitle.innerHTML = `${item.name}<span class="hylian-name">${item.hylian_name || ''}</span>`;
    dom.itemDetailImage.src = item.image;
    dom.itemDetailDescription.textContent = item.description;
    dom.itemDetailAcquisition.textContent = item.acquisition;
    ui.switchView(dom.itemDetailView);
}

/**
 * Populates the Items view, sets up tabs and search functionality.
 */
export function populateItemsView() {
    const tabsContainer = dom.itemCategoryTabs;
    const searchInput = dom.itemSearchInput;
    if (!tabsContainer || !searchInput) return;

    // Create category tabs
    tabsContainer.innerHTML = '';
    Object.keys(items).forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'item-category-tab';
        tab.textContent = category;
        tab.dataset.category = category;
        if (category === currentCategory) {
            tab.classList.add('active');
        }
        tabsContainer.appendChild(tab);
    });

    // Add event listeners
    tabsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.item-category-tab')) {
            currentCategory = e.target.dataset.category;
            tabsContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            renderItems(currentCategory, searchInput.value);
        }
    });

    searchInput.addEventListener('input', () => {
        renderItems(currentCategory, searchInput.value);
    });

    // Initial render
    renderItems(currentCategory);
}