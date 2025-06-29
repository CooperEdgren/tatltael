import * as dom from './dom.js';

let audioFadeInterval;
let navOpenSound;
let navCloseSound;
let isAudioInitialized = false;
let currentTrackIndex = -1;
let isMuted = false;
let userVolume = 0.5; // Default volume

const musicTracks = [
    'music/40minutechillness.mp3', 'music/50minutezeldachillvibe.mp3'
];

/**
 * Creates and preloads the navigation sound effects.
 */
function initializeSounds() {
    if (isAudioInitialized) return;

    try {
        navOpenSound = new Audio('music/sounds/MMsounds/Tatl & Tael/MM_Tatl_Shift.wav');
        navCloseSound = new Audio('music/sounds/MMsounds/Tatl & Tael/MM_Tatl_In.wav');
        navOpenSound.preload = 'auto';
        navCloseSound.preload = 'auto';
        isAudioInitialized = true;
        console.log('Navigation sounds initialized.');
    } catch (e) {
        console.error("Error initializing navigation sounds:", e);
    }
}

/**
 * Plays the next track in the music list.
 */
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    dom.backgroundAudio.src = musicTracks[currentTrackIndex];
    dom.backgroundAudio.play().catch(e => console.error("Error playing next track:", e));
}

/**
 * Starts the background music playback.
 */
function startMusicPlayback() {
    if (musicTracks.length === 0) {
        console.warn("No music tracks found.");
        return;
    }
    // Start with a random track
    currentTrackIndex = Math.floor(Math.random() * musicTracks.length);
    dom.backgroundAudio.src = musicTracks[currentTrackIndex];
    
    // Set initial volume and play
    dom.backgroundAudio.volume = isMuted ? 0 : userVolume;
    dom.backgroundAudio.play().then(() => {
        if (!isMuted) {
            fadeAudio(userVolume, 1500); // Fade in gently
        }
    }).catch(e => console.error("Audio autoplay was prevented.", e));

    // Add event listener to play the next song when the current one ends
    dom.backgroundAudio.addEventListener('ended', playNextTrack);
}


/**
 * Plays the sound for opening the navigation.
 */
export function playNavOpenSound() {
    if (!navOpenSound) return;
    navOpenSound.currentTime = 0;
    navOpenSound.play().catch(e => console.error("Error playing open sound:", e));
}

/**
 * Plays the sound for closing the navigation.
 */
export function playNavCloseSound() {
    if (!navCloseSound) return;
    navCloseSound.currentTime = 0;
    navCloseSound.play().catch(e => console.error("Error playing close sound:", e));
}

/**
 * Fades the background audio volume to a target level.
 * @param {number} targetVolume - The desired volume (0.0 to 1.0).
 * @param {number} [duration=1000] - The duration of the fade in milliseconds.
 */
export function fadeAudio(targetVolume, duration = 1000) {
    if (!dom.backgroundAudio) return;

    clearInterval(audioFadeInterval);
    const startVolume = dom.backgroundAudio.volume;
    const difference = targetVolume - startVolume;
    if (difference === 0) return;
    
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
 * Sets the volume of the background music.
 * @param {number} volume - The new volume level (0.0 to 1.0).
 */
export function setVolume(volume) {
    userVolume = parseFloat(volume);
    if (!isMuted) {
        dom.backgroundAudio.volume = userVolume;
    }
}

/**
 * Toggles the mute state of the background music.
 */
export function toggleMute() {
    isMuted = !isMuted;
    dom.backgroundAudio.volume = isMuted ? 0 : userVolume;
    return isMuted;
}

/**
 * Starts background music and initializes sound effects on the first user interaction.
 */
function handleFirstInteraction() {
    console.log('First user interaction detected. Initializing audio.');
    
    initializeSounds();

    if (dom.backgroundAudio.paused) {
        startMusicPlayback();
    }
}

/**
 * Sets up a one-time listener to enable all audio on the site.
 */
export function initializeAudio() {
    document.body.addEventListener('click', handleFirstInteraction, { once: true });
    document.body.addEventListener('keydown', handleFirstInteraction, { once: true });
}''
