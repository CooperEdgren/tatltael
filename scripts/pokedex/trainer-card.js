import * as tracker from './tracker.js';
import * as favorites from './favorites.js';
import { POKEMON_LIMIT } from './constants.js';
import { allPokemon } from './state.js';
import { analyzeTeam } from './team-analyzer.js';
import * as badgeService from './badges.js';
import { openPokemonSelector, closeTeamBuilderModal } from './pokemon-selector.js';
import { openTeamAnalysisModal } from './team-analysis-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    const trainerNameInput = document.getElementById('trainer-name');
    const trainerSprite = document.getElementById('trainer-sprite');
    const badgeContainer = document.getElementById('badge-container');
    const teamContainer = document.getElementById('team-container');
    const generationSelector = document.getElementById('generation-selector');
    const regionalDexName = document.getElementById('regional-dex-name');
    const nationalCaughtEl = document.getElementById('national-caught');
    const nationalSeenEl = document.getElementById('national-seen');
    const regionalCaughtEl = document.getElementById('regional-caught');
    const regionalSeenEl = document.getElementById('regional-seen');
    const trainerCard = document.getElementById('trainer-card');

    const MAX_GENERATIONS = 5;

    const GEN_DATA = {
        1: { region: 'Kanto', dex_limit: 151, badges: ['boulder', 'cascade', 'thunder', 'rainbow', 'soul', 'marsh', 'volcano', 'earth'] },
        2: { region: 'Johto', dex_limit: 251, badges: ['zephyr', 'hive', 'plain', 'fog', 'storm', 'mineral', 'glacier', 'rising'] },
        3: { region: 'Hoenn', dex_limit: 386, badges: ['stone', 'knuckle', 'dynamo', 'heat', 'balance', 'feather', 'mind', 'rain'] },
        4: { region: 'Sinnoh', dex_limit: 493, badges: ['coal', 'forest', 'cobble', 'fen', 'relic', 'mine', 'icicle', 'beacon'] },
        5: { 
            region: 'Unova', 
            dex_limit: 649, 
            badges: ['trio', 'basic', 'insect', 'bolt', 'quake', 'jet', 'freeze', 'legend'],
            variants: {
                'bw2': { badges: ['basic', 'toxic', 'insect', 'bolt', 'quake', 'jet', 'legend', 'wave'] }
            }
        }
    };

    let currentGeneration = 1;
    let currentGender = 'male';
    let currentVariant = '';
    let team = [];
    let parsedSaveData = null;

    function createTrainerOptions() {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('trainer-options');
        optionsContainer.innerHTML = `
            <button id="gender-toggle">♀️/♂️</button>
            <button id="variant-toggle" style="display:none;">B/W 2</button>
        `;
        trainerCard.insertBefore(optionsContainer, trainerCard.firstChild);

        document.getElementById('gender-toggle').addEventListener('click', () => {
            currentGender = currentGender === 'male' ? 'female' : 'male';
            updateTrainerCard();
        });

        document.getElementById('variant-toggle').addEventListener('click', () => {
            currentVariant = currentVariant === '' ? 'var2' : '';
            updateTrainerCard();
        });
    }

    function loadTrainerName() {
        const savedName = localStorage.getItem(`trainerName_gen_${currentGeneration}`);
        if (savedName) {
            trainerNameInput.value = savedName;
        } else {
            trainerNameInput.value = '';
        }
    }

    function saveTrainerName() {
        localStorage.setItem(`trainerName_gen_${currentGeneration}`, trainerNameInput.value);
    }

    function loadTeam() {
        const savedTeam = localStorage.getItem(`team_gen_${currentGeneration}`);
        if (savedTeam) {
            team = JSON.parse(savedTeam);
        } else {
            team = [];
        }
        renderTeam();
    }

    function saveTeam() {
        localStorage.setItem(`team_gen_${currentGeneration}`, JSON.stringify(team));
        updateTeamAnalysis();
    }

    async function updateTeamAnalysis() {
        const analysisSection = document.getElementById('team-analysis');
        if (team.length < 1) {
            analysisSection.style.display = 'none';
            return;
        }

        const teamDetails = team.map(p => allPokemon.find(ap => ap.id === p.id));

        if (teamDetails.some(p => !p)) {
            analysisSection.style.display = 'block';
            analysisSection.innerHTML = '<h3>Loading Pokémon data for analysis...</h3>';
            return;
        }

        analysisSection.style.display = 'block';
        analysisSection.innerHTML = '<h3>Analyzing Team...</h3>';

        const analysis = await analyzeTeam(teamDetails);

        const renderTypeGrid = (title, types) => {
            const filteredTypes = Object.entries(types)
                .filter(([, pokemonNames]) => pokemonNames.length > 0)
                .sort(([, a], [, b]) => b.length - a.length);

            if (filteredTypes.length === 0) return '';

            return `
                <div class="type-grid-container">
                    <h4>${title}</h4>
                    <div class="type-grid">
                        ${filteredTypes.map(([type, pokemonNames]) => `
                            <div class="type-analysis-item">
                                <img src="images/pokedex-assets/icons/${type}.svg" alt="${type}">
                                <span>x${pokemonNames.length}</span>
                                <div class="pokemon-name-list">${pokemonNames.join(', ')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        };

        analysisSection.innerHTML = `
            <h3>Team Analysis</h3>
            <div class="analysis-grids">
                ${renderTypeGrid('Weaknesses', analysis.weaknesses)}
                ${renderTypeGrid('Resistances', analysis.resistances)}
                ${renderTypeGrid('Immunities', analysis.immunities)}
            </div>
        `;
    }

    function renderTeam() {
        teamContainer.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const slot = document.createElement('div');
            slot.classList.add('team-slot');
            slot.dataset.slotIndex = i;
            slot.draggable = true;

            if (team[i]) {
                const pokemon = allPokemon.find(p => p.id === team[i].id);
                if (pokemon && pokemon.types) {
                    const typesHtml = pokemon.types.map(typeInfo => 
                        `<img src="images/pokedex-assets/icons/${typeInfo.type.name}.svg" alt="${typeInfo.type.name}" class="type-badge-small">`
                    ).join('');

                    pokemon.types.forEach(typeInfo => {
                        slot.classList.add(`type-${typeInfo.type.name}`);
                    });

                    slot.innerHTML = `
                        <img src="${team[i].sprite}" alt="${team[i].name}" class="idle-animation-sprite">
                        <div class="team-pokemon-info">
                            <span class="team-pokemon-name">${team[i].name}</span>
                            <div class="team-pokemon-types">${typesHtml}</div>
                        </div>
                        <span class="remove-pokemon">&times;</span>
                    `;
                } else {
                    slot.innerHTML = `
                        <img src="${team[i].sprite}" alt="${team[i].name}" class="idle-animation-sprite">
                        <div class="team-pokemon-info">
                            <span class="team-pokemon-name">${team[i].name}</span>
                            <div class="team-pokemon-types"></div>
                        </div>
                        <span class="remove-pokemon">&times;</span>
                    `;
                }

                slot.querySelector('.remove-pokemon').addEventListener('click', (e) => {
                    e.stopPropagation();
                    team.splice(i, 1);
                    saveTeam();
                    renderTeam();
                });
            } else {
                slot.textContent = '+';
                slot.addEventListener('click', () => {
                    openPokemonSelector(team, currentGeneration, (newPokemon) => {
                        for (let i = 0; i < 6 && newPokemon.length > 0; i++) {
                            if (!team[i]) {
                                team[i] = newPokemon.shift();
                            }
                        }
                        saveTeam();
                        renderTeam();
                    });
                });
            }
            teamContainer.appendChild(slot);
        }

        let draggedItem = null;
        teamContainer.querySelectorAll('.team-slot').forEach(slot => {
            slot.addEventListener('dragstart', (e) => {
                draggedItem = e.target.closest('.team-slot');
                setTimeout(() => e.target.style.opacity = '0.5', 0);
            });
            slot.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedItem = null;
            });
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const targetSlot = e.target.closest('.team-slot');
                if (draggedItem && targetSlot && draggedItem !== targetSlot) {
                    const fromIndex = parseInt(draggedItem.dataset.slotIndex);
                    const toIndex = parseInt(targetSlot.dataset.slotIndex);
                    
                    const [movedItem] = team.splice(fromIndex, 1);
                    if (movedItem) {
                        team.splice(toIndex, 0, movedItem);
                    }

                    saveTeam();
                    renderTeam();
                }
            });
        });
        updateTeamAnalysis();
    }

    

    function createTeamControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('team-controls');
        controlsContainer.innerHTML = `
            <button id="set-from-save" style="display:none;">Set from Save</button>
            <button id="set-from-favorites">Set from Favorites</button>
            <button id="team-analysis-btn">Team Analysis</button>
        `;
        
        const analysisContainer = document.createElement('div');
        analysisContainer.id = 'team-analysis';
        
        const teamSection = teamContainer.parentElement;
        teamSection.insertBefore(controlsContainer, teamContainer);
        teamSection.appendChild(analysisContainer);

        document.getElementById('team-analysis-btn').addEventListener('click', () => {
            openTeamAnalysisModal(team);
        });

        document.getElementById('set-from-favorites').addEventListener('click', () => {
            const favoriteIds = favorites.getFavorites();
            const favoritePokemon = favoriteIds.map(id => allPokemon.find(p => p.id === id)).filter(Boolean);
            team = favoritePokemon.slice(0, 6).map(p => ({ id: p.id, name: p.name, sprite: p.sprite }));
            saveTeam();
            renderTeam();
        });

        document.getElementById('set-from-save').addEventListener('click', () => {
            if (parsedSaveData) {
                currentGeneration = parsedSaveData.generation;
                document.querySelectorAll('.generation-selector .generation-filter-btn').forEach(btn => {
                    btn.classList.toggle('active', parseInt(btn.dataset.generation) === currentGeneration);
                });

                localStorage.setItem(`trainerName_gen_${currentGeneration}`, parsedSaveData.trainerName);
                trainerNameInput.value = parsedSaveData.trainerName;

                localStorage.setItem('seenPokemon', JSON.stringify(parsedSaveData.seen));
                localStorage.setItem('caughtPokemon', JSON.stringify(parsedSaveData.caught));
                
                console.log('Badges from save:', parsedSaveData.badges);
                console.log('Team from save:', parsedSaveData.team);

                updateTrainerCard();
                const event = new Event('click', { bubbles: true });
                document.getElementById('favorites-filter-btn').dispatchEvent(event);
                document.getElementById('favorites-filter-btn').dispatchEvent(event);
            }
        });
    }

    function updateDexStatsUI() {
        const caught = tracker.getCaught();
        const seen = tracker.getSeen();
        const genInfo = GEN_DATA[currentGeneration];

        document.getElementById('national-caught').textContent = `${caught.length} / ${POKEMON_LIMIT}`;
        document.getElementById('national-seen').textContent = `${seen.length} / ${POKEMON_LIMIT}`;
        document.getElementById('regional-dex-name').textContent = `${genInfo.region} Dex`;
        document.getElementById('regional-caught').textContent = `${caught.filter(id => id <= genInfo.dex_limit).length} / ${genInfo.dex_limit}`;
        document.getElementById('regional-seen').textContent = `${seen.filter(id => id <= genInfo.dex_limit).length} / ${genInfo.dex_limit}`;
    }

    function updateTrainerCard() {
        const variantToggle = document.getElementById('variant-toggle');
        variantToggle.style.display = currentGeneration === 5 ? 'inline-block' : 'none';

        let spriteUrl = `images/pokedex-assets/trainers/gen${currentGeneration}${currentVariant}${currentGender === 'female' ? 'female' : ''}.png`;
        trainerSprite.src = spriteUrl;

        const genInfo = GEN_DATA[currentGeneration];
        let badges = genInfo.badges;
        if (currentGeneration === 5 && currentVariant === 'var2' && genInfo.variants.bw2) {
            badges = genInfo.variants.bw2.badges;
        }
        
        badgeContainer.innerHTML = badges.map(badge => `
            <div class="badge-container ${badgeService.isBadgeUnlocked(currentGeneration, badge) ? '' : 'locked'}">
                <img src="images/pokedex-assets/badges/${badge}.png" alt="${badge} badge" data-badge-name="${badge}">
            </div>
        `).join('');
        
        updateDexStatsUI();
        loadTeam();
        loadTrainerName();
    }

    function renderGenerationButtons() {
        for (let i = 1; i <= MAX_GENERATIONS; i++) {
            const button = document.createElement('button');
            button.classList.add('generation-filter-btn');
            if (i === currentGeneration) {
                button.classList.add('active');
            }
            button.dataset.generation = i;
            button.textContent = `Gen ${i}`;
            button.addEventListener('click', () => {
                currentGeneration = i;
                currentVariant = '';
                document.querySelectorAll('.generation-filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateTrainerCard();
            });
            generationSelector.appendChild(button);
        }
    }

    trainerNameInput.addEventListener('input', saveTrainerName);

    badgeContainer.addEventListener('click', (e) => {
        const badgeImg = e.target.closest('img[data-badge-name]');
        if (badgeImg) {
            const badgeName = badgeImg.dataset.badgeName;
            const badgeContainer = badgeImg.parentElement;
            if (badgeContainer.classList.contains('locked')) {
                badgeService.unlockBadge(currentGeneration, badgeName);
                badgeContainer.classList.remove('locked');
            } else {
                badgeService.lockBadge(currentGeneration, badgeName);
                badgeContainer.classList.add('locked');
            }
        }
    });

    document.addEventListener('saveDataParsed', (e) => {
        parsedSaveData = e.detail;
        const setFromSaveBtn = document.getElementById('set-from-save');
        if (setFromSaveBtn) {
            setFromSaveBtn.style.display = 'inline-block';
        }
    });

    document.addEventListener('pokemonDataLoaded', () => {
        renderTeam();
    });

    window.closeTeamBuilderModal = closeTeamBuilderModal;

    createTrainerOptions();
    createTeamControls();
    loadTrainerName();
    renderGenerationButtons();
    updateTrainerCard();

    const trainerCardView = document.getElementById('trainer-card-view');
    if (trainerCardView) {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style' && trainerCardView.style.display !== 'none') {
                    updateDexStatsUI();
                    loadTeam();
                }
            }
        });
        observer.observe(trainerCardView, { attributes: true });
    }
});