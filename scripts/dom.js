// --- Main Views / Screens ---
export const mainScreen = document.getElementById('main-screen');
export const songDetailView = document.getElementById('song-detail-view');
export const mapsView = document.getElementById('maps-view');

// --- Main Nav Elements ---
export const mainTitleButton = document.getElementById('main-title-button');
export const navPill = document.getElementById('nav-pill');
export const navItems = [...document.querySelectorAll('.nav-item')]; // Get all nav items

// --- Main Content Containers ---
export const songsContent = document.getElementById('song-grid-content');
export const notebookContent = document.getElementById('notebook-content');
export const itemsContent = document.getElementById('items-content');
export const masksContent = document.getElementById('masks-content');
export const allMainContentTypes = [songsContent, notebookContent, itemsContent, masksContent];

// --- Song Selection / Detail Elements ---
export const songGrid = document.getElementById('song-grid');
export const songTitleEl = document.getElementById('song-title');
export const youtubePlayer = document.getElementById('youtube-player');
export const notesContainer = document.getElementById('notes-container');
export const backButton = document.getElementById('back-button');
export const instrumentImage = document.getElementById('instrument-image');

// --- Main UI / Corner Icons ---
export const tingleContainer = document.getElementById('tingle-container');
export const toggleUiButton = document.getElementById('toggle-ui-button');
export const iconEyeOpen = document.getElementById('icon-eye-open');
export const iconEyeClosed = document.getElementById('icon-eye-closed');

// --- Maps Elements ---
export const mapGrid = document.getElementById('map-grid');
export const mapsBackButton = document.getElementById('maps-back-button');
export const mapModal = document.getElementById('map-modal');
export const mapModalImage = document.getElementById('map-modal-image');
export const mapModalClose = document.getElementById('map-modal-close');

// --- Bomber's Notebook Elements ---
export const bomberCodeInput = document.getElementById('bomber-code-input');
export const bomberCodeSavedMessage = document.getElementById('bomber-code-saved-message');
export const notebookCharacters = document.getElementById('notebook-characters');
export const notebookTimeline = document.getElementById('notebook-timeline');
export const detailsCharImg = document.getElementById('details-char-img');
export const detailsCharName = document.getElementById('details-char-name');
export const detailsCharDesc = document.getElementById('details-char-desc');

// --- Controller Modal Elements ---
export const controllerModal = document.getElementById('controller-modal');
export const controllerModalImage = document.getElementById('controller-modal-image');
export const controllerModalClose = document.getElementById('controller-modal-close');

// --- Other ---
export const backgroundAudio = document.getElementById('background-audio');
