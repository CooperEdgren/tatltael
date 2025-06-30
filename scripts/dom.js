// --- Main Views / Screens ---
export const mainScreen = document.getElementById('main-screen');
export const songDetailView = document.getElementById('song-detail-view');
export const mapsView = document.getElementById('maps-view'); // Tingle's maps
export const terminaMapView = document.getElementById('termina-map-view'); // Full Termina map

// --- Main Nav Elements ---
export const mainNavContainer = document.getElementById('main-nav-container');
export const mainTitleButton = document.getElementById('main-title-button');
export const navPill = document.getElementById('nav-pill');
// This is now a function to ensure it's always up-to-date if nav items are ever changed dynamically.
export const getNavItems = () => [...document.querySelectorAll('.nav-item')];

// --- Fairy Elements ---
export const fairyContainer = document.getElementById('fairy-container');
export const tatlFairy = document.getElementById('tatl-fairy');
export const taelFairy = document.getElementById('tael-fairy');

// --- Main Content Containers ---
export const songsContent = document.getElementById('song-grid-content');
export const notebookContent = document.getElementById('notebook-content');
export const itemsContent = document.getElementById('items-content');
export const fairiesContent = document.getElementById('fairies-content');
export const heartContainersContent = document.getElementById('heart-containers-content');
export const allMainContentTypes = [songsContent, notebookContent, itemsContent, fairiesContent, heartContainersContent];

// --- Song Selection / Detail Elements ---
export const songGrid = document.getElementById('song-grid');
export const songTitleEl = document.getElementById('song-title');
export const youtubePlayer = document.getElementById('youtube-player');
export const notesContainer = document.getElementById('notes-container');
export const backButton = document.getElementById('back-button');
export const instrumentImage = document.getElementById('instrument-image');

// --- Main UI / Corner & Background Icons ---
export const tingleContainer = document.getElementById('tingle-container');
export const toggleUiButton = document.getElementById('toggle-ui-button');
export const iconEyeOpen = document.getElementById('icon-eye-open');
export const iconEyeClosed = document.getElementById('icon-eye-closed');

// --- Tingle's Maps Elements ---
export const mapGrid = document.getElementById('map-grid');
export const mapsBackButton = document.getElementById('maps-back-button');
export const mapModal = document.getElementById('map-modal');
export const mapModalImage = document.getElementById('map-modal-image');
export const mapModalClose = document.getElementById('map-modal-close');
export const mapModalTitle = document.getElementById('map-modal-title');
export const mapModalPrev = document.getElementById('map-modal-prev');
export const mapModalNext = document.getElementById('map-modal-next');

// --- Termina Map Elements ---
export const terminaMapBackButton = document.getElementById('termina-map-back-button');



// --- New Bomber's Notebook Elements ---
export const questListContainer = document.getElementById('quest-list-container');
export const notebookDetailContainer = document.getElementById('notebook-detail-container');
export const notebookPlaceholderView = document.getElementById('notebook-placeholder-view');
export const questDetailView = document.getElementById('quest-detail-view');
export const questTitle = document.getElementById('quest-title');
export const questRegion = document.getElementById('quest-region');
export const questStepsList = document.getElementById('quest-steps-list');
export const questRewardsList = document.getElementById('quest-rewards-list');
export const bomberCodeInput = document.getElementById('bomber-code-input');

// --- Stray Fairy Tracker Elements ---
export const fairyTempleTabs = document.getElementById('fairy-temple-tabs');
export const fairyChecklistContainer = document.getElementById('fairy-checklist-container');
export const versionToggle3DS = document.getElementById('version-toggle-3ds');
export const versionToggleN64 = document.getElementById('version-toggle-n64');


// --- Controller Modal Elements ---
export const controllerModal = document.getElementById('controller-modal');
export const controllerModalImage = document.getElementById('controller-modal-image');
export const controllerModalClose = document.getElementById('controller-modal-close');

// --- Settings Menu Elements ---
export const settingsContainer = document.getElementById('settings-container');
export const settingsButton = document.getElementById('settings-button');
export const settingsMenu = document.getElementById('settings-menu');
export const volumeSlider = document.getElementById('volume-slider');
export const muteToggle = document.getElementById('mute-toggle');
export const iconVolumeOn = document.getElementById('icon-volume-on');
export const iconVolumeOff = document.getElementById('icon-volume-off');
export const appIconOptions = document.getElementById('app-icon-options');

// --- Item Detail Modal ---
export const itemDetailModal = document.getElementById('item-detail-modal');

// --- Item View Elements ---
export const itemGrid = document.getElementById('item-grid');
export const itemCategoryTabs = document.getElementById('item-category-tabs');
export const itemSearchInput = document.getElementById('item-search-input');
export const itemDetailView = document.getElementById('item-detail-view');
export const itemDetailTitle = document.getElementById('item-detail-title');
export const itemDetailImage = document.getElementById('item-detail-image');
export const itemDetailDescription = document.getElementById('item-detail-description');
export const itemDetailAcquisition = document.getElementById('item-detail-acquisition');
export const itemDetailBackButton = document.getElementById('item-detail-back-button');


// --- Audio Elements ---
export const backgroundAudio = document.getElementById('background-audio');
