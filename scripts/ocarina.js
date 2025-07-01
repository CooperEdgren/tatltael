import { platforms, noteMappings } from './data.js';

const noteSounds = {
    'CU': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_loop.wav')
    },
    'CD': {
        short: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_short.wav'),
        med: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_med.wav'),
        long: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_long.wav'),
        loop: new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_loop.wav')
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
    'ZeldasLullaby': ['CL', 'CU', 'CR', 'CL', 'CU', 'CR'],
    'EponasSong': ['CU', 'CL', 'CR', 'CU', 'CL', 'CR'],
    'SariasSong': ['CD', 'CR', 'CL', 'CD', 'CR', 'CL'],
    'SunsSong': ['CR', 'CD', 'CU', 'CR', 'CD', 'CU'],
    'SongOfTime': ['CR', 'A', 'CD', 'CR', 'A', 'CD'],
    'SongOfStorms': ['A', 'CD', 'CU', 'A', 'CD', 'CU'],
    'MinuetOfForest': ['A', 'CU', 'CL', 'CR', 'CL', 'CR'],
    'BoleroOfFire': ['CD', 'A', 'CD', 'A', 'CR', 'CD', 'CR', 'CD'],
    'SerenadeOfWater': ['A', 'CD', 'CR', 'CR', 'CL'],
    'RequiemOfSpirit': ['A', 'CD', 'A', 'CR', 'CD', 'A'],
    'NocturneOfShadow': ['CL', 'CR', 'CR', 'A', 'CL', 'CR', 'CD'],
    'PreludeOfLight': ['CU', 'CR', 'CU', 'CR', 'CL', 'CU'],
    'SongOfHealing': ['CL', 'CR', 'CD', 'CL', 'CR', 'CD'],
    'SongOfSoaring': ['CD', 'CL', 'CU', 'CD', 'CL', 'CU'],
    'SongOfDoubleTime': ['CR', 'CR', 'A', 'A', 'CD', 'CD'],
    'InvertedSongOfTime': ['CD', 'A', 'CR', 'CD', 'A', 'CR'],
    'SonataOfAwakening': ['CU', 'CL', 'CU', 'CL', 'A', 'CR', 'A'],
    'GoronLullaby': ['A', 'CR', 'CL', 'A', 'CR', 'CL', 'CR', 'A'],
    'NewWaveBossaNova': ['CL', 'CU', 'CL', 'CR', 'CD', 'CL', 'CR'],
    'ElegyOfEmptiness': ['CR', 'CL', 'CR', 'CD', 'CR', 'CU', 'CL'],
    'OathToOrder': ['CR', 'CD', 'A', 'CD', 'CR', 'CU']
};

const songCorrectSound = new Audio('../music/sounds/OOTSounds/Menus/OOT_Song_Correct.wav');
let songCorrectEnabled = true;
let playedNotes = [];
let pressStartTime;
let loopInterval;

const platformIds = Object.keys(platforms);
let currentPlatformIndex = 0;

const noteButtonsContainer = document.getElementById('note-buttons');
const platformSwitchButton = document.getElementById('platform-switch');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
const songCorrectToggle = document.getElementById('song-correct-toggle');

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
    if (playedNotes.length < 6) return;
    if (playedNotes.length > 8) {
        playedNotes.shift();
    }

    for (const song in songs) {
        if (JSON.stringify(songs[song]) === JSON.stringify(playedNotes.slice(-songs[song].length))) {
            if (songCorrectEnabled) {
                songCorrectSound.currentTime = 0;
                songCorrectSound.play();
            }
            playedNotes = [];
            break;
        }
    }
}

platformSwitchButton.addEventListener('click', () => {
    currentPlatformIndex = (currentPlatformIndex + 1) % platformIds.length;
    renderOcarina();
});

settingsButton.addEventListener('click', () => {
    settingsMenu.classList.toggle('is-active');
});

songCorrectToggle.addEventListener('change', (e) => {
    songCorrectEnabled = e.target.checked;
});

renderOcarina();
