let fairyData = {};

async function loadFairyData() {
    try {
        const response = await fetch('../data/fairies.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fairyData = await response.json();
    } catch (error) {
        console.error("Could not load fairy data:", error);
    }
}
import * as dom from './dom.js';
import * as ui from './ui.js';

let fairyProgress = {};
let activeTemple = 'Woodfall Temple';
let activeVersion = '3DS'; // '3DS' or 'N64'

/**
 * Loads fairy progress from local storage.
 */
function loadProgress() {
    const savedProgress = localStorage.getItem('strayFairyProgress');
    if (savedProgress) {
        fairyProgress = JSON.parse(savedProgress);
    } else {
        fairyProgress = JSON.parse(JSON.stringify(fairyData)); // Deep copy
    }
}

/**
 * Saves fairy progress to local storage.
 */
function saveProgress() {
    localStorage.setItem('strayFairyProgress', JSON.stringify(fairyProgress));
}

/**
 * Renders the checklist for the active temple and version.
 */
function renderChecklist() {
    const container = dom.fairyChecklistContainer;
    if (!container) return;

    container.innerHTML = '';
    const temple = fairyProgress[activeVersion][activeTemple];

    const reward = document.createElement('p');
    reward.className = 'text-purple-200 mb-4';
    reward.innerHTML = `<strong>Reward:</strong> ${temple.reward}`;
    container.appendChild(reward);

    temple.fairies.forEach((fairy, index) => {
        const item = document.createElement('div');
        item.className = 'fairy-checklist-item';
        if (fairy.found) {
            item.classList.add('found');
        }
        item.innerHTML = `
            <div class="checkbox"></div>
            <p>${fairy.location}</p>
        `;
        item.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            fairy.found = !fairy.found;
            saveProgress();
            renderChecklist();
        });
        container.appendChild(item);
    });
}

/**
 * Renders the temple tabs for the active version.
 */
function renderTempleTabs() {
    const tabsContainer = dom.fairyTempleTabs;
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    for (const templeName in fairyProgress[activeVersion]) {
        const tab = document.createElement('button');
        tab.className = 'fairy-temple-tab';
        tab.textContent = templeName;
        tab.dataset.temple = templeName;
        if (templeName === activeTemple) {
            tab.classList.add('active');
        }
        tab.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            activeTemple = templeName;
            tabsContainer.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
            renderChecklist();
        });
        tabsContainer.appendChild(tab);
    }
}

/**
 * Initializes the Stray Fairy tracker view.
 */
export async function populateFairiesView() {
    await loadFairyData();
    loadProgress();

    // Set initial active temple if not already set (e.g., on first load)
    if (!fairyProgress[activeVersion][activeTemple]) {
        activeTemple = Object.keys(fairyProgress[activeVersion])[0];
    }

    renderTempleTabs();
    renderChecklist();

    dom.versionToggle3DS.addEventListener('click', () => {
        ui.triggerHapticFeedback();
        activeVersion = '3DS';
        dom.versionToggle3DS.classList.add('active');
        dom.versionToggleN64.classList.remove('active');
        // Reset active temple to the first one in the new version's list
        activeTemple = Object.keys(fairyProgress[activeVersion])[0];
        renderTempleTabs();
        renderChecklist();
    });

    dom.versionToggleN64.addEventListener('click', () => {
        ui.triggerHapticFeedback();
        activeVersion = 'N64';
        dom.versionToggleN64.classList.add('active');
        dom.versionToggle3DS.classList.remove('active');
        // Reset active temple to the first one in the new version's list
        activeTemple = Object.keys(fairyProgress[activeVersion])[0];
        renderTempleTabs();
        renderChecklist();
    });

    // Set initial active state for version toggles
    if (activeVersion === '3DS') {
        dom.versionToggle3DS.classList.add('active');
        dom.versionToggleN64.classList.remove('active');
    } else {
        dom.versionToggleN64.classList.add('active');
        dom.versionToggle3DS.classList.remove('active');
    }
}