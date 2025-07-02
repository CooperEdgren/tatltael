import * as dom from './dom.js';
import * as audio from './audio.js';
import * as ui from './ui.js';
import * as songView from './song-view.js';
import * as mapsView from './maps-view.js';
import * as notebookView from './notebook-view.js';
import * as itemsView from './items-view.js';
import * as fairiesView from './fairies-view.js';
import * as heartsView from './hearts-view.js';

/**
 * Main application initialization function.
 */
function main() {
    // --- INITIAL POPULATION ---
    songView.populateSongGrid();
    mapsView.populateMapsGrid();
    notebookView.populateBombersNotebook();
    itemsView.populateItemsView();
    fairiesView.populateFairiesView();
    heartsView.populateHeartsView();
    audio.initializeAudio();
    ui.initializeSettings();
    ui.loadSavedIcon();

    // --- EVENT LISTENERS ---

    // Main Nav listeners
    dom.mainTitleButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        e.stopPropagation(); // Prevent the body click listener from firing immediately
        ui.toggleMainNav();
    });
    
    dom.getNavItems().forEach(item => {
        item.addEventListener('click', (e) => {
            ui.triggerHapticFeedback();
            ui.addTapFeedback(e.currentTarget);
            e.stopPropagation();
            const content = item.dataset.content;

            // Handle switching views based on nav item clicked
            if (content === 'termina') {
                // Special case for the full-screen Termina map, which is a separate view
                ui.switchView(dom.terminaMapView);
                // FIX: Close nav automatically ONLY when switching to a full-screen view
                if (ui.getNavState()) {
                    ui.toggleMainNav();
                }
            } else {
                // For content inside the main screen, just show it.
                // The nav will remain open for easy switching between content panels.
                ui.showContentForNav(content);
            }
        });
    });

    // Song Detail View Listeners
    dom.backButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.showMainScreen();
    });
    dom.instrumentImage.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.handleInstrumentClick();
    });

    // Item Detail View Listeners
    dom.itemDetailBackButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.showMainScreen();
    });
    
    // Controller Modal Listeners
    dom.controllerModalClose.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.closeControllerModal();
    });
    dom.controllerModal.addEventListener('click', (e) => {
        if (e.target === dom.controllerModal) {
            ui.triggerHapticFeedback();
            songView.closeControllerModal();
        }
    });

    // Tingle's Maps View Listeners
    dom.tingleContainer.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        mapsView.showMapsView();
    });
    dom.mapsBackButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.showMainScreen();
    });
    dom.mapModalClose.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        mapsView.closeMapModal();
    });
    dom.mapModal.addEventListener('click', (e) => {
        if (e.target === dom.mapModal) {
            ui.triggerHapticFeedback();
            mapsView.closeMapModal();
        }
    });

    // Termina Map View Listener
    dom.terminaMapBackButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.showMainScreen();
    });

    dom.characterDetailBackButton.addEventListener('click', (e) => {
        ui.triggerHapticFeedback();
        ui.addTapFeedback(e.currentTarget);
        songView.showMainScreen();
    });
    
    // General UI Listeners
    dom.toggleUiButton.addEventListener('click', (e) => {
        ui.addTapFeedback(e.currentTarget);
        ui.toggleControlsVisibility();
    });
    document.addEventListener('mousemove', ui.resetHideUiTimeout);
    document.addEventListener('keydown', ui.resetHideUiTimeout);
    document.addEventListener('click', ui.resetHideUiTimeout);

    // --- INITIAL STATE ---
    ui.switchView(dom.mainScreen);

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/scripts/service-worker.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}

// Run the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);
