import * as dom from './dom.js';
import * as audio from './audio.js';
import * as ui from './ui.js';
import * as songView from './song-view.js';
import * as mapsView from './maps-view.js';
import * as notebookView from './notebook-view.js';

/**
 * Main application initialization function.
 */
function main() {
    // --- INITIAL POPULATION ---
    songView.populateSongGrid();
    mapsView.populateMapsGrid();
    notebookView.populateBombersNotebook();
    audio.initializeAudio();

    // --- EVENT LISTENERS ---

    // Main Nav listeners
    dom.mainTitleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the body click listener from firing immediately
        ui.toggleMainNav();
    });
    
    dom.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = item.dataset.content;
            ui.showContentForNav(content);
            // We can choose to close the nav automatically after a selection
            if (ui.isNavOpen()) {
                ui.toggleMainNav();
            }
        });
    });

    // Song Detail View Listeners
    dom.backButton.addEventListener('click', songView.showMainScreen);
    dom.instrumentImage.addEventListener('click', songView.handleInstrumentClick);
    
    // Controller Modal Listeners
    dom.controllerModalClose.addEventListener('click', songView.closeControllerModal);
    dom.controllerModal.addEventListener('click', (e) => {
        if (e.target === dom.controllerModal) {
            songView.closeControllerModal();
        }
    });

    // Maps View Listeners
    dom.tingleContainer.addEventListener('click', mapsView.showMapsView);
    dom.mapsBackButton.addEventListener('click', songView.showMainScreen);
    dom.mapModalClose.addEventListener('click', mapsView.closeMapModal);
    dom.mapModal.addEventListener('click', (e) => {
        if (e.target === dom.mapModal) {
            mapsView.closeMapModal();
        }
    });
    
    // Moon click listener
    dom.moonImage.addEventListener('click', () => {
        // Opens a YouTube playlist in a new tab
        window.open('https://youtube.com/playlist?list=PLF41D831CF4427BE5&si=fl3Yuo2SQiO8CFny', '_blank');
    });


    // Bomber's Notebook Listener
    dom.bomberCodeInput.addEventListener('input', notebookView.saveBomberCode);

    // General UI Listeners
    dom.toggleUiButton.addEventListener('click', ui.toggleControlsVisibility);
    document.addEventListener('mousemove', ui.resetHideUiTimeout);
    document.addEventListener('keydown', ui.resetHideUiTimeout);
    document.addEventListener('click', ui.resetHideUiTimeout);

    // --- INITIAL STATE ---
    ui.switchView(dom.mainScreen);

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}

// Run the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);
