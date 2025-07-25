const BADGES_KEY_PREFIX = 'unlocked_badges_gen_';

function getUnlockedBadges(generation) {
    const key = `${BADGES_KEY_PREFIX}${generation}`;
    const stored = localStorage.getItem(key);
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

function saveUnlockedBadges(generation, badges) {
    const key = `${BADGES_KEY_PREFIX}${generation}`;
    localStorage.setItem(key, JSON.stringify(Array.from(badges)));
}

export function isBadgeUnlocked(generation, badgeName) {
    return getUnlockedBadges(generation).has(badgeName);
}

export function unlockBadge(generation, badgeName) {
    const unlockedBadges = getUnlockedBadges(generation);
    if (!unlockedBadges.has(badgeName)) {
        unlockedBadges.add(badgeName);
        saveUnlockedBadges(generation, unlockedBadges);
    }
}

export function lockBadge(generation, badgeName) {
    const unlockedBadges = getUnlockedBadges(generation);
    if (unlockedBadges.has(badgeName)) {
        unlockedBadges.delete(badgeName);
        saveUnlockedBadges(generation, unlockedBadges);
    }
}
