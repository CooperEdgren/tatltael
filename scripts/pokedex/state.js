// state.js
// This file defines the central data structures for the application's state.

/**
 * Represents a single Pokémon.
 * This structure is used for party members, PC Pokémon, and wild encounters.
 */
class Pokemon {
    constructor({
        id = 0,
        species = 'Unknown',
        nickname = '',
        level = 1,
        nature = 'Hardy',
        heldItem = null,
        ability = '',
        moves = [],
        stats = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        ivs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        metLocation = 'Unknown',
        isShiny = false,
        pokerus = false,
        gender = 'genderless',
        pokeball = 'Pokeball'
    } = {}) {
        this.id = id;
        this.species = species;
        this.nickname = nickname || species;
        this.level = level;
        this.nature = nature;
        this.heldItem = heldItem; // Should be an Item object
        this.ability = ability;
        this.moves = moves; // Should be an array of Move objects
        this.stats = stats;
        this.ivs = ivs;
        this.evs = evs;
        this.metLocation = metLocation;
        this.isShiny = isShiny;
        this.pokerus = pokerus;
        this.gender = gender;
        this.pokeball = pokeball;
    }
}

/**
 * Represents a single move.
 */
class Move {
    constructor({ name = 'Tackle', type = 'Normal', power = 40, accuracy = 100, pp = 35, category = 'physical' } = {}) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
        this.category = category; // physical, special, or status
    }
}

/**
 * Represents a single item.
 */
class Item {
    constructor({ name = 'Potion', description = 'Restores HP by 20.', quantity = 1 } = {}) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
    }
}

/**
 * Represents the player's trainer data.
 */
class Trainer {
    constructor({
        name = 'Trainer',
        id = '00000',
        secretId = '00000',
        money = 3000,
        bag = {
            items: [],       // General items
            keyItems: [],
            pokeballs: [],
            tms: [],
            berries: []
        }
    } = {}) {
        this.name = name;
        this.id = id;
        this.secretId = secretId;
        this.money = money;
        this.bag = bag; // Bag will contain arrays of Item objects
    }
}

/**
 * Represents the Pokémon storage system (PC).
 */
class PC {
    constructor(boxCount = 12, boxSize = 30) {
        this.boxes = [];
        for (let i = 0; i < boxCount; i++) {
            this.boxes.push({
                name: `Box ${i + 1}`,
                pokemon: new Array(boxSize).fill(null) // Array of Pokemon objects or null
            });
        }
    }
}

// This will hold the list of all Pokémon fetched from the API for the main Pokedex view.
export let allPokemon = [];
export const setAllPokemon = (newPokemonList) => {
    allPokemon = newPokemonList;
};


// The global application state object
const appState = {
    trainer: new Trainer(),
    party: new Array(6).fill(null), // Array of Pokemon objects or null
    pc: new PC(),
    pokedex: {
        seen: new Set(),
        caught: new Set()
    },
    gameVersion: 'Unknown',
    isSaveLoaded: false,

    /**
     * Loads data from a parsed save file into the application state.
     * @param {object} parsedData The data object from the save file parser.
     */
    loadFromSave(parsedData) {
        this.trainer.name = parsedData.TrainerName || 'Trainer';
        this.gameVersion = parsedData.GameVersion || 'Unknown';
        
        // Clear existing party and load new party data
        this.party = new Array(6).fill(null);
        if (parsedData.Party && parsedData.Party.length > 0) {
            parsedData.Party.forEach((pkm, index) => {
                if (index < 6) {
                    this.party[index] = new Pokemon({
                        id: pkm.SpeciesId,
                        species: 'Unknown', // This would be filled in by a call to the PokeAPI
                        nickname: pkm.Nickname,
                        level: pkm.Level,
                        moves: pkm.Moves.map(moveName => new Move({ name: moveName })),
                        ivs: {
                            hp: pkm.IVs[0], attack: pkm.IVs[1], defense: pkm.IVs[2],
                            spAttack: pkm.IVs[4], spDefense: pkm.IVs[5], speed: pkm.IVs[3]
                        },
                        evs: {
                            hp: pkm.EVs[0], attack: pkm.EVs[1], defense: pkm.EVs[2],
                            spAttack: pkm.EVs[4], spDefense: pkm.EVs[5], speed: pkm.EVs[3]
                        },
                        nature: pkm.Nature
                    });
                }
            });
        }

        // In a full implementation, you would also load PC, Pokedex, Bag, etc.
        
        this.isSaveLoaded = true;
        console.log("Application state loaded from save file.", this);
    }
};

// Export the state to be used as a module by other parts of the application.
export default appState;
