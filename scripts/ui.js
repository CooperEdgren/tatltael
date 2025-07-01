import * as dom from './dom.js';
import { playNavOpenSound, playNavCloseSound, setVolume, toggleMute } from './audio.js';

let hideUiTimeout;
let activeContent = null;
let isNavOpen = false;
let isSettingsMenuOpen = false;
let exploreInterval = null;

/**
 * Triggers haptic feedback on supported devices.
 * @param {number} [duration=50] - The vibration duration in milliseconds.
 */
export function triggerHapticFeedback(duration = 50) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

/**
 * Provides the current state of the navigation pill.
 * @returns {boolean} - True if the nav is open.
 */
export function getNavState() {
    return isNavOpen;
}

/**
 * Toggles the visibility of the main navigation pill and its associated states.
 */
export function toggleMainNav() {
    triggerHapticFeedback(30);
    isNavOpen = !isNavOpen;

    if (isNavOpen) {
        playNavOpenSound();
    } else {
        playNavCloseSound();
        if (isSettingsMenuOpen) {
            toggleSettingsMenu(); // Close settings if nav is closing
        }
    }

    dom.mainTitleButton.classList.toggle('nav-active', isNavOpen);
    dom.navPill.classList.toggle('is-visible', isNavOpen);
    dom.mainNavContainer.classList.toggle('nav-is-open', isNavOpen);
    
    updateTingleVisibility();

    if (isNavOpen) {
        setTimeout(() => document.body.addEventListener('click', closeNavOnClickOutside), 0);
    } else {
        document.body.removeEventListener('click', closeNavOnClickOutside);
    }
}

/**
 * Toggles the visibility of the settings menu.
 */
function toggleSettingsMenu() {
    triggerHapticFeedback(30);
    isSettingsMenuOpen = !isSettingsMenuOpen;
    dom.settingsMenu.classList.toggle('is-active', isSettingsMenuOpen);
}

/**
 * Initializes the settings menu event listeners.
 */
export function initializeSettings() {
    dom.settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettingsMenu();
    });

    dom.volumeSlider.addEventListener('input', (e) => {
        setVolume(e.target.value);
    });

    // Add touch events for mobile
    dom.volumeSlider.addEventListener('touchstart', (e) => {
        setVolume(e.target.value);
    });
    dom.volumeSlider.addEventListener('touchmove', (e) => {
        setVolume(e.target.value);
    });

    dom.muteToggle.addEventListener('click', () => {
        triggerHapticFeedback();
        const isMuted = toggleMute();
        dom.iconVolumeOn.classList.toggle('hidden', isMuted);
        dom.iconVolumeOff.classList.toggle('hidden', !isMuted);
        if (isMuted) {
            dom.volumeSlider.disabled = true;
        } else {
            dom.volumeSlider.disabled = false;
        }
    });

    dom.appIconOptions.addEventListener('click', (e) => {
        const button = e.target.closest('.app-icon-option');
        if (!button) return;
        
        triggerHapticFeedback();
        const iconName = button.dataset.icon;
        // Here you would implement the logic to change the app icon
        // This might involve updating the manifest.json or link tags
        console.log(`Selected app icon: ${iconName}`);

        // Update active state
        dom.appIconOptions.querySelectorAll('.app-icon-option').forEach(opt => opt.classList.remove('active'));
        button.classList.add('active');
    });

    // Set initial state
    dom.volumeSlider.value = 0.5;
    dom.appIconOptions.querySelector('[data-icon="default"]').classList.add('active');
}


/**
 * Closes the navigation if a click occurs outside of the nav container.
 * @param {MouseEvent} event
 */
function closeNavOnClickOutside(event) {
    if (!dom.mainNavContainer.contains(event.target) && event.target !== dom.mainTitleButton) {
        if (isNavOpen) {
            toggleMainNav();
        }
    }
}

/**
 * Shows a specific section of content linked to a nav item.
 * @param {string} newContent - The 'data-content' attribute value of the clicked nav item.
 */
export async function showContentForNav(newContent) {
    triggerHapticFeedback();
    const newActiveItem = document.querySelector(`.nav-item[data-content="${newContent}"]`);

    if (newContent === activeContent) {
        hideAllContent();
        activeContent = null;
    } else {
        hideAllContent();
        activeContent = newContent;

        if (newActiveItem) {
            newActiveItem.classList.add('active');
        }

        let contentToShow;
        if (dom.loadingIndicator) {
            dom.loadingIndicator.classList.remove('hidden');
        }

        try {
            switch (newContent) {
                case 'songs':
                    contentToShow = dom.songsContent;
                    const { showSongGridWithAnimation } = await import('./song-view.js');
                    showSongGridWithAnimation();
                    break;
                case 'notebook':
                    contentToShow = dom.notebookContent;
                    await import('./notebook-view.js');
                    break;
                case 'items':
                    contentToShow = dom.itemsContent;
                    await import('./items-view.js');
                    break;
                case 'fairies':
                    contentToShow = dom.fairiesContent;
                    await import('./fairies-view.js');
                    break;
                case 'heart-containers':
                    contentToShow = dom.heartContainersContent;
                    await import('./hearts-view.js');
                    break;
                default:
                    return;
            }
            if (contentToShow) {
                contentToShow.classList.remove('hidden');
            }
        } catch (error) {
            console.error(`Failed to load content for ${newContent}:`, error);
            // Optionally, show an error message to the user
        } finally {
            if (dom.loadingIndicator) {
                dom.loadingIndicator.classList.add('hidden');
            }
        }
    }
    
    document.body.classList.toggle('content-active', !!activeContent);
    updateTingleVisibility();
}

/**
 * Hides all main content sections and deactivates nav items.
 */
function hideAllContent() {
    dom.allMainContentTypes.forEach(el => el.classList.add('hidden'));
    dom.getNavItems().forEach(item => item.classList.remove('active'));
}

/**
 * Switches the currently active view (e.g., to song detail, maps).
 * @param {HTMLElement} viewToShow - The view container element to make active.
 */
export function switchView(viewToShow) {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('is-active');
        v.classList.remove('enable-pinch-zoom');
    });

    if (viewToShow) {
        viewToShow.classList.add('is-active');
        if (viewToShow === dom.terminaMapView) {
            viewToShow.classList.add('enable-pinch-zoom');
        }
    }

    const isMainScreen = viewToShow === dom.mainScreen;
    
    dom.toggleUiButton.style.display = isMainScreen ? 'flex' : 'none';
    updateTingleVisibility();

    if (isMainScreen) {
        resetHideUiTimeout();
    } else {
        clearTimeout(hideUiTimeout);
        if(isNavOpen) toggleMainNav();
    }
}

function updateTingleVisibility() {
    const isTingleVisible = !isNavOpen && !activeContent;
    dom.tingleContainer.style.opacity = isTingleVisible ? '1' : '0';
    dom.tingleContainer.style.pointerEvents = isTingleVisible ? 'auto' : 'none';
}

/**
 * Calculates the transform properties for the view transition animation.
 * @param {DOMRect} elementRect - The bounding rectangle of the clicked element.
 */
export function getAnimationTransforms(elementRect) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleX = elementRect.width / viewportWidth;
    const scaleY = elementRect.height / viewportHeight;
    const translateX = elementRect.left + elementRect.width / 2 - viewportWidth / 2;
    const translateY = elementRect.top + elementRect.height / 2 - viewportHeight / 2;
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
}

/**
 * Resets the timeout that hides the UI toggle button after a period of inactivity.
 */
export function resetHideUiTimeout() {
    clearTimeout(hideUiTimeout);
    dom.toggleUiButton.classList.remove('fade-out');
    hideUiTimeout = setTimeout(() => {
        dom.toggleUiButton.classList.add('fade-out');
    }, 15000); // 15 seconds
}

/**
 * Toggles the visibility of the main screen controls and fairy states.
 */
export function toggleControlsVisibility() {
    triggerHapticFeedback();
    const isHidden = dom.mainScreen.classList.toggle('controls-hidden');
    dom.iconEyeOpen.classList.toggle('hidden', isHidden);
    dom.iconEyeClosed.classList.toggle('hidden', !isHidden);
    
    dom.mainNavContainer.classList.toggle('ui-is-hidden', isHidden);

    if (isHidden) {
        exploreInterval = setInterval(() => {
            dom.mainNavContainer.classList.toggle('alt-explore');
        }, 8000);
    } else {
        clearInterval(exploreInterval);
        exploreInterval = null;
        dom.mainNavContainer.classList.remove('alt-explore');
    }
    resetHideUiTimeout();
}

/**
 * Initializes all UI-related event listeners.
 */
export function initializeUI() {
    dom.mainTitleButton.addEventListener('click', toggleMainNav);
    dom.toggleUiButton.addEventListener('click', toggleControlsVisibility);
    
    dom.getNavItems().forEach(item => {
        item.addEventListener('click', async (e) => {
            const content = e.currentTarget.dataset.content;
            if (content === 'termina') {
                switchView(dom.terminaMapView);
            } else {
                await showContentForNav(content);
            }
        });
    });

    // Back buttons
    dom.backButton.addEventListener('click', () => switchView(dom.mainScreen));
    dom.mapsBackButton.addEventListener('click', () => switchView(dom.mainScreen));
    dom.terminaMapBackButton.addEventListener('click', () => switchView(dom.mainScreen));
    dom.itemDetailBackButton.addEventListener('click', () => switchView(dom.mainScreen));

    // Modal close buttons
    dom.mapModalClose.addEventListener('click', () => {
        triggerHapticFeedback();
        dom.mapModal.classList.remove('is-visible');
    });
    dom.controllerModalClose.addEventListener('click', () => {
        triggerHapticFeedback();
        dom.controllerModal.classList.remove('is-visible');
    });

    // Reset UI timeout on user interaction
    ['mousemove', 'touchstart', 'scroll'].forEach(evt => {
        document.addEventListener(evt, resetHideUiTimeout);
    });

    initializeSettings();
}
