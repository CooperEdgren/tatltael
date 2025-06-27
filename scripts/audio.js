import * as dom from './dom.js';

let audioFadeInterval;

/**
 * Fades the background audio volume to a target level.
 * @param {number} targetVolume - The desired volume (0.0 to 1.0).
 */
export function fadeAudio(targetVolume) {
    if (!dom.backgroundAudio) return;

    clearInterval(audioFadeInterval);
    const startVolume = dom.backgroundAudio.volume;
    const difference = targetVolume - startVolume;
    const duration = 1000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = difference / steps;

    if (difference === 0) return;

    audioFadeInterval = setInterval(() => {
        const currentVolume = dom.backgroundAudio.volume;
        let newVolume = currentVolume + volumeStep;

        if ((volumeStep > 0 && newVolume >= targetVolume) || (volumeStep < 0 && newVolume <= targetVolume)) {
            newVolume = targetVolume;
            clearInterval(audioFadeInterval);
        }
        
        dom.backgroundAudio.volume = newVolume;
    }, stepTime);
}

/**
 * Starts background music on the first user interaction.
 */
function startBackgroundMusic() {
    if (dom.backgroundAudio.paused) {
        dom.backgroundAudio.volume = 0.5;
        dom.backgroundAudio.play().catch(e => console.error("Audio autoplay was prevented. Needs user interaction.", e));
    }
    // This listener only needs to run once.
    document.body.removeEventListener('click', startBackgroundMusic);
    document.body.removeEventListener('keydown', startBackgroundMusic);
}

/**
 * Sets up listeners to start the background music on first interaction.
 */
export function initializeAudio() {
    document.body.addEventListener('click', startBackgroundMusic, { once: true });
    document.body.addEventListener('keydown', startBackgroundMusic, { once: true });
}
