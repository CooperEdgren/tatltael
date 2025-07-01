import { heartData } from './data-hearts.js';
import * as dom from './dom.js';

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

    // Render Heart Pieces
    const piecesTitle = document.createElement('h3');
    piecesTitle.className = 'heart-section-title';
    piecesTitle.textContent = 'Heart Pieces';
    container.appendChild(piecesTitle);
    
    const piecesToRender = data.pieces;
    piecesToRender.forEach(piece => {
        const isFound = heartState[piece.id] || false;
        const item = document.createElement('div');
        item.className = `heart-checklist-item ${isFound ? 'found' : ''}`;
        item.dataset.id = piece.id;
        item.innerHTML = `
            <div class="checkbox"></div>
            <div class="description">
                <span class="location">${piece.location}</span>
                <p>${piece.description}</p>
            </div>
        `;
        item.addEventListener('click', () => toggleItem(piece.id));
        container.appendChild(item);
    });
    updateCounters();
}

function toggleItem(id) {
    heartState[id] = !heartState[id];
    saveState();
    renderHeartPieces();
}

function updateCounters() {
    const pieces = heartData[currentVersion].pieces;
    const containers = heartData[currentVersion].containers;

    const foundPiecesCount = pieces.filter(p => heartState[p.id]).length;
    const foundContainersCount = containers.filter(c => heartState[c.id]).length;

    const totalHeartPieces = pieces.length;
    
    const totalHearts = 3 + foundContainersCount + Math.floor(foundPiecesCount / 4);
    const remainingPieces = foundPiecesCount % 4;

    if (dom.heartPieceCounter) {
        dom.heartPieceCounter.textContent = `${foundPiecesCount}/${totalHeartPieces}`;
    }
    if (dom.heartContainerCounter) {
        dom.heartContainerCounter.textContent = totalHearts;
    }
    if (dom.heartPieceGraphic) {
        dom.heartPieceGraphic.className = `heart-piece-graphic pieces-${remainingPieces}`;
    }
    renderLinkHearts(totalHearts);
}

let linkHeartsContainer;

function renderLinkHearts(totalHearts) {
    if (!linkHeartsContainer) return;
    linkHeartsContainer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'link-heart';
        if (i < totalHearts) {
            heart.classList.add('full');
        }
        linkHeartsContainer.appendChild(heart);
    }
}

function setVersion(version) {
    currentVersion = version;
    dom.versionToggle3dsHearts.classList.toggle('active', version === '3ds');
    dom.versionToggleN64Hearts.classList.toggle('active', version === 'n64');
    renderHeartPieces();
}

export function populateHeartsView() {
    if (!dom.heartContainersContent) return;
    
    loadState();

    dom.versionToggle3dsHearts.addEventListener('click', () => setVersion('3ds'));
    dom.versionToggleN64Hearts.addEventListener('click', () => setVersion('n64'));

    // Add the container for Link's hearts to the DOM
    const heartsDisplay = document.createElement('div');
    heartsDisplay.id = 'link-hearts-container';
    heartsDisplay.className = 'link-hearts-container';
    dom.heartContainersContent.querySelector('.main-container > header').after(heartsDisplay);
    linkHeartsContainer = heartsDisplay;


    setVersion('n64'); // Default to N64
}
