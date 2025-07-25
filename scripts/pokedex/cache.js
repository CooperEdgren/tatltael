const cache = new Map();

export function has(key) {
    return cache.has(key);
}

export function get(key) {
    return cache.get(key);
}

export function set(key, value) {
    cache.set(key, value);
}

export function clear() {
    cache.clear();
}
