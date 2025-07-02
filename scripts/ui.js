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
export function triggerHapticFeedback(duration = 1) {
    // Check for navigator support and if the context is secure
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        // Use a try-catch block to handle potential errors
        try {
            // A short, crisp vibration for subtle feedback
            navigator.vibrate(duration);
        } catch (error) {
            console.warn("Haptic feedback failed:", error);
        }
    }
}

/**
 * Adds a temporary class to an element for visual tap feedback.
 * @param {HTMLElement} element - The element to apply feedback to.
 */
export function addTapFeedback(element) {
    if (!element) return;
    element.classList.add('tapped');
    // Remove the class after the animation completes
    setTimeout(() => {
        element.classList.remove('tapped');
    }, 150); // Duration should match the CSS animation
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
    
    // Always disable the button when a toggle action starts.
    dom.settingsButton.disabled = true;

    if (isNavOpen) {
        playNavOpenSound();
        // If opening, re-enable the button only after the animation completes.
        setTimeout(() => {
            // Final check to ensure the nav wasn't closed again during the animation.
            if (isNavOpen) {
                dom.settingsButton.disabled = false;
            }
        }, 600); // Animation duration (400ms) + delay (200ms)
    } else {
        playNavCloseSound();
        if (isSettingsMenuOpen) {
            toggleSettingsMenu(); // Close settings if nav is closing
        }
        // If closing, the button remains disabled.
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

const ICONS = [
    { name: 'Default', path: 'app-icon/icon-1024x1024.png' },
    { name: 'Tatl & Tael', path: 'app-icon/icon-t-var-1024x1024.jpg' },
    { name: 'Moon', path: 'app-icon/icon-var-2-1024x1024.jpg' },
    { name: 'Skull Kid', path: 'app-icon/app-icon-var-1-1024x1024.jpg' },
];

/**
 * Populates the app icon options in the settings menu.
 */
function populateIconOptions() {
    dom.appIconOptions.innerHTML = '';
    ICONS.forEach(icon => {
        const button = document.createElement('button');
        button.className = 'app-icon-option';
        button.dataset.path = icon.path;
        button.innerHTML = `<img src="${icon.path}" alt="${icon.name} Icon">`;
        dom.appIconOptions.appendChild(button);
    });
}

/**
 * Applies the selected app icon.
 * @param {string} iconPath - The path to the selected icon.
 */
function applyIcon(iconPath) {
    dom.appleTouchIcon.href = iconPath;
    // Also update the favicon, using a smaller version if available
    const faviconPath = iconPath.replace('1024x1024', '192x192');
    dom.favicon.href = faviconPath;

    // Update active state in settings
    dom.appIconOptions.querySelectorAll('.app-icon-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.path === iconPath);
    });
}

/**
 * Loads and applies the saved app icon from localStorage.
 */
export function loadSavedIcon() {
    const savedIconPath = localStorage.getItem('appIcon');
    if (savedIconPath) {
        applyIcon(savedIconPath);
    }
}

/**
 * Initializes the settings menu event listeners.
 */
export function initializeSettings() {
    populateIconOptions();
    loadSavedIcon();

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
        const iconPath = button.dataset.path;
        applyIcon(iconPath);
        localStorage.setItem('appIcon', iconPath);
    });

    dom.clearDataButton.addEventListener('click', () => {
        triggerHapticFeedback();
        if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
            localStorage.clear();
            alert('Application data has been cleared. The page will now reload.');
            location.reload();
        }
    });

    // Set initial state
    dom.volumeSlider.value = localStorage.getItem('volume') || 0.5;
    setVolume(dom.volumeSlider.value);
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
