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
    if(songView.populateSongGrid) songView.populateSongGrid();
    if(mapsView.populateMapsGrid) mapsView.populateMapsGrid();
    if(notebookView.populateBombersNotebook) notebookView.populateBombersNotebook();
    if(audio.initializeAudio) audio.initializeAudio();

    // --- EVENT LISTENERS ---

    // Main Nav listeners
    dom.mainTitleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the body click listener from firing immediately
        ui.toggleMainNav();
    });
    
    // Simplified nav item click listener
    dom.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = item.dataset.content;
            // Let ui.js handle the logic of showing content and managing the active state
            ui.showContentForNav(content);
            // Close the nav pill after a selection is made or toggled
            ui.toggleMainNav();
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
    if(mapsView.closeMapModal) {
        dom.mapModalClose.addEventListener('click', mapsView.closeMapModal);
        dom.mapModal.addEventListener('click', (e) => {
            if (e.target === dom.mapModal) {
                mapsView.closeMapModal();
            }
        });
    }

    // Bomber's Notebook Listener
    if(notebookView.saveBomberCode) {
        dom.bomberCodeInput.addEventListener('input', notebookView.saveBomberCode);
    }

    // General UI Listeners
    dom.toggleUiButton.addEventListener('click', ui.toggleControlsVisibility);
    document.addEventListener('mousemove', ui.resetHideUiTimeout);
    document.addEventListener('keydown', ui.resetHideUiTimeout);
    document.addEventListener('click', ui.resetHideUiTimeout);

    // --- INITIAL STATE ---
    ui.switchView(dom.mainScreen);
}

// Run the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);
