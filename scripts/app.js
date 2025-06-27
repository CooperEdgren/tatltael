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
    // Ensure these functions exist in their respective files or comment them out.
    if(songView.populateSongGrid) songView.populateSongGrid();
    if(mapsView.populateMapsGrid) mapsView.populateMapsGrid();
    if(notebookView.populateBombersNotebook) notebookView.populateBombersNotebook();
    if(audio.initializeAudio) audio.initializeAudio();

    // --- EVENT LISTENERS ---

    // Song View Listeners
    dom.backButton.addEventListener('click', songView.showSongSelection);
    dom.instrumentImage.addEventListener('click', songView.handleInstrumentClick);
    
    // Controller Modal Listeners
    dom.controllerModalClose.addEventListener('click', songView.closeControllerModal);
    dom.controllerModal.addEventListener('click', (e) => {
        // Close modal if the overlay is clicked, but not the content inside
        if (e.target === dom.controllerModal) {
            songView.closeControllerModal();
        }
    });

    // Maps View Listeners
    dom.tingleContainer.addEventListener('click', mapsView.showMapsView);
    dom.mapsBackButton.addEventListener('click', songView.showSongSelection);
    if(mapsView.closeMapModal) {
        dom.mapModalClose.addEventListener('click', mapsView.closeMapModal);
        dom.mapModal.addEventListener('click', (e) => {
            if (e.target === dom.mapModal) {
                mapsView.closeMapModal();
            }
        });
    }

    // Notebook View Listeners
    if(notebookView.showBombersNotebook) {
        dom.bombersNotebookIconContainer.addEventListener('click', notebookView.showBombersNotebook);
    }
    dom.bombersBackButton.addEventListener('click', songView.showSongSelection);
    if(notebookView.saveBomberCode) {
        dom.bomberCodeInput.addEventListener('input', notebookView.saveBomberCode);
    }

    // General UI Listeners
    dom.toggleUiButton.addEventListener('click', ui.toggleControlsVisibility);
    document.addEventListener('mousemove', ui.resetHideUiTimeout);
    document.addEventListener('keydown', ui.resetHideUiTimeout);
    document.addEventListener('click', ui.resetHideUiTimeout);

    // --- INITIAL STATE ---
    ui.switchView(dom.songSelectionView);
}

// Run the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);
