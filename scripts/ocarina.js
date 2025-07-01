import { platforms, noteMappings } from './data.js';

const noteSounds = {
    'CU': new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_F_med.wav'),
    'CD': new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D2_med.wav'),
    'CL': new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_B_med.wav'),
    'CR': new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_A_med.wav'),
    'A': new Audio('../music/sounds/MMsounds/Instruments/Ocarina/OOT_Notes_Ocarina_D_med.wav'),
};

const platformIds = Object.keys(platforms);
let currentPlatformIndex = 0;

const noteButtonsContainer = document.getElementById('note-buttons');
const platformSwitchButton = document.getElementById('platform-switch');

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
        button.addEventListener('click', () => {
            noteSounds[note].currentTime = 0;
            noteSounds[note].play();
        });
        noteButtonsContainer.appendChild(button);
    });
}

platformSwitchButton.addEventListener('click', () => {
    currentPlatformIndex = (currentPlatformIndex + 1) % platformIds.length;
    renderOcarina();
});

renderOcarina();