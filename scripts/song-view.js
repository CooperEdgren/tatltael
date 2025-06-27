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

    // Set the image source and alt text for the modal
    dom.controllerModalImage.src = platform.controller;
    dom.controllerModalImage.alt = `${platform.name} Controller Layout`;
    dom.controllerModal.classList.add('is-visible');
}

/**
 * Hides the controller image modal.
 * This is exported so app.js can use it for event listeners.
 */
export function closeControllerModal() {
    dom.controllerModal.classList.remove('is-visible');
}


/**
 * Creates the HTML element for a single note icon, including its click event.
 * @param {string} note - The note identifier (e.g., 'CU', 'A').
 * @param {string} platformKey - The platform identifier (e.g., 'n64', 'ps').
 * @returns {HTMLElement} The note icon element.
 */
const createNoteElement = (note, platformKey) => {
    const mapping = data.noteMappings[platformKey]?.[note];
    if (!mapping) return null;

    // Create the div wrapper for the icon
    const div = document.createElement('div');
    div.className = `note-icon ${mapping.class}`;
    
    // Create the image element for the button SVG
    div.innerHTML = `<img src="${mapping.icon}" alt="${note} button" draggable="false">`;

    // Add a click listener to show the corresponding controller
    div.addEventListener('click', () => showControllerModal(platformKey));
    
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
    
    // Create the logo image
    const logoImg = document.createElement('img');
    logoImg.src = platform.logo;
    logoImg.alt = `${platform.name} Logo`;
    logoImg.className = 'platform-logo';
    sectionDiv.appendChild(logoImg);

    // Create the container for the notes
    const notesWrapper = document.createElement('div');
    notesWrapper.className = 'flex flex-wrap items-center bg-black/40 p-3 rounded-lg min-h-[72px] shadow-inner';
    
    // Create and append each note element
    songNotes.forEach(note => {
        const noteEl = createNoteElement(note, platformKey);
        if (noteEl) {
            notesWrapper.appendChild(noteEl);
        }
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

    // Set song title
    dom.songTitleEl.textContent = song.name;

    // Set YouTube video
    const getYouTubeID = (url) => { try { return new URL(url).searchParams.get('v'); } catch (e) { console.error('Invalid YouTube URL:', url); return null; } };
    const videoId = getYouTubeID(song.url);
    dom.youtubePlayer.src = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}` : '';

    // Clear previous notes and dynamically generate new ones for all platforms
    dom.notesContainer.innerHTML = '';
    Object.keys(data.platforms).forEach(platformKey => {
        const sectionEl = generateNotesSection(platformKey, song.n64); // song.n64 is the base for all conversions
        if(sectionEl) {
            dom.notesContainer.appendChild(sectionEl);
        }
    });
    
    // Reset instrument image
    currentImageIndex = 0;
    dom.instrumentImage.src = data.instrumentImages[currentImageIndex];

    // Animate the view transition
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
    Object.keys(data.songs).forEach((key, index) => {
        const song = data.songs[key];
        const button = document.createElement('button');
        button.className = 'btn-song text-xl p-6 font-zelda';
        button.textContent = song.name;
        button.style.animationDelay = `${index * 60}ms`;
        button.addEventListener('click', (event) => {
            lastClickedButtonRect = event.currentTarget.getBoundingClientRect();
            showSongDetails(key);
        });
        dom.songGrid.appendChild(button);
    });
}

/**
 * Returns to the main song selection view.
 */
export function showSongSelection() {
    fadeAudio(0.5);
    dom.youtubePlayer.src = 'about:blank';
    
    if (lastClickedButtonRect) {
        const endTransform = ui.getAnimationTransforms(lastClickedButtonRect);
        dom.songDetailView.style.transform = endTransform;
    }

    const activeView = document.querySelector('.view-container.is-active');
    const fromNotebook = activeView === dom.bombersNotebookView;
    const fromMaps = activeView === dom.mapsView;
    
    // Use a slight delay when coming back from other full-screen views
    // to ensure the animation is smooth.
    if (fromNotebook || fromMaps) {
        setTimeout(() => ui.switchView(dom.songSelectionView), 50);
    } else {
        ui.switchView(dom.songSelectionView);
    }
}

/**
 * Cycles through the instrument images when clicked.
 */
export function handleInstrumentClick() {
    currentImageIndex = (currentImageIndex + 1) % data.instrumentImages.length;
    dom.instrumentImage.src = data.instrumentImages[currentImageIndex];
}
