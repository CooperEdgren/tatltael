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

    const fragment = document.createDocumentFragment();
    itemsToRender.forEach((item, index) => {
        const card = document.createElement('button');
        card.className = 'item-card';
        card.style.animationDelay = `${index * 30}ms`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/80x80/1e1b4b/a78bfa?text=?'">
            <h3>${item.name}</h3>
        `;
        card.addEventListener('click', (e) => {
            ui.triggerHapticFeedback();
            showItemDetailView(item, e.currentTarget.getBoundingClientRect());
        });
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
}

/**
 * Shows the detailed view for a specific item.
 * @param {object} item - The item object to display.
 * @param {DOMRect} clickedElementRect - The bounding rectangle of the element that was clicked.
 */
export function showItemDetailView(item, clickedElementRect) {
    dom.itemDetailTitle.innerHTML = `${item.name}<span class="hylian-name">${item.hylian_name || ''}</span>`;
    dom.itemDetailImage.src = item.image;
    dom.itemDetailDescription.textContent = item.description;
    dom.itemDetailAcquisition.textContent = item.acquisition;

    const actionsContainer = document.getElementById('item-actions');
    if (!actionsContainer) {
        const newActionsContainer = document.createElement('div');
        newActionsContainer.id = 'item-actions';
        newActionsContainer.className = 'mt-6';
        dom.itemDetailView.querySelector('main').appendChild(newActionsContainer);
    }
    
    const container = actionsContainer || document.getElementById('item-actions');
    container.innerHTML = '';

    if (item.name === 'Ocarina of Time') {
        const useButton = document.createElement('button');
        useButton.className = 'btn-back';
        useButton.textContent = 'Use';
        useButton.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            window.location.href = 'ocarina.html';
        });
        container.appendChild(useButton);
    }

    if (clickedElementRect) {
        const startTransform = ui.getAnimationTransforms(clickedElementRect);
        dom.itemDetailView.style.transform = startTransform;
        dom.itemDetailView.style.transformOrigin = 'center';
    }

    ui.switchView(dom.itemDetailView);

    if (clickedElementRect) {
        requestAnimationFrame(() => {
            dom.itemDetailView.style.transform = 'translate(0, 0) scale(1)';
        });
    }
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
    const fragment = document.createDocumentFragment();
    Object.keys(items).forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'item-category-tab';
        tab.textContent = category;
        tab.dataset.category = category;
        if (category === currentCategory) {
            tab.classList.add('active');
        }
        fragment.appendChild(tab);
    });
    tabsContainer.appendChild(fragment);

    // Add event listeners
    tabsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.item-category-tab')) {
            ui.triggerHapticFeedback();
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