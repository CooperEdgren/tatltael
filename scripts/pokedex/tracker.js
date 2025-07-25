const CAUGHT_KEY = 'caughtPokemon';
const SEEN_KEY = 'seenPokemon';

function getFromStorage(key) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Caught functionality
export function isCaught(pokemonId) {
    return getFromStorage(CAUGHT_KEY).includes(pokemonId);
}

export function toggleCaught(pokemonId) {
    let caught = getFromStorage(CAUGHT_KEY);
    if (caught.includes(pokemonId)) {
        caught = caught.filter(id => id !== pokemonId);
    } else {
        caught.push(pokemonId);
        // A Pokémon that is caught must also have been seen
        if (!isSeen(pokemonId)) {
            toggleSeen(pokemonId);
        }
    }
    saveToStorage(CAUGHT_KEY, caught);
}

export function getCaught() {
    return getFromStorage(CAUGHT_KEY);
}

// Seen functionality
export function isSeen(pokemonId) {
    return getFromStorage(SEEN_KEY).includes(pokemonId);
}

export function toggleSeen(pokemonId) {
    let seen = getFromStorage(SEEN_KEY);
    if (seen.includes(pokemonId)) {
        // If it's unseen, it cannot be caught
        if (isCaught(pokemonId)) {
            toggleCaught(pokemonId);
        }
        seen = seen.filter(id => id !== pokemonId);
    } else {
        seen.push(pokemonId);
    }
    saveToStorage(SEEN_KEY, seen);
}

export function getSeen() {
    return getFromStorage(SEEN_KEY);
}
