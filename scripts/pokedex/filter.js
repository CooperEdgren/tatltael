import * as favorites from './favorites.js';
import * as tracker from './tracker.js';

export function applyFilters(allPokemon, searchBar, generationFilterContainer, typeFilterContainer, trackingFilterContainer) {
    const searchTerm = searchBar.value.toLowerCase();
    const activeGenerationButton = generationFilterContainer.querySelector('.generation-filter-btn.active');
    const selectedGeneration = activeGenerationButton ? parseInt(activeGenerationButton.dataset.generation) : null;
    const activeTypeButtons = typeFilterContainer.querySelectorAll('.type-filter-btn.active');
    const selectedTypes = Array.from(activeTypeButtons).map(btn => btn.dataset.type);
    
    const favoritesOnly = trackingFilterContainer.querySelector('#favorites-filter-btn').classList.contains('active');
    const seenOnly = trackingFilterContainer.querySelector('#seen-filter-btn').classList.contains('active');
    const caughtOnly = trackingFilterContainer.querySelector('#caught-filter-btn').classList.contains('active');

    let filteredPokemon = allPokemon;

    if (favoritesOnly) {
        const favoriteIds = favorites.getFavorites();
        filteredPokemon = filteredPokemon.filter(pokemon => favoriteIds.includes(pokemon.id));
    }
    
    if (seenOnly) {
        const seenIds = tracker.getSeen();
        filteredPokemon = filteredPokemon.filter(pokemon => seenIds.includes(pokemon.id));
    }

    if (caughtOnly) {
        const caughtIds = tracker.getCaught();
        filteredPokemon = filteredPokemon.filter(pokemon => caughtIds.includes(pokemon.id));
    }

    if (searchTerm) {
        filteredPokemon = filteredPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    }

    if (selectedGeneration) {
        filteredPokemon = filteredPokemon.filter(pokemon => pokemon.generation === selectedGeneration);
    }

    if (selectedTypes.length > 0) {
        filteredPokemon = filteredPokemon.filter(pokemon => {
            const pokemonTypes = pokemon.types.map(typeInfo => typeInfo.type.name);
            return selectedTypes.every(selectedType => pokemonTypes.includes(selectedType));
        });
    }

    return filteredPokemon;
}
