export let heartData = {};

export async function loadHeartData() {
    try {
        const response = await fetch('../data/hearts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        heartData = await response.json();
    } catch (error) {
        console.error("Could not load heart data:", error);
    }
}
import * as dom from './dom.js';
import * as ui from './ui.js';

let currentVersion = 'n64';
const heartState = {};

function saveState() {
    localStorage.setItem('tatltael-heart-state', JSON.stringify(heartState));
}

function loadState() {
    const savedState = localStorage.getItem('tatltael-heart-state');
    if (savedState) {
        Object.assign(heartState, JSON.parse(savedState));
    } else {
        // Initialize default state if nothing is saved
        Object.keys(heartData).forEach(version => {
            heartData[version].pieces.forEach(piece => {
                if (heartState[piece.id] === undefined) {
                    heartState[piece.id] = piece.found;
                }
            });
            heartData[version].containers.forEach(container => {
                if (heartState[container.id] === undefined) {
                    heartState[container.id] = container.found;
                }
            });
        });
    }
}

export function render() {
    renderHeartPieces();
    updateCounters();
}

export function setHeartItemFound(itemId) {
    if (heartState[itemId] !== undefined && !heartState[itemId]) {
        heartState[itemId] = true;
        saveState();
        // If the hearts view is active, re-render it to show the change immediately
        if (dom.heartContainersContent.classList.contains('main-content') && !dom.heartContainersContent.classList.contains('hidden')) {
            render();
        }
    }
}

function renderHeartPieces() {
    const container = dom.heartChecklistContainer;
    if (!container) return;

    container.innerHTML = '';
    const data = heartData[currentVersion];

    // Render Heart Containers
    const containersTitle = document.createElement('h3');
    containersTitle.className = 'heart-section-title';
    containersTitle.textContent = 'Heart Containers';
    container.appendChild(containersTitle);

    data.containers.forEach(hc => {
        const isFound = heartState[hc.id] || false;
        const item = document.createElement('div');
        item.className = `heart-checklist-item ${isFound ? 'found' : ''}`;
        item.dataset.id = hc.id;
        item.innerHTML = `
            <div class="checkbox"></div>
            <div class="description">
                <p>${hc.name}</p>
            </div>
        `;
        item.addEventListener('click', () => toggleItem(hc.id));
        container.appendChild(item);
    });

    // Group pieces by location
    const piecesByLocation = data.pieces.reduce((acc, piece) => {
        const location = piece.location;
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(piece);
        return acc;
    }, {});

    // Render Heart Pieces by location
    for (const location in piecesByLocation) {
        const locationTitle = document.createElement('h3');
        locationTitle.className = 'heart-section-title';
        locationTitle.textContent = location;
        container.appendChild(locationTitle);

        piecesByLocation[location].forEach(piece => {
            const isFound = heartState[piece.id] || false;
            const item = document.createElement('div');
            item.className = `heart-checklist-item ${isFound ? 'found' : ''}`;
            item.dataset.id = piece.id;
            item.innerHTML = `
                <div class="checkbox"></div>
                <div class="description">
                    <p>${piece.description}</p>
                </div>
                <button class="walkthrough-toggle">▼</button>
            `;
            const walkthrough = document.createElement('div');
            walkthrough.className = 'walkthrough';
            walkthrough.innerHTML = `<p>${piece.walkthrough}</p>`;
            item.appendChild(walkthrough);

            item.querySelector('.checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleItem(piece.id);
            });

            item.querySelector('.walkthrough-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWalkthrough(e.currentTarget);
            });

            container.appendChild(item);
        });
    }
    updateCounters();
}

function toggleWalkthrough(button) {
    ui.triggerHapticFeedback();
    const item = button.closest('.heart-checklist-item');
    const walkthrough = item.querySelector('.walkthrough');
    walkthrough.classList.toggle('open');
    button.textContent = walkthrough.classList.contains('open') ? '▲' : '▼';
}

function toggleItem(id) {
    ui.triggerHapticFeedback();
    heartState[id] = !heartState[id];
    saveState();
    render();
}

function updateCounters() {
    const pieces = heartData[currentVersion].pieces;
    const containers = heartData[currentVersion].containers;

    const foundPiecesCount = pieces.filter(p => heartState[p.id]).length;
    const foundContainersCount = containers.filter(c => heartState[c.id]).length;

    const totalHeartPieces = pieces.length;
    
    // Link starts with 3 hearts.
    const totalHearts = 3 + foundContainersCount + Math.floor(foundPiecesCount / 4);
    const remainingPieces = foundPiecesCount % 4;

    if (dom.heartPieceCounter) {
        dom.heartPieceCounter.textContent = `${foundPiecesCount}/${totalHeartPieces}`;
    }
    if (dom.heartContainerCounter) {
        dom.heartContainerCounter.textContent = totalHearts;
    }
    
    if (dom.heartPiecePreview) {
        switch (remainingPieces) {
            case 0:
                dom.heartPiecePreview.src = 'images/empty_heart.png';
                break;
            case 1:
                dom.heartPiecePreview.src = 'images/quarter_heart.png';
                break;
            case 2:
                dom.heartPiecePreview.src = 'images/half_heart.png';
                break;
            case 3:
                dom.heartPiecePreview.src = 'images/threefour_heart.png';
                break;
        }
    }
    renderLinkHearts(totalHearts);
}

/**
 * Renders Link's life meter.
 * Displays hearts in two rows of 10, only showing hearts Link has.
 * @param {number} totalHearts - The total number of heart containers Link has.
 */
function renderLinkHearts(totalHearts) {
    const container = dom.linkHeartsContainer;
    if (!container) return;
    container.innerHTML = '';

    const maxHeartsPerRow = 10;

    // Create first row
    const row1 = document.createElement('div');
    row1.className = 'heart-row';
    container.appendChild(row1);

    for (let i = 0; i < Math.min(totalHearts, maxHeartsPerRow); i++) {
        const heart = document.createElement('div');
        heart.className = 'link-heart full';
        row1.appendChild(heart);
    }

    if (totalHearts > maxHeartsPerRow) {
        // Create second row only if needed
        const row2 = document.createElement('div');
        row2.className = 'heart-row';
        container.appendChild(row2);

        for (let i = maxHeartsPerRow; i < totalHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'link-heart full';
            row2.appendChild(heart);
        }
    }
}


function setVersion(version, triggerHaptics = false) {
    if (triggerHaptics) {
        ui.triggerHapticFeedback();
    }
    currentVersion = version;
    if (dom.versionToggle3dsHearts) {
        dom.versionToggle3dsHearts.classList.toggle('active', version === '3ds');
    }
    if (dom.versionToggleN64Hearts) {
        dom.versionToggleN64Hearts.classList.toggle('active', version === 'n64');
    }
    render();
}

export async function populateHeartsView() {
    if (!dom.heartContainersContent || !dom.versionToggle3dsHearts || !dom.versionToggleN64Hearts) {
        console.error("Heart view elements not found");
        return;
    }
    
    await loadHeartData();
    loadState();

    dom.versionToggle3dsHearts.addEventListener('click', () => setVersion('3ds', true));
    dom.versionToggleN64Hearts.addEventListener('click', () => setVersion('n64', true));

    setVersion('n64'); // Default to N64, no haptics on initial load
}
