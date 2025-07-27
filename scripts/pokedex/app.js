import { POKEMON_LIMIT, SUPPORTED_GAMES, DELTA_GAMES } from './constants.js';
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
    const deltaView = document.getElementById('delta-view');
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
            switchToDelta: () => switchToView('delta')
        },
        updateNav() {
            const leftContainer = document.querySelector('.nav-options-left');
            const rightContainer = document.querySelector('.nav-options-right');

            // Ensure dynamic pokedex button exists and is in the DOM
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
                // Add it to a container to ensure it's part of the DOM tree
                leftContainer.appendChild(this.elements.pokedex);
            }

            // Hide all pills initially
            this.elements.trainerCard.style.display = 'none';
            this.elements.upload.style.display = 'none';
            this.elements.delta.style.display = 'none';
            this.elements.pokedex.style.display = 'none';

            // Show the correct pills based on the current state
            switch(this.currentState) {
                case 'pokedex':
                    this.elements.trainerCard.style.display = 'flex';
                    this.elements.upload.style.display = 'flex';
                    this.elements.delta.style.display = 'flex';
                    break;
                case 'trainerCard':
                    this.elements.pokedex.style.display = 'flex';
                    this.elements.upload.style.display = 'flex';
                    this.elements.delta.style.display = 'flex';
                    break;
                case 'delta':
                    this.elements.trainerCard.style.display = 'flex';
                    this.elements.upload.style.display = 'flex';
                    this.elements.pokedex.style.display = 'flex';
                    // Move pokedex pill to the right container
                    rightContainer.insertBefore(this.elements.pokedex, this.elements.backToSongbook);
                    break;
                case 'uploadModal':
                    // Logic for upload modal depends on previous state
                    if (this.previousState === 'trainerCard') {
                        this.elements.pokedex.style.display = 'flex';
                        this.elements.upload.style.display = 'flex';
                        this.elements.delta.style.display = 'flex';
                    } else if (this.previousState === 'delta') {
                        this.elements.trainerCard.style.display = 'flex';
                        this.elements.upload.style.display = 'flex';
                        this.elements.pokedex.style.display = 'flex';
                        rightContainer.insertBefore(this.elements.pokedex, this.elements.backToSongbook);
                    } else { // Default to pokedex view's nav
                        this.elements.trainerCard.style.display = 'flex';
                        this.elements.upload.style.display = 'flex';
                        this.elements.delta.style.display = 'flex';
                    }
                    break;
            }

            // Ensure pokedex pill is in the correct container for non-delta views
            if (this.currentState !== 'delta' && this.currentState !== 'uploadModal' && this.previousState !== 'delta') {
                 leftContainer.insertBefore(this.elements.pokedex, this.elements.upload);
            }
        }
    };

    const switchToView = (view) => {
        if (view !== 'uploadModal') {
            uploadModal.style.display = 'none';
        }

        pokedexView.style.display = 'none';
        trainerCardView.style.display = 'none';
        deltaView.style.display = 'none';

        if (view === 'pokedex') {
            pokedexView.style.display = 'block';
            ui.setHeaderTitle(originalHeaderText);
            navManager.currentState = 'pokedex';
        } else if (view === 'trainerCard') {
            trainerCardView.style.display = 'block';
            ui.setHeaderTitle('Trainer Card');
            navManager.currentState = 'trainerCard';
        } else if (view === 'delta') {
            deltaView.style.display = 'block';
            ui.setHeaderTitle('Delta');
            navManager.currentState = 'delta';
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
            card.classList.remove('selected-for-compare', 'loading-compare');
        } else {
            if (comparisonList.length < 2) {
                comparisonList.push(pokemonId);
                card.classList.add('selected-for-compare', 'loading-compare');

                const promise = pokemonService.getPokemonDetails(pokemonId)
                    .then(details => pokemonService.getPokemonTypeEffectiveness(details)
                        .then(effectiveness => ({ details, effectiveness })));

                comparisonDataCache[pokemonId] = promise;

                promise.then(() => {
                    card.classList.remove('loading-compare');
                    updateCompareButton();
                }).catch(error => {
                    console.error('Failed to fetch comparison data for', pokemonId, error);
                    card.classList.remove('loading-compare');
                });
            }
        }
        updateCompareButton();
    };

    const updateCompareButton = () => {
        if (comparisonList.length > 0) {
            compareBtn.classList.add('visible');
        } else {
            compareBtn.classList.remove('visible');
        }
        compareBtn.textContent = `Compare (${comparisonList.length}/2)`;

        const dataLoaded = comparisonList.every(id => comparisonDataCache[id] && typeof comparisonDataCache[id].then === 'function');
        
        if (comparisonList.length === 2 && dataLoaded) {
            Promise.all(comparisonList.map(id => comparisonDataCache[id])).then(() => {
                compareBtn.disabled = false;
            });
        } else {
            compareBtn.disabled = true;
        }
    };

    const clearComparison = () => {
        comparisonList = [];
        comparisonDataCache = {};
        document.querySelectorAll('.pokemon-card.selected-for-compare').forEach(card => card.classList.remove('selected-for-compare'));
        updateCompareButton();
    };

    document.addEventListener('click', (event) => {
        const modalShinyToggle = event.target.closest('#modal-shiny-toggle');
        if (modalShinyToggle) {
            const modalSprite = document.querySelector('.modal-sprite');
            if (modalSprite) {
                modalSprite.classList.toggle('is-shiny');
                const isShiny = modalSprite.classList.contains('is-shiny');
                modalSprite.src = isShiny ? modalSprite.dataset.shinyIdle : modalSprite.dataset.idle;
            }
        }
    });

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
            const pokemonId = parseInt(card.dataset.id, 10);
            const pokemonFromList = allPokemon.find(p => p.id === pokemonId);
            
            // Open modal immediately with basic info
            openModal(pokemonId, pokemonFromList, card);

            // Fetch complete data in the background
            try {
                const completeData = await pokemonService.getPokemonComplete(pokemonId);
                // The modal is already open, so we just need to update it with the full data
                document.dispatchEvent(new CustomEvent('pokemonDetailsLoaded', { detail: completeData }));
            } catch (error) {
                console.error('Error fetching full Pokémon details:', error);
                ui.showError('Failed to load all Pokémon details.');
                // Optionally, close the modal or show an error inside it
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
        const modal = document.getElementById('pokemon-modal');
        if (modal.classList.contains('compare-modal')) {
            ui.closeCompareModal();
            ui.showMenuButton();
            ui.setHeaderTitle(originalHeaderText);
        } else {
            menuButton.classList.toggle('active');
            ui.toggleNavPill();
        }
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
                const [data1, data2] = await Promise.all([
                    comparisonDataCache[comparisonList[0]],
                    comparisonDataCache[comparisonList[1]]
                ]);

                const { details: p1Details, effectiveness: e1 } = data1;
                const { details: p2Details, effectiveness: e2 } = data2;

                // Stat comparison logic
                let p1Score = 0;
                let p2Score = 0;
                const statComparisons = p1Details.stats.map((p1Stat, index) => {
                    const p2Stat = p2Details.stats[index];
                    if (p1Stat.base_stat > p2Stat.base_stat) {
                        p1Score++;
                        return 'higher';
                    } else if (p1Stat.base_stat < p2Stat.base_stat) {
                        p2Score++;
                        return 'lower';
                    }
                    return 'equal';
                });

                const p1Overall = p1Score > p2Score ? 'winner' : (p1Score < p2Score ? 'loser' : 'tie');
                const p2Overall = p2Score > p1Score ? 'winner' : (p2Score < p1Score ? 'loser' : 'tie');

                // Type advantage logic
                const p1Types = p1Details.types.map(t => t.type.name);
                const p2Types = p2Details.types.map(t => t.type.name);
                const p1HasAdvantage = p1Types.some(t => e2.weaknesses.includes(t));
                const p2HasAdvantage = p2Types.some(t => e1.weaknesses.includes(t));
                
                let p1State = 'neutral', p2State = 'neutral';
                if (p1HasAdvantage && !p2HasAdvantage) { p1State = 'advantage'; p2State = 'disadvantage'; }
                else if (p2HasAdvantage && !p1HasAdvantage) { p2State = 'advantage'; p1State = 'disadvantage'; }

                ui.setHeaderTitle('');
                await sleep(100);
                ui.renderCompareModal(
                    { ...p1Details, overall: p1Overall, statComparisons, advantage: p1State },
                    { ...p2Details, overall: p2Overall, statComparisons: statComparisons.map(c => c === 'higher' ? 'lower' : (c === 'lower' ? 'higher' : 'equal')), advantage: p2State },
                    e1, e2
                );
                compareBtn.classList.remove('visible');
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
            // Start pre-fetching in the background
            prefetchAllPokemonData();
        } catch (error) {
            console.error('Error in displayPokemon:', error);
            ui.showError('Failed to load Pokémon. Please try again later.');
        } finally {
            ui.hideLoader();
        }
    };

    const prefetchAllPokemonData = async () => {
        console.log('Starting Pokémon data pre-fetch...');
        for (const pokemon of allPokemon) {
            // A small delay to prevent overwhelming the network
            await sleep(50); 
            // The getPokemonComplete function will fetch and cache if not already present
            await pokemonService.getPokemonComplete(pokemon.id);
        }
        console.log('Pokémon data pre-fetch complete.');
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
    navManager.elements.delta.addEventListener('click', (e) => { e.preventDefault(); navManager.actions.switchToDelta(); ui.toggleNavPill(); menuButton.classList.remove('active'); });

    const setupDeltaView = () => {
        const grid = document.getElementById('delta-games-grid');
        const infoBtn = document.getElementById('delta-info-btn');
        const infoPopup = document.getElementById('delta-info-popup');
        const infoPopupContent = infoPopup.querySelector('.info-popup-content');
        const closeBtn = document.getElementById('delta-info-close-btn');

        grid.innerHTML = DELTA_GAMES.map(game => `
            <div class="delta-game-container">
                <button class="delta-game-btn" data-game-name="${game.name}">${game.name}</button>
                <div class="deep-link-container">
                    <span>No Deep Link Set</span>
                    <input type="text" class="deep-link-input" placeholder="delta://game/...">
                    <button class="deep-link-confirm">✓</button>
                </div>
            </div>
        `).join('');

        grid.addEventListener('click', (e) => {
            const button = e.target.closest('.delta-game-btn');
            if (button) {
                const gameName = button.dataset.gameName;
                const savedLink = localStorage.getItem(`delta-link-${gameName}`);
                if (savedLink) {
                    window.open(`delta-launcher.html?game=${encodeURIComponent(savedLink)}`, '_blank');
                } else {
                    const container = button.nextElementSibling;
                    container.style.display = 'flex';
                }
            }

            const confirmBtn = e.target.closest('.deep-link-confirm');
            if (confirmBtn) {
                const container = confirmBtn.parentElement;
                const input = container.querySelector('.deep-link-input');
                const gameName = container.parentElement.querySelector('.delta-game-btn').dataset.gameName;
                if (input.value) {
                    localStorage.setItem(`delta-link-${gameName}`, input.value);
                    window.open(`delta-launcher.html?game=${encodeURIComponent(input.value)}`, '_blank');
                    container.style.display = 'none';
                }
            }
        });

        infoBtn.addEventListener('click', () => {
            const btnRect = infoBtn.getBoundingClientRect();
            const popupRect = infoPopupContent.getBoundingClientRect();

            const scaleX = btnRect.width / popupRect.width;
            const scaleY = btnRect.height / popupRect.height;
            const translateX = btnRect.left - popupRect.left + (btnRect.width - popupRect.width) / 2;
            const translateY = btnRect.top - popupRect.top + (btnRect.height - popupRect.height) / 2;

            infoPopupContent.style.transformOrigin = 'center center';
            infoPopupContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
            
            infoPopup.style.display = 'flex';
            requestAnimationFrame(() => {
                infoPopup.classList.add('visible');
                infoPopupContent.style.transform = 'translate(0, 0) scale(1)';
            });
        });

        const closePopup = () => {
            const btnRect = infoBtn.getBoundingClientRect();
            const popupRect = infoPopupContent.getBoundingClientRect();

            const scaleX = btnRect.width / popupRect.width;
            const scaleY = btnRect.height / popupRect.height;
            const translateX = btnRect.left - popupRect.left + (btnRect.width - popupRect.width) / 2;
            const translateY = btnRect.top - popupRect.top + (btnRect.height - popupRect.height) / 2;

            infoPopup.classList.remove('visible');
            infoPopupContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

            setTimeout(() => {
                infoPopup.style.display = 'none';
            }, 300); // Match transition duration
        };

        closeBtn.addEventListener('click', closePopup);
        infoPopup.addEventListener('click', (e) => {
            if (e.target === infoPopup) {
                closePopup();
            }
        });
    };

    const filtersToggleBtn = document.getElementById('filters-toggle-btn');
    const filtersBox = document.getElementById('filters-box');
    const filtersCloseBtn = document.getElementById('filters-close-btn');

    filtersToggleBtn.addEventListener('click', () => {
        filtersBox.classList.toggle('open');
    });

    filtersCloseBtn.addEventListener('click', () => {
        filtersBox.classList.remove('open');
    });

    initModal(originalHeaderText, ui, pokemonService);
    displayPokemon();
    setupFilters(generationFilterContainer, typeFilterContainer, trackingFilterContainer, applyFilters);
    switchToView('pokedex'); // Initial view setup
    setupUploadModal();
    setupDeltaView();
});