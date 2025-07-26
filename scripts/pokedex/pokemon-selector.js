// js/pokemon-selector.js
import { applyFilters } from './filter.js';
import { allPokemon } from './state.js';
import { UI } from './ui.js';
import { setupFilters } from './filter-manager.js';

const ui = new UI();

let activeModalCloseHandler = null;

export function closeTeamBuilderModal() {
    if (activeModalCloseHandler) {
        activeModalCloseHandler();
    }
}

export async function openPokemonSelector(team, currentGeneration, onConfirm) {
    const modal = document.getElementById('pokemon-selector-modal');
    document.body.classList.add('modal-open');
    const maxSelection = 6 - team.filter(p => p).length;
    
    if (!modal.dataset.initialized) {
        modal.querySelector('.modal-body').innerHTML = `
            <div class="selector-header">
                <div id="selector-tracking-filters"></div>
                <div id="selector-gen-filters"></div>
            </div>
            <div class="selector-filters">
                <div id="selector-type-filters"></div>
            </div>
            <div id="selector-pokedex" class="pokedex"></div>
            <div class="selector-footer">
                <span id="selector-counter"></span>
                <div class="search-wrapper">
                    <input type="text" id="selector-search-bar" placeholder="Search Pokémon...">
                </div>
                <button id="selector-confirm-btn" class="compare-btn" disabled>Add to Team</button>
            </div>
        `;
        modal.dataset.initialized = 'true';
    }
    
    modal.style.display = 'block';

    const searchBar = document.getElementById('selector-search-bar');
    const pokedexContainer = document.getElementById('selector-pokedex');
    const genFilters = document.getElementById('selector-gen-filters');
    const typeFilters = document.getElementById('selector-type-filters');
    const trackingFilters = document.getElementById('selector-tracking-filters');
    const counter = document.getElementById('selector-counter');
    const confirmBtn = document.getElementById('selector-confirm-btn');
    const closeModalBtn = modal.querySelector('.close-button');

    confirmBtn.classList.add('visible');

    let selectedPokemonIds = [];
    let allSelectorCards = [];

    const activeGenButton = genFilters.querySelector(`.generation-filter-btn[data-generation="${currentGeneration}"]`);
    if (activeGenButton) {
        activeGenButton.classList.add('active');
    }

    if (pokedexContainer.children.length === 0) {
        allPokemon.forEach(p => {
            const card = ui.createPokemonCard(p, false);
            allSelectorCards.push(card);
            pokedexContainer.appendChild(card);
        });
    } else {
        allSelectorCards = Array.from(pokedexContainer.children);
    }

    const updateCounter = () => {
        counter.innerHTML = `Selected: <span class="selector-count">${selectedPokemonIds.length}</span>/${maxSelection}`;
        confirmBtn.disabled = selectedPokemonIds.length === 0;
    };

    const renderFilteredPokemon = () => {
        const filteredPokemon = applyFilters(allPokemon, searchBar, genFilters, typeFilters, trackingFilters);
        const filteredIds = new Set(filteredPokemon.map(p => p.id));
        allSelectorCards.forEach(card => {
            const cardId = parseInt(card.dataset.id);
            if (filteredIds.has(cardId)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };

    const cardClickHandler = e => {
        const card = e.target.closest('.pokemon-card');
        if (!card) return;
        
        const pokemonId = parseInt(card.dataset.id);
        const index = selectedPokemonIds.indexOf(pokemonId);

        if (index > -1) {
            selectedPokemonIds.splice(index, 1);
            card.classList.remove('selected-for-compare');
        } else {
            if (selectedPokemonIds.length < maxSelection) {
                selectedPokemonIds.push(pokemonId);
                card.classList.add('selected-for-compare');
            }
        }
        updateCounter();
    };

    const confirmSelection = () => {
        const newPokemon = selectedPokemonIds.map(id => {
            const p = allPokemon.find(p => p.id === id);
            return { id: p.id, name: p.name, sprite: p.sprite };
        });
        onConfirm(newPokemon);
        closeModal();
    };

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        confirmBtn.classList.remove('visible');
        
        allSelectorCards.forEach(card => card.classList.remove('selected-for-compare'));
        selectedPokemonIds = [];

        modal.removeEventListener('click', modalClickListener);
        searchBar.removeEventListener('input', renderFilteredPokemon);
        pokedexContainer.removeEventListener('click', cardClickHandler);
        confirmBtn.removeEventListener('click', confirmSelection);
        closeModalBtn.removeEventListener('click', closeModal);
        activeModalCloseHandler = null;
    };

    const modalClickListener = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    activeModalCloseHandler = closeModal;

    setupFilters(genFilters, typeFilters, trackingFilters, renderFilteredPokemon);
    searchBar.addEventListener('input', renderFilteredPokemon);
    pokedexContainer.addEventListener('click', cardClickHandler);
    confirmBtn.addEventListener('click', confirmSelection);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', modalClickListener);

    updateCounter();
    renderFilteredPokemon();
}
