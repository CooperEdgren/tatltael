import * as data from './data.js';
import * as dom from './dom.js';
import * as ui from './ui.js';
import { fadeAudio } from './audio.js';

let lastClickedButtonRect = null;
let currentImageIndex = 0;

/**
 * Creates the HTML for a single note icon.
 * @param {string} note - The note identifier (e.g., 'CU', 'A').
 * @param {string} platform - The platform identifier (e.g., 'n64', 'ps5').
 * @returns {string} The HTML string for the note icon.
 */
const createNoteHTML = (note, platform) => {
    const mapping = data.noteMappings[platform]?.[note];
    return mapping ? `<div class="note-icon ${mapping.class}">${mapping.html}</div>` : '';
};

/**
 * Generates the complete HTML for a platform's note display.
 * @param {string} title - The title for the section (e.g., 'Nintendo 64').
 * @param {string} platform - The platform identifier.
 * @param {string[]} songNotes - An array of note identifiers.
 * @returns {string} The complete HTML section.
 */
const generateNotesSection = (title, platform, songNotes) => {
    const notesHTML = songNotes.map(note => createNoteHTML(note, platform)).join('');
    return `<div><h3 class="text-2xl font-bold mb-3 text-purple-200 tracking-wide font-zelda">${title}</h3><div class="flex flex-wrap items-center bg-black/40 p-3 rounded-lg min-h-[72px] shadow-inner">${notesHTML}</div></div>`;
};

/**
 * Displays the song detail view for a given song.
 * @param {string} songKey - The key of the song in the data object.
 */
const showSongDetails = (songKey) => {
    const song = data.songs[songKey];
    if (!song || !lastClickedButtonRect) return;

    fadeAudio(0);

    dom.songTitleEl.textContent = song.name;
    const getYouTubeID = (url) => { try { return new URL(url).searchParams.get('v'); } catch (e) { console.error('Invalid YouTube URL:', url); return null; } };
    const videoId = getYouTubeID(song.url);
    dom.youtubePlayer.src = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}` : '';

    dom.notesContainer.innerHTML = `
        ${generateNotesSection('PlayStation', 'ps5', song.n64)}
        ${generateNotesSection('Nintendo 64', 'n64', song.n64)}
        ${generateNotesSection('Nintendo 3DS', 'ds', song.n64)}
    `;
    
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

    const fromNotebook = document.querySelector('.view-container.is-active') === dom.bombersNotebookView;
    if (fromNotebook) {
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
