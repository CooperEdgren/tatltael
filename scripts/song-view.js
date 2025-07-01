import * as data from './data.js';
import * as dom from './dom.js';
import * as ui from './ui.js';
import { fadeAudio } from './audio.js';

let lastClickedButtonRect = null;
let currentImageIndex = 0;

/**
 * Shows the modal with the full controller image for a given platform.
 * @param {string} platformKey - The key for the platform (e.g., 'n64', 'ps').
 */
function showControllerModal(platformKey) {
    const platform = data.platforms[platformKey];
    if (!platform || !platform.controller) return;
    dom.controllerModalImage.src = platform.controller;
    dom.controllerModalImage.alt = `${platform.name} Controller Layout`;
    dom.controllerModal.classList.add('is-visible');
}

/**
 * Hides the controller image modal.
 */
export function closeControllerModal() {
    dom.controllerModal.classList.remove('is-visible');
}


/**
 * Creates the HTML element for a single note icon.
 * @param {string} note - The note identifier (e.g., 'CU', 'A').
 * @param {string} platformKey - The platform identifier (e.g., 'n64', 'ps').
 * @returns {HTMLElement} The note icon element.
 */
const createNoteElement = (note, platformKey) => {
    const mapping = data.noteMappings[platformKey]?.[note];
    if (!mapping) return null;
    const div = document.createElement('div');
    div.className = `note-icon ${mapping.class}`;
    div.innerHTML = `<img src="${mapping.icon}" alt="${note} button" draggable="false">`;
    div.addEventListener('click', () => {
        ui.triggerHapticFeedback();
        showControllerModal(platformKey);
    });
    return div;
};

/**
 * Generates the complete HTML for a platform's note display.
 * @param {string} platformKey - The platform identifier (e.g., 'n64').
 * @param {string[]} songNotes - An array of note identifiers.
 * @returns {HTMLElement} The complete section element.
 */
const generateNotesSection = (platformKey, songNotes) => {
    const platform = data.platforms[platformKey];
    if (!platform) return null;
    const sectionDiv = document.createElement('div');
    const logoImg = document.createElement('img');
    logoImg.src = platform.logo;
    logoImg.alt = `${platform.name} Logo`;
    logoImg.className = 'platform-logo';
    sectionDiv.appendChild(logoImg);
    const notesWrapper = document.createElement('div');
    notesWrapper.className = 'flex flex-wrap items-center bg-black/40 p-3 rounded-lg min-h-[72px] shadow-inner';
    songNotes.forEach(note => {
        const noteEl = createNoteElement(note, platformKey);
        if (noteEl) notesWrapper.appendChild(noteEl);
    });
    sectionDiv.appendChild(notesWrapper);
    return sectionDiv;
};

/**
 * Displays the song detail view for a given song.
 * @param {string} songKey - The key of the song in the data object.
 */
const showSongDetails = (songKey) => {
    const song = data.songs[songKey];
    if (!song || !lastClickedButtonRect) return;

    fadeAudio(0);
    dom.songTitleEl.innerHTML = `${song.name}<span class="hylian-name">${song.hylian_name || ''}</span>`;

    const getYouTubeID = (url) => { try { return new URL(url).searchParams.get('v'); } catch (e) { console.error('Invalid YouTube URL:', url); return null; } };
    const videoId = getYouTubeID(song.url);
    dom.youtubePlayer.src = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}` : '';

    dom.notesContainer.innerHTML = '';
    Object.keys(data.platforms).forEach(platformKey => {
        const sectionEl = generateNotesSection(platformKey, song.n64);
        if(sectionEl) dom.notesContainer.appendChild(sectionEl);
    });
    
    currentImageIndex = 0;
    dom.instrumentImage.src = data.instrumentImages[currentImageIndex];

    const startTransform = ui.getAnimationTransforms(lastClickedButtonRect);
    dom.songDetailView.style.transform = startTransform;
    dom.songDetailView.style.transformOrigin = 'center';

    ui.switchView(dom.songDetailView);

    requestAnimationFrame(() => {
        dom.songDetailView.style.transform = 'translate(0, 0) scale(1)';
    });
};

/**
 * Populates the main grid with song buttons.
 */
export function populateSongGrid() {
    dom.songGrid.innerHTML = '';
    Object.keys(data.songs).forEach((key) => {
        const song = data.songs[key];
        const button = document.createElement('button');
        button.className = 'btn-song text-xl p-6 font-zelda';
        button.textContent = song.name;
        button.addEventListener('click', (event) => {
            ui.triggerHapticFeedback();
            lastClickedButtonRect = event.currentTarget.getBoundingClientRect();
            showSongDetails(key);
        });
        dom.songGrid.appendChild(button);
    });
}

/**
 * Reveals the song grid with a cascading animation.
 */
export function showSongGridWithAnimation() {
    const buttons = [...dom.songGrid.querySelectorAll('.btn-song')];
    buttons.forEach(button => button.classList.remove('animate-fadeInUp'));
    
    buttons.forEach((button, index) => {
        button.style.animationDelay = `${index * 70}ms`;
        button.classList.add('animate-fadeInUp');
    });
}

/**
 * Returns to the main screen from a detail view.
 */
export function showMainScreen() {
    fadeAudio(0.5);
    dom.youtubePlayer.src = 'about:blank';
    
    if (lastClickedButtonRect) {
        const endTransform = ui.getAnimationTransforms(lastClickedButtonRect);
        dom.songDetailView.style.transform = endTransform;
    }
    
    // Switch the view back to the main screen
    ui.switchView(dom.mainScreen);
}

/**
 * Cycles through the instrument images when clicked.
 */
export function handleInstrumentClick() {
    ui.triggerHapticFeedback();
    currentImageIndex = (currentImageIndex + 1) % data.instrumentImages.length;
    dom.instrumentImage.src = data.instrumentImages[currentImageIndex];
}
