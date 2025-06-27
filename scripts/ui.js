import * as dom from './dom.js';

let hideUiTimeout;

/**
 * Switches the currently active view.
 * @param {HTMLElement} viewToShow - The view container element to make active.
 */
export function switchView(viewToShow) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('is-active'));
    if (viewToShow) {
        viewToShow.classList.add('is-active');
    }
    const isSongSelection = viewToShow === dom.songSelectionView;
    dom.tingleContainer.style.display = isSongSelection ? 'block' : 'none';
    dom.bombersNotebookIconContainer.style.display = isSongSelection ? 'block' : 'none';
    dom.toggleUiButton.style.display = isSongSelection ? 'flex' : 'none';

    if (isSongSelection) {
        resetHideUiTimeout();
    } else {
        clearTimeout(hideUiTimeout);
    }
}

/**
 * Calculates the transform properties for the view transition animation.
 * @param {DOMRect} elementRect - The bounding rectangle of the clicked element.
 * @returns {string} The CSS transform string.
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
 * Toggles the visibility of the main song selection controls.
 */
export function toggleControlsVisibility() {
    dom.songSelectionView.classList.toggle('controls-hidden');
    const isHidden = dom.songSelectionView.classList.contains('controls-hidden');
    dom.iconEyeOpen.classList.toggle('hidden', isHidden);
    dom.iconEyeClosed.classList.toggle('hidden', !isHidden);
    resetHideUiTimeout();
}
