export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';
export const POKEMON_LIMIT = 649;
export const MAX_GENERATION = 5;
export const MAX_STAT_VALUE = 255;
export const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
export const LANGUAGE_ENGLISH = 'en';

export const SUPPORTED_GAMES = [
    'red', 'blue', 'yellow', 'gold', 'silver', 'crystal', 
    'ruby', 'sapphire', 'emerald', 'firered', 'leafgreen',
    'diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver',
    'black', 'white', 'black-2', 'white-2'
];

export const DELTA_GAMES = [
    { name: 'Pokémon Red', url: 'delta://game/ea9bcae617fdf159b045185467ae58b2e4a48b9a' },
    { name: 'Pokémon Yellow', url: 'delta://game/cc7d03262ebfaf2f06772c1a480c7d9d5f4a38e1' },
    { name: 'Pokémon Crystal', url: 'delta://game/f2f52230b536214ef7c9924f483392993e226cfb' },
    { name: 'Pokémon FireRed', url: 'delta://game/dd5945db9b930750cb39d00c84da8571feebf417' },
    { name: 'Pokémon Ruby', url: 'delta://game/5b64eacf892920518db4ec664e62a086dd5f5bc8' },
    { name: 'Pokémon Platinum', url: 'delta://game/0862ec35b24de5c7e2dcb88c9eea0873110d755c' },
    { name: 'Pokémon SoulSilver', url: 'delta://game/ef7564d8e15c40a0b9a3a7e96cb02f53e8a9700b' },
    { name: 'Pokémon Black', url: 'delta://game/a68b3bedf5c1e53556e41e59cdf396c20b331896' },
    { name: 'Pokémon Black 2', url: 'delta://game/42f7a3daf0601064c9067a6a2903a83ec081442b' }
];

export const POKEBALLS = [
    {
        name: 'Poke Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
        description: 'A device for catching wild Pokémon. It is designed as a capsule for storing a Pokémon.',
        modifier: '1x'
    },
    {
        name: 'Great Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
        description: 'A good, high-performance Poké Ball that provides a higher catch rate than a standard Poké Ball.',
        modifier: '1.5x'
    },
    {
        name: 'Ultra Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
        description: 'An ultra-high performance Poké Ball that provides a higher catch rate than a Great Ball.',
        modifier: '2x'
    },
    {
        name: 'Master Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
        description: 'The best Poké Ball with the ultimate performance. It will catch any wild Pokémon without fail.',
        modifier: '255x'
    },
    {
        name: 'Safari Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png',
        description: 'A special Poké Ball that is used only in the Safari Zone.',
        modifier: '1.5x'
    },
    {
        name: 'Net Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/net-ball.png',
        description: 'A Poké Ball that is more effective when catching Water- and Bug-type Pokémon.',
        modifier: '3.5x (Water/Bug), 1x (other)'
    },
    {
        name: 'Dive Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dive-ball.png',
        description: 'A Poké Ball that is more effective when catching Pokémon in the ocean or while surfing.',
        modifier: '3.5x (underwater), 1x (other)'
    },
    {
        name: 'Nest Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nest-ball.png',
        description: 'A Poké Ball that is more effective when catching a weaker Pokémon in the wild.',
        modifier: 'varies (weaker Pokémon)'
    },
    {
        name: 'Repeat Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/repeat-ball.png',
        description: 'A Poké Ball that is more effective when catching a Pokémon that you have already caught.',
        modifier: '3.5x (already caught)'
    },
    {
        name: 'Timer Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/timer-ball.png',
        description: 'A Poké Ball that becomes more effective the more turns that pass in a battle.',
        modifier: 'varies (longer battle)'
    },
    {
        name: 'Luxury Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png',
        description: 'A comfortable Poké Ball that makes a caught Pokémon more friendly.',
        modifier: '1x'
    },
    {
        name: 'Premier Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png',
        description: 'A somewhat rare Poké Ball that has been made in commemoration of some event.',
        modifier: '1x'
    },
    {
        name: 'Dusk Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png',
        description: 'A Poké Ball that is more effective when catching Pokémon at night or in caves.',
        modifier: '3.5x (night/cave), 1x (other)'
    },
    {
        name: 'Heal Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heal-ball.png',
        description: 'A comforting Poké Ball that restores the HP and cures any status conditions of a Pokémon caught with it.',
        modifier: '1x'
    },
    {
        name: 'Quick Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-ball.png',
        description: 'A Poké Ball that is more effective the earlier in a battle that it is used.',
        modifier: '5x (first turn), 1x (other)'
    },
    {
        name: 'Fast Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fast-ball.png',
        description: 'A Poké Ball that is more effective when attempting to catch a Pokémon that is quick to flee.',
        modifier: '4x (fast Pokémon)'
    },
    {
        name: 'Level Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/level-ball.png',
        description: 'A Poké Ball that is more effective the lower the level of the wild Pokémon compared to your own.',
        modifier: 'varies (lower level Pokémon)'
    },
    {
        name: 'Lure Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png',
        description: 'A Poké Ball that is more effective when attempting to catch a Pokémon that has been hooked by a fishing rod.',
        modifier: '3x (fishing)'
    },
    {
        name: 'Heavy Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heavy-ball.png',
        description: 'A Poké Ball that is more effective when attempting to catch a very heavy Pokémon.',
        modifier: 'varies (heavy Pokémon)'
    },
    {
        name: 'Love Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/love-ball.png',
        description: 'A Poké Ball that is more effective when attempting to catch a Pokémon of the opposite gender as your own.',
        modifier: '8x (opposite gender)'
    },
    {
        name: 'Friend Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png',
        description: 'A peculiar Poké Ball that makes a caught Pokémon more friendly.',
        modifier: '1x'
    },
    {
        name: 'Moon Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png',
        description: 'A Poké Ball that is more effective when attempting to catch a Pokémon that evolves with a Moon Stone.',
        modifier: '3.5x (Moon Stone evo)'
    },
    {
        name: 'Sport Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sport-ball.png',
        description: 'A special Poké Ball that is used only in the Bug-Catching Contest.',
        modifier: '1.5x'
    },
    {
        name: 'Dream Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-ball.png',
        description: 'A Poké Ball that is used only in the Entree Forest.',
        modifier: '255x'
    },
    {
        name: 'Beast Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beast-ball.png',
        description: 'A special Poké Ball designed to catch Ultra Beasts. It has a low success rate for other Pokémon.',
        modifier: '5x (Ultra Beast), 0.1x (other)'
    },
    {
        name: 'Cherish Ball',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png',
        description: 'A rare Poké Ball that has been made in commemoration of some event.',
        modifier: '1x'
    }
];