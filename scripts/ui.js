import * as dom from './dom.js';
import { showSongGridWithAnimation } from './song-view.js';
import { playNavOpenSound, playNavCloseSound } from './audio.js'; // Import sound functions

let hideUiTimeout;
let activeContent = null; // Tracks which content is currently visible ('songs', 'notebook', etc.)
let isNavOpen = false;

/**
 * Toggles the visibility of the main navigation pill and plays corresponding sounds.
 */
export function toggleMainNav() {
    isNavOpen = !isNavOpen;

    // Play sound based on the new state of the navigation
    if (isNavOpen) {
        playNavOpenSound();
    } else {
        playNavCloseSound();
    }

    dom.mainTitleButton.classList.toggle('nav-active', isNavOpen);
    dom.navPill.classList.toggle('is-visible', isNavOpen);
    
    // Add or remove a listener to close the nav if clicking outside of it.
    // This makes the navigation feel more intuitive.
    if (isNavOpen) {
        setTimeout(() => document.body.addEventListener('click', closeNavOnClickOutside), 0);
    } else {
        document.body.removeEventListener('click', closeNavOnClickOutside);
    }
}

/**
 * Closes the navigation if a click occurs outside of the nav pill or the main title button.
 * @param {MouseEvent} event
 */
function closeNavOnClickOutside(event) {
    if (!dom.mainTitleButton.contains(event.target) && !dom.navPill.contains(event.target)) {
        if (isNavOpen) {
            toggleMainNav();
        }
    }
}

/**
 * Shows a specific section of content linked to a nav item.
 * @param {string} newContent - The 'data-content' attribute value of the clicked nav item.
 */
export function showContentForNav(newContent) {
    const newActiveItem = document.querySelector(`.nav-item[data-content="${newContent}"]`);

    // If the clicked content is already active, toggle it off to hide it.
    if (newContent === activeContent) {
        hideAllContent();
        activeContent = null;
        return;
    }

    hideAllContent();
    activeContent = newContent;

    if (newActiveItem) {
        newActiveItem.classList.add('active');
    }

    let contentToShow;
    switch (newContent) {
        case 'songs':
            contentToShow = dom.songsContent;
            showSongGridWithAnimation(); // Play the special animation for the song grid
            break;
        case 'notebook':
            contentToShow = dom.notebookContent;
            break;
        case 'items':
            contentToShow = dom.itemsContent;
            break;
        case 'masks':
            contentToShow = dom.masksContent;
            break;
        default:
            return;
    }
    
    if (contentToShow) {
        contentToShow.classList.remove('hidden');
    }
}

/**
 * Hides all main content sections and deactivates nav items.
 */
function hideAllContent() {
    dom.allMainContentTypes.forEach(el => el.classList.add('hidden'));
    dom.navItems.forEach(item => item.classList.remove('active'));
}


/**
 * Switches the currently active view (e.g., to song detail, maps).
 * @param {HTMLElement} viewToShow - The view container element to make active.
 */
export function switchView(viewToShow) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('is-active'));
    if (viewToShow) {
        viewToShow.classList.add('is-active');
    }
    const isMainScreen = viewToShow === dom.mainScreen;
    
    // Tingle and UI toggle button should only be visible on the main screen.
    dom.tingleContainer.style.opacity = isMainScreen ? '1' : '0';
    dom.tingleContainer.style.pointerEvents = isMainScreen ? 'auto' : 'none';
    dom.toggleUiButton.style.display = isMainScreen ? 'flex' : 'none';

    if (isMainScreen) {
        resetHideUiTimeout();
    } else {
        clearTimeout(hideUiTimeout);
        // If moving to another view (e.g., song detail), ensure the nav is closed.
        if(isNavOpen) toggleMainNav();
    }
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
 * Toggles the visibility of the main screen controls (header, content area).
 */
export function toggleControlsVisibility() {
    dom.mainScreen.classList.toggle('controls-hidden');
    const isHidden = dom.mainScreen.classList.contains('controls-hidden');
    dom.iconEyeOpen.classList.toggle('hidden', isHidden);
    dom.iconEyeClosed.classList.toggle('hidden', !isHidden);
    resetHideUiTimeout();
}
