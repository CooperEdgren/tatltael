import { platforms, noteMappings } from './data.js';

const noteSounds = {
    'CU': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_loop.wav')
    },
    'CD': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_loop.wav')
    },
    'CL': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_loop.wav')
    },
    'CR': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_loop.wav')
    },
    'A': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_loop.wav')
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

const songCorrectSound = new Audio('../music/sounds/OOTSounds/Menus/OOT_Song_Correct.wav');
let songCorrectEnabled = true;
let playedNotes = [];
let pressStartTime;
let loopInterval;
let songTitleFadeTimeout;

const platformIds = Object.keys(platforms);
let currentPlatformIndex = 0;

const noteButtonsContainer = document.getElementById('note-buttons');
const platformSwitchButton = document.getElementById('platform-switch');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
const songCorrectToggle = document.getElementById('song-correct-toggle');
const songTitleElement = document.getElementById('song-title');
const songBookButton = document.getElementById('song-book-button');
const songBookContainer = document.getElementById('song-book-container');

function renderOcarina() {
    noteButtonsContainer.innerHTML = '';
    const platform = platformIds[currentPlatformIndex];
    const mapping = noteMappings[platform];

    const noteOrder = ['CU', 'CL', 'A', 'CR', 'CD'];

    const positions = {
        'CU': { row: 1, col: 2 },
        'CL': { row: 2, col: 1 },
        'A': { row: 2, col: 2 },
        'CR': { row: 2, col: 3 },
        'CD': { row: 3, col: 2 },
    };

    noteOrder.forEach(note => {
        const button = document.createElement('button');
        button.className = `note-button ${mapping[note].class}`;
        button.dataset.note = note;
        button.innerHTML = `<img src="../${mapping[note].icon}" alt="${note}">`;
        button.style.gridRow = positions[note].row;
        button.style.gridColumn = positions[note].col;

        button.addEventListener('mousedown', () => {
            pressStartTime = Date.now();
            loopInterval = setInterval(() => {
                noteSounds[note].loop.currentTime = 0;
                noteSounds[note].loop.play();
            }, noteSounds[note].loop.duration * 1000);
        });

        button.addEventListener('mouseup', () => {
            clearInterval(loopInterval);
            const pressDuration = Date.now() - pressStartTime;
            let soundToPlay;
            if (pressDuration < 200) {
                soundToPlay = noteSounds[note].short;
            } else if (pressDuration < 500) {
                soundToPlay = noteSounds[note].med;
            } else {
                soundToPlay = noteSounds[note].long;
            }
            soundToPlay.currentTime = 0;
            soundToPlay.play();
            playedNotes.push(note);
            checkSong();
        });

        noteButtonsContainer.appendChild(button);
    });
}

function checkSong() {
    if (playedNotes.length > 8) {
        playedNotes.shift();
    }

    for (const songKey in songs) {
        const song = songs[songKey];
        if (JSON.stringify(song.notes) === JSON.stringify(playedNotes.slice(-song.notes.length))) {
            if (songCorrectEnabled) {
                songCorrectSound.currentTime = 0;
                songCorrectSound.play();
            }
            displaySongTitle(song.name, song.hylian_name);
            playedNotes = [];
            break;
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
    songTitleFadeTimeout = setTimeout(() => {
        songTitleElement.classList.remove('is-visible');
    }, 3000);
}

function renderSongBook() {
    songBookContainer.innerHTML = '';
    const platform = platformIds[currentPlatformIndex];
    const mapping = noteMappings[platform];

    for (const songKey in songs) {
        const song = songs[songKey];
        const songElement = document.createElement('div');
        songElement.className = 'song-book-entry';
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
    }
}

platformSwitchButton.addEventListener('click', () => {
    currentPlatformIndex = (currentPlatformIndex + 1) % platformIds.length;
    renderOcarina();
    if (songBookContainer.classList.contains('is-visible')) {
        renderSongBook();
    }
});

settingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('is-active');
});

songCorrectToggle.addEventListener('change', (e) => {
    songCorrectEnabled = e.target.checked;
});

songBookButton.addEventListener('click', () => {
    songBookContainer.classList.toggle('is-visible');
    if (songBookContainer.classList.contains('is-visible')) {
        renderSongBook();
    }
});

document.addEventListener('click', (e) => {
    if (!settingsMenu.contains(e.target) && e.target !== settingsButton) {
        settingsMenu.classList.remove('is-active');
    }
});

renderOcarina();