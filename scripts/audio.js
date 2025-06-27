import * as dom from './dom.js';

let audioFadeInterval;
let synth;

/**
 * Initializes the synthesizer after Tone.js is loaded and audio context is started.
 */
function initializeSynth() {
    // Check if Tone.js is available on the window object
    if (window.Tone && !synth) {
        // Create a polyphonic synthesizer
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: 'triangle' // A softer, more "classic" synth sound
            },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 0.5
            }
        }).toDestination(); // Connect the synth to the main audio output
    }
}

/**
 * Plays a sound for opening the navigation.
 * This plays a simple, pleasant C-major chord.
 */
export function playNavOpenSound() {
    if (!synth) return;
    const now = Tone.now();
    synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', now);
}

/**
 * Plays a sound for closing the navigation.
 * This plays the same C-major chord, but inverted, for a "closing" feel.
 */
export function playNavCloseSound() {
    if (!synth) return;
    const now = Tone.now();
    synth.triggerAttackRelease(['G4', 'E4', 'C4'], '8n', now);
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
 * This function is async to handle the promise from Tone.start().
 */
async function startBackgroundMusic() {
    // Start Tone.js Audio Context if it's not already running
    if (window.Tone && Tone.context.state !== 'running') {
        await Tone.start();
        console.log('Audio context started');
        initializeSynth(); // Initialize our synth now that the context is running
    }

    if (dom.backgroundAudio && dom.backgroundAudio.paused) {
        dom.backgroundAudio.volume = 0.5;
        dom.backgroundAudio.play().catch(e => console.error("Audio autoplay was prevented. Needs user interaction.", e));
    }
}

/**
 * Sets up listeners to start the background music and initialize all audio
 * on the first user interaction (click or keydown).
 */
export function initializeAudio() {
    // The { once: true } option automatically removes the event listener after it runs once.
    document.body.addEventListener('click', startBackgroundMusic, { once: true });
    document.body.addEventListener('keydown', startBackgroundMusic, { once: true });
}
