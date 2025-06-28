import * as dom from './dom.js';

let audioFadeInterval;
let navOpenSound;
let navCloseSound;
let isAudioInitialized = false;

/**
 * Creates and preloads the navigation sound effects.
 * This should be called after the first user interaction.
 */
function initializeSounds() {
    if (isAudioInitialized) return;

    try {
        // Create new Audio objects for the navigation sounds.
        // Assumes you have 'nav-open.mp3' and 'nav-close.mp3' in a 'music' folder.
        navOpenSound = new Audio('music/sounds/MMsounds/Tatl & Tael/MM_Tatl_Shift.wav');
        navCloseSound = new Audio('music/sounds/MMsounds/Tatl & Tael/MM_Tatl_In.wav');
        
        // Preload the sounds for faster playback.
        navOpenSound.preload = 'auto';
        navCloseSound.preload = 'auto';

        isAudioInitialized = true;
        console.log('Navigation sounds initialized.');
    } catch (e) {
        console.error("Error initializing navigation sounds:", e);
    }
}


/**
 * Plays the sound for opening the navigation.
 */
export function playNavOpenSound() {
    if (!navOpenSound) return;
    navOpenSound.currentTime = 0; // Rewind to the start
    navOpenSound.play().catch(e => console.error("Error playing open sound:", e));
}

/**
 * Plays the sound for closing the navigation.
 */
export function playNavCloseSound() {
    if (!navCloseSound) return;
    navCloseSound.currentTime = 0; // Rewind to the start
    navCloseSound.play().catch(e => console.error("Error playing close sound:", e));
}

/**
 * Fades the background audio volume to a target level.
 * @param {number} targetVolume - The desired volume (0.0 to 1.0).
 */
export function fadeAudio(targetVolume) {
    if (!dom.backgroundAudio) return;

    clearInterval(audioFadeInterval);
    const startVolume = dom.backgroundAudio.volume;
    const difference = targetVolume - startVolume;
    if (difference === 0) return;
    
    const duration = 1000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = difference / steps;

    audioFadeInterval = setInterval(() => {
        const currentVolume = dom.backgroundAudio.volume;
        let newVolume = currentVolume + volumeStep;

        if ((volumeStep > 0 && newVolume >= targetVolume) || (volumeStep < 0 && newVolume <= targetVolume)) {
            newVolume = targetVolume;
            clearInterval(audioFadeInterval);
        }
        
        try {
            dom.backgroundAudio.volume = newVolume;
        } catch (e) {
            console.error("Error setting audio volume:", e);
            clearInterval(audioFadeInterval);
        }
    }, stepTime);
}

/**
 * Starts background music and initializes sound effects on the first user interaction.
 */
function handleFirstInteraction() {
    console.log('First user interaction detected. Initializing audio.');
    
    // Initialize the navigation sounds
    initializeSounds();

    // Play the main background music
    if (dom.backgroundAudio && dom.backgroundAudio.paused) {
        dom.backgroundAudio.volume = 0; // Start muted and fade in
        dom.backgroundAudio.play().then(() => {
            fadeAudio(0.5); // Fade in to 50% volume
        }).catch(e => console.error("Audio autoplay was prevented.", e));
    }
}

/**
 * Sets up a one-time listener to enable all audio on the site.
 */
export function initializeAudio() {
    // The { once: true } option automatically removes the event listener after it runs once.
    document.body.addEventListener('click', handleFirstInteraction, { once: true });
    document.body.addEventListener('keydown', handleFirstInteraction, { once: true });
}
