const FAVORITES_KEY = 'pokedex-favorites';

let favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);

function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
}

export function isFavorite(pokemonId) {
    return favorites.has(pokemonId);
}

export function addFavorite(pokemonId) {
    if (!isFavorite(pokemonId)) {
        favorites.add(pokemonId);
        saveFavorites();
    }
}

export function removeFavorite(pokemonId) {
    if (isFavorite(pokemonId)) {
        favorites.delete(pokemonId);
        saveFavorites();
    }
}

export function toggleFavorite(pokemonId) {
    if (isFavorite(pokemonId)) {
        removeFavorite(pokemonId);
    } else {
        addFavorite(pokemonId);
    }
}

export function getFavorites() {
    return Array.from(favorites);
}
