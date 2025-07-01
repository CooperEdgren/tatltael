import { platforms, noteMappings } from './data.js';
import { triggerHapticFeedback } from './ui.js';

// --- Howler.js Audio Setup ---
const noteSounds = {
    'CU': {
        short: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_short.wav'] }),
        med: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_med.wav'] }),
        loop: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_loop.wav'], loop: true })
    },
    'CD': {
        short: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_short.wav'] }),
        med: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_med.wav'] }),
        loop: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_loop.wav'], loop: true })
    },
    'CL': {
        short: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_short.wav'] }),
        med: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_med.wav'] }),
        loop: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_loop.wav'], loop: true })
    },
    'CR': {
        short: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_short.wav'] }),
        med: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_med.wav'] }),
        loop: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_loop.wav'], loop: true })
    },
    'A': {
        short: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_short.wav'] }),
        med: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_med.wav'] }),
        loop: new Howl({ src: ['../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_loop.wav'], loop: true })
    },
};

const songs = {
    'ZeldasLullaby': { name: "Zelda's Lullaby", hylian_name: "hylia's blessing", notes: ['CL', 'CU', 'CR', 'CL', 'CU', 'CR'] },
    'EponasSong': { name: "Epona's Song", hylian_name: "epona's song", notes: ['CU', 'CL', 'CR', 'CU', 'CL', 'CR'] },
    'SariasSong': { name: "Saria's Song", hylian_name: "saria's song", notes: ['CD', 'CR', 'CL', 'CD', 'CR', 'CL'] },
    'SunsSong': { name: "Sun's Song", hylian_name: "sun's song", notes: ['CR', 'CD', 'CU', 'CR', 'CD', 'CU'] },
    'SongOfTime': { name: "Song of Time", hylian_name: "temple of time", notes: ['CR', 'A', 'CD', 'CR', 'A', 'CD'] },
    'SongOfStorms': { name: "Song of Storms", hylian_name: "song of storms", notes: ['A', 'CD', 'CU', 'A', 'CD', 'CU'] },
    'MinuetOfForest': { name: "Minuet of Forest", hylian_name: "minuet of forest", notes: ['A', 'CU', 'CL', 'CR', 'CL', 'CR'] },
    'BoleroOfFire': { name: "Bolero of Fire", hylian_name: "bolero of fire", notes: ['CD', 'A', 'CD', 'A', 'CR', 'CD', 'CR', 'CD'] },
    'SerenadeOfWater': { name: "Serenade of Water", hylian_name: "serenade of water", notes: ['A', 'CD', 'CR', 'CR', 'CL'] },
    'RequiemOfSpirit': { name: "Requiem of Spirit", hylian_name: "requiem of spirit", notes: ['A', 'CD', 'A', 'CR', 'CD', 'A'] },
    'NocturneOfShadow': { name: "Nocturne of Shadow", hylian_name: "nocturne of shadow", notes: ['CL', 'CR', 'CR', 'A', 'CL', 'CR', 'CD'] },
    'PreludeOfLight': { name: "Prelude of Light", hylian_name: "prelude of light", notes: ['CU', 'CR', 'CU', 'CR', 'CL', 'CU'] },
    'SongOfHealing': { name: "Song of Healing", hylian_name: "song of healing", notes: ['CL', 'CR', 'CD', 'CL', 'CR', 'CD'] },
    'SongOfSoaring': { name: "Song of Soaring", hylian_name: "song of soaring", notes: ['CD', 'CL', 'CU', 'CD', 'CL', 'CU'] },
    'SongOfDoubleTime': { name: "Song of Double Time", hylian_name: "song of double time", notes: ['CR', 'CR', 'A', 'A', 'CD', 'CD'] },
    'InvertedSongOfTime': { name: "Inverted Song of Time", hylian_name: "inverted song of time", notes: ['CD', 'A', 'CR', 'CD', 'A', 'CR'] },
    'SonataOfAwakening': { name: "Sonata of Awakening", hylian_name: "sonata of awakening", notes: ['CU', 'CL', 'CU', 'CL', 'A', 'CR', 'A'] },
    'GoronLullaby': { name: "Goron Lullaby", hylian_name: "goron lullaby", notes: ['A', 'CR', 'CL', 'A', 'CR', 'CL', 'CR', 'A'] },
    'NewWaveBossaNova': { name: "New Wave Bossa Nova", hylian_name: "new wave bossa nova", notes: ['CL', 'CU', 'CL', 'CR', 'CD', 'CL', 'CR'] },
    'ElegyOfEmptiness': { name: "Elegy of Emptiness", hylian_name: "elegy of emptiness", notes: ['CR', 'CL', 'CR', 'CD', 'CR', 'CU', 'CL'] },
    'OathToOrder': { name: "Oath to Order", hylian_name: "oath to order", notes: ['CR', 'CD', 'A', 'CD', 'CR', 'CU'] }
};

const songCorrectSound = new Howl({ src: ['../music/sounds/OOTSounds/Menus/OOT_Song_Correct.wav'] });

// --- State Management ---
let songCorrectEnabled = true;
let playedNotes = [];
let pressStartTime = null;
let activeNote = null;
let loopSoundId = null;
let songTitleFadeTimeout;
const platformIds = Object.keys(platforms);
let currentPlatformIndex = 0;
let keysPressed = {};

// --- DOM Elements ---
const body = document.body;
const noteButtonsContainer = document.getElementById('note-buttons');
const platformSwitchButton = document.getElementById('platform-switch');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
const songCorrectToggle = document.getElementById('song-correct-toggle');
const songTitleElement = document.getElementById('song-title');
const songBookButton = document.getElementById('song-book-button');
const songBookContainer = document.getElementById('song-book-container');

// --- Core Functions ---

function playNote(note) {
    if (!note || activeNote) return;

    triggerHapticFeedback();
    activeNote = note;
    pressStartTime = Date.now();

    loopSoundId = noteSounds[note].loop.play();
    noteSounds[note].loop.fade(0, 0.7, 100, loopSoundId);
}

function stopNote(note) {
    if (!note || note !== activeNote) return;

    const pressDuration = Date.now() - pressStartTime;

    if (loopSoundId) {
        noteSounds[note].loop.fade(0.7, 0, 100, loopSoundId);
        noteSounds[note].loop.once('fade', (id) => noteSounds[note].loop.stop(id), loopSoundId);
    }

    const soundToPlay = pressDuration < 200 ? noteSounds[note].short : noteSounds[note].med;
    soundToPlay.play();

    playedNotes.push(note);
    checkSong();
    
    activeNote = null;
    pressStartTime = null;
    loopSoundId = null;
}

function checkSong() {
    if (playedNotes.length > 8) playedNotes.shift();

    for (const songKey in songs) {
        const song = songs[songKey];
        if (JSON.stringify(song.notes) === JSON.stringify(playedNotes.slice(-song.notes.length))) {
            if (songCorrectEnabled) songCorrectSound.play();
            displaySongTitle(song.name, song.hylian_name);
            playedNotes = [];
            return;
        }
    }
}

function displaySongTitle(name, hylianName) {
    clearTimeout(songTitleFadeTimeout);
    songTitleElement.innerHTML = `
        <span class="song-name-main">${name}</span>
        <span class="song-name-hylian">${hylianName}</span>
    `;
    songTitleElement.classList.add('is-visible');
    songTitleFadeTimeout = setTimeout(() => songTitleElement.classList.remove('is-visible'), 3000);
}

function renderOcarina() {
    noteButtonsContainer.innerHTML = '';
    const platform = platformIds[currentPlatformIndex];
    const mapping = noteMappings[platform];
    const noteOrder = ['CU', 'CL', 'A', 'CR', 'CD'];
    const positions = {
        'CU': { row: 1, col: 2 }, 'CL': { row: 2, col: 1 },
        'A':  { row: 2, col: 2 }, 'CR': { row: 2, col: 3 },
        'CD': { row: 3, col: 2 },
    };

    noteOrder.forEach(note => {
        const button = document.createElement('button');
        button.className = `note-button ${mapping[note].class}`;
        button.dataset.note = note;
        button.innerHTML = `<img src="../${mapping[note].icon}" alt="${note}">`;
        button.style.gridRow = positions[note].row;
        button.style.gridColumn = positions[note].col;

        button.addEventListener('mousedown', () => playNote(note));
        button.addEventListener('mouseup', () => stopNote(note));
        button.addEventListener('mouseleave', () => { if (activeNote === note) stopNote(note); });
        button.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(note); });
        button.addEventListener('touchend', () => stopNote(note));

        noteButtonsContainer.appendChild(button);
    });
}

function renderSongBook() {
    songBookContainer.innerHTML = '';
    const platform = platformIds[currentPlatformIndex];
    const mapping = noteMappings[platform];

    Object.values(songs).forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song-book-entry';
        songElement.style.animationDelay = `${index * 50}ms`;
        songElement.innerHTML = `
            <div class="song-book-title">
                <span class="song-name-main">${song.name}</span>
                <span class="song-name-hylian">${song.hylian_name}</span>
            </div>
            <div class="song-book-notes">
                ${song.notes.map(note => `<img src="../${mapping[note].icon}" class="note-icon-small">`).join('')}
            </div>
        `;
        songBookContainer.appendChild(songElement);
    });
}

const keyMap = {
    'KeyW': 'CU', 'ArrowUp': 'CU',
    'KeyA': 'CL', 'ArrowLeft': 'CL',
    'KeyS': 'CD', 'ArrowDown': 'CD',
    'KeyD': 'CR', 'ArrowRight': 'CR',
    'Space': 'A', 'Enter': 'A'
};

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const note = keyMap[e.code];
    if (note && !keysPressed[e.code]) {
        keysPressed[e.code] = true;
        playNote(note);
    }
});

document.addEventListener('keyup', (e) => {
    const note = keyMap[e.code];
    if (note) {
        keysPressed[e.code] = false;
        stopNote(note);
    }
});

platformSwitchButton.addEventListener('click', () => {
    triggerHapticFeedback();
    currentPlatformIndex = (currentPlatformIndex + 1) % platformIds.length;
    renderOcarina();
    if (songBookContainer.classList.contains('is-visible')) renderSongBook();
});

settingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHapticFeedback(30);
    settingsMenu.classList.toggle('is-active');
});

songCorrectToggle.addEventListener('change', (e) => {
    triggerHapticFeedback();
    songCorrectEnabled = e.target.checked;
});

songBookButton.addEventListener('click', () => {
    triggerHapticFeedback();
    body.classList.toggle('song-book-active');
    songBookContainer.classList.toggle('is-visible');
    if (songBookContainer.classList.contains('is-visible')) renderSongBook();
});

document.addEventListener('click', (e) => {
    if (settingsMenu.classList.contains('is-active') && !settingsMenu.contains(e.target) && e.target !== settingsButton) {
        settingsMenu.classList.remove('is-active');
    }
});

renderOcarina();