let backgroundMusic;
let navOpenSound;
let navCloseSound;
let isAudioInitialized = false;
let currentTrackIndex = -1;
let isMuted = false; // Manage mute state locally

const musicTracks = [
    'music/40minutechillness.mp3',
    'music/50minutezeldachillvibe.mp3'
];

/**
 * Creates and preloads all sound effects and music.
 */
function initializeSounds() {
    if (isAudioInitialized) return;

    try {
        // Sound Effects
        navOpenSound = new Howl({ src: ['music/sounds/MMsounds/Tatl & Tael/MM_Tatl_Shift.wav'], volume: 0.8 });
        navCloseSound = new Howl({ src: ['music/sounds/MMsounds/Tatl & Tael/MM_Tatl_In.wav'], volume: 0.8 });

        // Background Music
        currentTrackIndex = Math.floor(Math.random() * musicTracks.length);
        backgroundMusic = new Howl({
            src: [musicTracks[currentTrackIndex]],
            loop: false, // We'll handle looping manually to create a playlist effect
            volume: 0.5,
            html5: true, // Use for streaming longer files
            onend: function() {
                playNextTrack();
            }
        });
        
        isAudioInitialized = true;
        console.log('All sounds initialized with Howler.js.');
    } catch (e) {
        console.error("Error initializing sounds with Howler.js:", e);
    }
}

/**
 * Plays the next track in the music list.
 */
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    if (backgroundMusic) {
        backgroundMusic.unload();
    }
    backgroundMusic = new Howl({
        src: [musicTracks[currentTrackIndex]],
        loop: false,
        volume: Howler.volume(),
        html5: true,
        onend: playNextTrack
    });
    backgroundMusic.play();
}

/**
 * Starts the background music playback.
 */
function startMusicPlayback() {
    if (!backgroundMusic || !isAudioInitialized) {
        console.warn("Music not initialized or no tracks found.");
        return;
    }
    
    if (!backgroundMusic.playing()) {
        backgroundMusic.play();
        backgroundMusic.fade(0, 0.5, 1500);
    }
}

export function playNavOpenSound() {
    if (navOpenSound) navOpenSound.play();
}

export function playNavCloseSound() {
    if (navCloseSound) navCloseSound.play();
}

export function setVolume(volume) {
    const newVolume = parseFloat(volume);
    Howler.volume(newVolume);
    localStorage.setItem('volume', newVolume);
}

/**
 * Toggles the mute state for all sounds.
 * @returns {boolean} - The new mute state.
 */
export function toggleMute() {
    isMuted = !isMuted;
    Howler.mute(isMuted);
    localStorage.setItem('isMuted', isMuted);
    return isMuted;
}

function handleFirstInteraction() {
    if (isAudioInitialized) return;
    
    console.log('First user interaction detected. Initializing audio.');
    
    initializeSounds();
    startMusicPlayback();
}

/**
 * Sets up a one-time listener to enable all audio on the site and loads saved settings.
 */
export function initializeAudio() {
    const savedVolume = localStorage.getItem('volume');
    const savedMute = localStorage.getItem('isMuted');

    if (savedVolume !== null) {
        Howler.volume(parseFloat(savedVolume));
    }

    // Add a check to handle potentially corrupted data in localStorage
    if (savedMute === 'true' || savedMute === 'false') {
        isMuted = JSON.parse(savedMute);
        Howler.mute(isMuted);
    } else {
        // If the stored value is invalid, default to not muted and clear the bad data
        isMuted = false;
        Howler.mute(false);
        localStorage.removeItem('isMuted');
    }

    document.body.addEventListener('click', handleFirstInteraction, { once: true });
    document.body.addEventListener('keydown', handleFirstInteraction, { once: true });
}