import { POKEMON_LIMIT, SUPPORTED_GAMES } from './constants.js';
import PokemonService from './pokemon.js';
import { UI } from './ui.js';
import * as favorites from './favorites.js';
import * as tracker from './tracker.js';
import { allPokemon, setAllPokemon } from './state.js';
import { applyFilters as applyFiltersFromModule } from './filter.js';
import { parseSaveFile } from './save-parser.js';
import { initModal, openModal } from './modal.js';
import { setupFilters } from './filter-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const pokedexContainer = document.getElementById('pokedex');
    const modalBody = document.getElementById('modal-body');
    const searchBar = document.getElementById('search-bar');
    const generationFilterContainer = document.getElementById('generation-filter-container');
    const typeFilterContainer = document.getElementById('type-filter-container');
    const trackingFilterContainer = document.getElementById('tracking-filter-container');
    const menuButton = document.getElementById('menu-button');
    const pokedexNav = document.querySelector('.pokedex-nav');
    const headerTitle = document.getElementById('header-title');
    const loader = document.getElementById('loader');
    const shinyToggleBtn = document.getElementById('shiny-toggle');
    const compareBtn = document.getElementById('compare-btn');
    const pokedexView = document.getElementById('pokedex-view');
    const trainerCardView = document.getElementById('trainer-card-view');
    const uploadModal = document.getElementById('upload-save-modal');

    // Services and UI
    const pokemonService = new PokemonService();
    const ui = new UI(pokedexContainer, modalBody, loader, generationFilterContainer, typeFilterContainer, pokedexNav, headerTitle, menuButton);

    // State
    const originalHeaderText = 'Pokedex';
    let isShinyView = false;
    let comparisonList = [];
    let comparisonDataCache = {};
    let longPressTimer;
    let isLongPress = false;
    let parsedSaveData = null;

    const navManager = {
        currentState: 'pokedex',
        previousState: 'pokedex',
        elements: {
            trainerCard: document.getElementById('nav-trainer-card'),
            upload: document.getElementById('nav-upload'),
            delta: document.getElementById('nav-launch-delta'),
            backToSongbook: document.querySelector('a[href="index.html"]'),
            pokedex: null, 
        },
        actions: {
            switchToPokedex: () => switchToView('pokedex'),
            switchToTrainerCard: () => switchToView('trainerCard'),
            switchToUploadModal: () => switchToView('uploadModal'),
            launchDelta: () => {
                // TODO: Implement deep link to Delta emulator (delta://)
                alert('Launch Delta functionality to be implemented.');
            }
        },
        updateNav() {
            const leftContainer = document.querySelector('.nav-options-left');
            if (this.elements.pokedex) this.elements.pokedex.style.display = 'none';
            this.elements.trainerCard.style.display = 'none';
            
            switch(this.currentState) {
                case 'pokedex':
                    this.elements.trainerCard.style.display = 'flex';
                    this.elements.upload.style.display = 'flex';
                    break;
                case 'trainerCard':
                    if (!this.elements.pokedex) {
                        this.elements.pokedex = this.elements.trainerCard.cloneNode(true);
                        this.elements.pokedex.id = 'nav-pokedex';
                        this.elements.pokedex.querySelector('img').src = 'images/pokedex-assets/pokedex.png';
                        this.elements.pokedex.ariaLabel = 'Pokedex';
                        this.elements.pokedex.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.actions.switchToPokedex();
                            ui.toggleNavPill();
                            menuButton.classList.remove('active');
                        });
                        leftContainer.prepend(this.elements.pokedex);
                    }
                    this.elements.pokedex.style.display = 'flex';
                    this.elements.upload.style.display = 'flex';
                    break;
                case 'uploadModal':
                     if (this.previousState === 'trainerCard') {
                        if (!this.elements.pokedex) {
                             this.elements.pokedex = this.elements.trainerCard.cloneNode(true);
                             this.elements.pokedex.id = 'nav-pokedex';
                             this.elements.pokedex.querySelector('img').src = 'images/pokedex-assets/pokedex.png';
                             this.elements.pokedex.ariaLabel = 'Pokedex';
                             leftContainer.prepend(this.elements.pokedex);
                             this.elements.pokedex.addEventListener('click', (e) => {
                                e.preventDefault();
                                this.actions.switchToPokedex();
                                ui.toggleNavPill();
                                menuButton.classList.remove('active');
                            });
                        }
                        this.elements.pokedex.style.display = 'flex';
                     } else {
                        this.elements.trainerCard.style.display = 'flex';
                     }
                     this.elements.upload.style.display = 'flex';
                    break;
            }
        }
    };

    const switchToView = (view) => {
        if (view !== 'uploadModal') {
            uploadModal.style.display = 'none';
        }

        if (view === 'pokedex') {
            trainerCardView.style.display = 'none';
            pokedexView.style.display = 'block';
            ui.setHeaderTitle(originalHeaderText);
            navManager.currentState = 'pokedex';
        } else if (view === 'trainerCard') {
            pokedexView.style.display = 'none';
            trainerCardView.style.display = 'block';
            ui.setHeaderTitle('Trainer Card');
            navManager.currentState = 'trainerCard';
        } else if (view === 'uploadModal') {
            navManager.previousState = navManager.currentState;
            navManager.currentState = 'uploadModal';
            ui.setHeaderTitle('Save File');
            uploadModal.style.display = 'block';
        }

        navManager.updateNav();
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleCardSelection = (card) => {
        const pokemonId = parseInt(card.dataset.id);
        const index = comparisonList.indexOf(pokemonId);
        if (index > -1) {
            comparisonList.splice(index, 1);
            delete comparisonDataCache[pokemonId];
            card.classList.remove('selected-for-compare');
        } else {
            if (comparisonList.length < 2) {
                comparisonList.push(pokemonId);
                card.classList.add('selected-for-compare');
                comparisonDataCache[pokemonId] = pokemonService.getPokemonDetails(pokemonId)
                    .then(details => pokemonService.getPokemonTypeEffectiveness(details).then(effectiveness => ({ details, effectiveness })));
            }
        }
        updateCompareButton();
    };

    const updateCompareButton = () => {
        compareBtn.style.display = comparisonList.length > 0 ? 'block' : 'none';
        compareBtn.textContent = `Compare (${comparisonList.length}/2)`;
        compareBtn.disabled = comparisonList.length !== 2;
    };

    const clearComparison = () => {
        comparisonList = [];
        comparisonDataCache = {};
        document.querySelectorAll('.pokemon-card.selected-for-compare').forEach(card => card.classList.remove('selected-for-compare'));
        updateCompareButton();
    };

    pokedexContainer.addEventListener('mousedown', (e) => {
        const card = e.target.closest('.pokemon-card');
        if (card) {
            isLongPress = false;
            longPressTimer = setTimeout(() => { isLongPress = true; handleCardSelection(card); }, 500);
        }
    });

    pokedexContainer.addEventListener('mouseup', () => clearTimeout(longPressTimer));

    pokedexContainer.addEventListener('click', async (event) => {
        if (isLongPress) { event.preventDefault(); return; }

        const cardButton = (selector) => event.target.closest(selector);
        const favoriteButton = cardButton('.favorite-btn');
        const seenButton = cardButton('.seen-btn');
        const caughtButton = cardButton('.caught-btn');
        const card = cardButton('.pokemon-card');

        if (favoriteButton) {
            const id = parseInt(favoriteButton.dataset.id);
            favorites.toggleFavorite(id);
            favoriteButton.classList.toggle('is-favorite', favorites.isFavorite(id));
            applyFilters();
            return;
        }
        if (seenButton) {
            const id = parseInt(seenButton.dataset.id);
            tracker.toggleSeen(id);
            seenButton.classList.toggle('is-seen', tracker.isSeen(id));
            seenButton.parentElement.querySelector('.caught-btn').classList.toggle('is-caught', tracker.isCaught(id));
            applyFilters();
            return;
        }
        if (caughtButton) {
            const id = parseInt(caughtButton.dataset.id);
            tracker.toggleCaught(id);
            caughtButton.classList.toggle('is-caught', tracker.isCaught(id));
            caughtButton.parentElement.querySelector('.seen-btn').classList.toggle('is-seen', tracker.isSeen(id));
            applyFilters();
            return;
        }

        if (card) {
            if (comparisonList.length > 0) { handleCardSelection(card); return; }
            const pokemonId = card.dataset.id;
            ui.showLoader();
            try {
                const pokemon = await pokemonService.getPokemonDetails(pokemonId);
                ui.setHeaderTitle(pokemon.name);
                const species = await pokemonService.getPokemonSpecies(pokemonId);
                const rawEncounters = await pokemonService.getPokemonEncounters(pokemonId);
                const encounters = pokemonService.processEncounters(rawEncounters);
                const evolutionChain = await pokemonService.getEvolutionChain(species.evolution_chain.url);
                const typeEffectiveness = await pokemonService.getPokemonTypeEffectiveness(pokemon);
                const isCatchableInWild = rawEncounters && rawEncounters.length > 0;
                openModal(pokemon, species, encounters, evolutionChain, typeEffectiveness, card, isCatchableInWild);
            } catch (error) {
                console.error('Error opening modal:', error);
                ui.showError('Failed to load Pokémon details.');
            } finally {
                ui.hideLoader();
            }
        }
    });
    
    document.addEventListener('clearComparison', clearComparison);

    const applyFilters = () => {
        const filteredPokemon = applyFiltersFromModule(allPokemon, searchBar, generationFilterContainer, typeFilterContainer, trackingFilterContainer);
        ui.renderPokemonList(filteredPokemon, isShinyView);
    };

    searchBar.addEventListener('input', applyFilters);

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        ui.toggleNavPill();
    });

    shinyToggleBtn.addEventListener('click', () => {
        isShinyView = !isShinyView;
        shinyToggleBtn.classList.toggle('active', isShinyView);
        applyFilters();
    });

    compareBtn.addEventListener('click', async () => {
        if (compareBtn.disabled) return;
        compareBtn.disabled = true;

        if (comparisonList.length === 2) {
            ui.showLoader();
            try {
                const [data1, data2] = await Promise.all([comparisonDataCache[comparisonList[0]], comparisonDataCache[comparisonList[1]]]);
                const { details: p1Details, effectiveness: e1 } = data1;
                const { details: p2Details, effectiveness: e2 } = data2;
                const p1Types = p1Details.types.map(t => t.type.name);
                const p2Types = p2Details.types.map(t => t.type.name);
                const p1HasAdvantage = p1Types.some(t => e2.weaknesses.includes(t));
                const p2HasAdvantage = p2Types.some(t => e1.weaknesses.includes(t));
                let p1State = 'neutral', p2State = 'neutral';
                if (p1HasAdvantage && !p2HasAdvantage) { p1State = 'advantage'; p2State = 'disadvantage'; }
                else if (p2HasAdvantage && !p1HasAdvantage) { p2State = 'advantage'; p1State = 'disadvantage'; }
                
                ui.setHeaderTitle('');
                await sleep(100);
                ui.renderCompareModal(p1Details, p2Details, e1, e2, p1State, p2State);
                compareBtn.style.display = 'none';
                document.body.classList.add('modal-open');
            } catch (error) {
                console.error('Error fetching Pokémon for comparison:', error);
                ui.showError('Failed to load Pokémon for comparison.');
            } finally {
                ui.hideLoader();
            }
        }
    });

    const displayPokemon = async () => {
        ui.showLoader();
        try {
            const pokemonData = await pokemonService.getPokemon(POKEMON_LIMIT);
            setAllPokemon(pokemonData);
            ui.renderPokemonList(allPokemon, isShinyView);
            document.dispatchEvent(new Event('pokemonDataLoaded'));
        } catch (error) {
            console.error('Error in displayPokemon:', error);
            ui.showError('Failed to load Pokémon. Please try again later.');
        } finally {
            ui.hideLoader();
        }
    };

    const setupUploadModal = () => {
        const closeButton = uploadModal.querySelector('.close-button');
        const uploadButton = document.getElementById('upload-button');
        const gameSelect = document.getElementById('game-select');
        const fileInput = document.getElementById('save-file-input');

        gameSelect.innerHTML = SUPPORTED_GAMES.map(game => `<option value="${game}">${game.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('');

        closeButton.addEventListener('click', () => {
            uploadModal.style.display = 'none';
            switchToView(navManager.previousState);
        });

        uploadButton.addEventListener('click', async () => {
            if (!fileInput.files[0]) { ui.showError('Please select a save file.'); return; }
            ui.showLoader();
            try {
                parsedSaveData = await parseSaveFile(fileInput.files[0], gameSelect.value);
                const genData = { 'firered': 1, 'leafgreen': 1, 'ruby': 3, 'sapphire': 3, 'emerald': 3, 'diamond': 4, 'pearl': 4, 'platinum': 4, 'heartgold': 2, 'soulsilver': 2, 'black': 5, 'white': 5, 'black-2': 5, 'white-2': 5, 'red': 1, 'blue': 1, 'yellow': 1, 'gold': 2, 'silver': 2, 'crystal': 2 };
                parsedSaveData.generation = genData[gameSelect.value];
                uploadModal.style.display = 'none';
                document.dispatchEvent(new CustomEvent('saveDataParsed', { detail: parsedSaveData }));
            } catch (error) {
                console.error('Error parsing save file:', error);
                ui.showError('Failed to parse save file. Please ensure you have selected the correct game and a valid save file.');
            } finally {
                ui.hideLoader();
            }
        });
    };

    // Setup Nav Actions
    navManager.elements.trainerCard.addEventListener('click', (e) => { e.preventDefault(); navManager.actions.switchToTrainerCard(); ui.toggleNavPill(); menuButton.classList.remove('active'); });
    navManager.elements.upload.addEventListener('click', (e) => { e.preventDefault(); navManager.actions.switchToUploadModal(); ui.toggleNavPill(); menuButton.classList.remove('active'); });
    navManager.elements.delta.addEventListener('click', (e) => { e.preventDefault(); navManager.actions.launchDelta(); });

    initModal(originalHeaderText, ui, pokemonService);
    displayPokemon();
    setupFilters(generationFilterContainer, typeFilterContainer, trackingFilterContainer, applyFilters);
    switchToView('pokedex'); // Initial view setup
    setupUploadModal();
});