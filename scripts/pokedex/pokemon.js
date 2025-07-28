import { POKEAPI_BASE_URL, SUPPORTED_GAMES } from './constants.js';
import * as cache from './cache.js';
import * as dbCache from './cache-db.js';

class PokeApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'PokeApiError';
        this.status = status;
    }
}

export default class PokemonService {
    constructor() {
        this.baseUrl = POKEAPI_BASE_URL;
    }

    _formatPokemon(pokemon) {
        if (pokemon.name === 'nidoran-f') {
            pokemon.name = 'Nidoran♀';
        } else if (pokemon.name === 'nidoran-m') {
            pokemon.name = 'Nidoran♂';
        }
        return pokemon;
    }

    async _fetch(endpoint) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        if (cache.has(url)) {
            return cache.get(url);
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new PokeApiError(`Failed to fetch ${url}: ${response.statusText}`, response.status);
            }
            const data = await response.json();
            cache.set(url, data);
            return data;
        } catch (error) {
            if (error instanceof PokeApiError) {
                console.error(error.message);
            } else {
                console.error(`An unexpected error occurred while fetching from ${url}:`, error);
            }
            throw error;
        }
    }

    async getPokemon(limit, offset = 0) {
        const data = await this._fetch(`pokemon?limit=${limit}&offset=${offset}`);
        const pokemonDetailsPromises = data.results.map(async (p) => {
            const details = await this.getPokemonDetails(p.name);
            const species = await this.getPokemonSpecies(details.id);
            const generationUrl = species.generation.url;
            const generationId = parseInt(generationUrl.split('/').slice(-2, -1)[0]);
            const animatedSprite = details.sprites.versions['generation-v']['black-white'].animated.front_default;
            const animatedShinySprite = details.sprites.versions['generation-v']['black-white'].animated.front_shiny;
            return {
                id: details.id,
                name: details.name,
                primaryType: details.types[0].type.name,
                types: details.types,
                generation: generationId,
                sprite: details.sprites.front_default,
                shinySprite: details.sprites.front_shiny,
                animatedSprite: animatedSprite,
                animatedShinySprite: animatedShinySprite,
                url: p.url
            };
        });
        return Promise.all(pokemonDetailsPromises);
    }

    async getPokemonList(limit, offset = 0) {
        const data = await this._fetch(`pokemon?limit=${limit}&offset=${offset}`);
        return data.results;
    }

    async getPokemonComplete(id) {
        let cachedData = await dbCache.get(id);
        
        // If the cached evolutionChain is an array, it's the old format. Invalidate and refetch.
        if (cachedData && Array.isArray(cachedData.evolutionChain)) {
            cachedData = null; // Force a full refetch
        }

        if (cachedData) {
            return cachedData;
        }

        const pokemon = await this.getPokemonDetails(id);
        const species = await this.getPokemonSpecies(id);
        const rawEncounters = await this.getPokemonEncounters(id);
        const encounters = this.processEncounters(rawEncounters);
        const evolutionChain = await this.getEvolutionChain(species.evolution_chain.url);
        const typeEffectiveness = await this.getPokemonTypeEffectiveness(pokemon);

        const completeData = {
            pokemon,
            species,
            encounters,
            evolutionChain,
            typeEffectiveness,
            isCatchableInWild: rawEncounters && rawEncounters.length > 0
        };

        await dbCache.set(id, completeData);
        return completeData;
    }

    async getPokemonDetails(id) {
        const pokemon = await this._fetch(`pokemon/${id}`);
        return this._formatPokemon(pokemon);
    }

    async getPokemonSpecies(id) {
        return this._fetch(`pokemon-species/${id}`);
    }

    async getTypes() {
        const cacheKey = 'types';
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        const data = await this._fetch('type');
        const types = data.results.filter(type => type.name !== 'stellar' && type.name !== 'unknown');
        cache.set(cacheKey, types);
        return types;
    }

    async getPokemonByType(type) {
        const data = await this._fetch(`type/${type}`);
        return data.pokemon.map(p => p.pokemon);
    }

    async getPokemonEncounters(id) {
        try {
            return await this._fetch(`pokemon/${id}/encounters`);
        } catch (error) {
            if (error instanceof PokeApiError && error.status === 404) {
                return []; // Return empty array if no encounters found, this is not an error.
            }
            throw error;
        }
    }

    processEncounters(encounters) {
        const processedEncounters = {};

        if (!encounters || encounters.length === 0) {
            return processedEncounters;
        }

        encounters.forEach(location => {
            const locationName = location.location_area.name.replace(/-/g, ' ');
            location.version_details.forEach(versionDetail => {
                const versionName = versionDetail.version.name.replace(/-/g, ' ');
                if (SUPPORTED_GAMES.includes(versionDetail.version.name)) {
                    if (!processedEncounters[versionName]) {
                        processedEncounters[versionName] = {};
                    }
                    versionDetail.encounter_details.forEach(encounter => {
                        const method = encounter.method.name.replace(/-/g, ' ');
                        const key = `${locationName}|${method}|${encounter.min_level}|${encounter.max_level}`;
                        
                        if (!processedEncounters[versionName][key]) {
                            processedEncounters[versionName][key] = {
                                location: locationName,
                                method: method,
                                chance: 0,
                                min_level: encounter.min_level,
                                max_level: encounter.max_level
                            };
                        }
                        processedEncounters[versionName][key].chance += encounter.chance;
                    });
                }
            });
        });

        for (const version in processedEncounters) {
            processedEncounters[version] = Object.values(processedEncounters[version]);
        }

        return processedEncounters;
    }

    async getEvolutionChain(evolutionChainUrl) {
        const evolutionData = await this._fetch(evolutionChainUrl);
        return this.parseEvolutionChain(evolutionData.chain);
    }

    parseEvolutionChain(chain) {
        const traverse = (node) => {
            if (!node) return null;
            const speciesId = node.species.url.split('/').slice(-2, -1)[0];
            
            return {
                species_name: node.species.name,
                species_id: speciesId,
                trigger: node.evolution_details.length > 0 ? this.formatEvolutionTrigger(node.evolution_details[0]) : null,
                evolves_to: node.evolves_to.map(nextNode => traverse(nextNode))
            };
        };
        
        const rootId = chain.species.url.split('/').slice(-2, -1)[0];
        return {
             species_name: chain.species.name,
             species_id: rootId,
             trigger: null,
             evolves_to: chain.evolves_to.map(node => traverse(node))
        };
    }

    formatEvolutionTrigger(details) {
        if (!details) return null;
    
        const triggerName = details.trigger.name.replace(/-/g, ' ');
        const conditions = [];
    
        let primaryCondition = triggerName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        if (triggerName === 'level up') {
            primaryCondition = details.min_level ? `Lvl ${details.min_level}` : 'Level Up';
        } else if (triggerName === 'use item') {
            primaryCondition = `Use ${details.item.name.replace(/-/g, ' ')}`;
        } else if (triggerName === 'trade') {
            primaryCondition = details.trade_species ? `Trade for ${details.trade_species.name.replace(/-/g, ' ')}` : 'Trade';
        }
        
        if (details.min_happiness) conditions.push(`High Friendship`);
        if (details.time_of_day) conditions.push(details.time_of_day);
        if (details.held_item) conditions.push(`w/ ${details.held_item.name.replace(/-/g, ' ')}`);
        if (details.known_move) conditions.push(`knows ${details.known_move.name.replace(/-/g, ' ')}`);
        if (details.location) conditions.push(`at ${details.location.name.replace(/-/g, ' ')}`);
        if (details.gender === 1) conditions.push('Female');
        else if (details.gender === 2) conditions.push('Male');
        if (details.needs_overworld_rain) conditions.push('in rain');
    
        if (conditions.length > 0) {
            return `${primaryCondition} ${conditions.join(', ')}`;
        }
        
        return primaryCondition;
    }

    async getTypeDetails(typeName) {
        return this._fetch(`type/${typeName}`);
    }

    async getPokemonTypeEffectiveness(pokemon) {
        const typeDetailsPromises = pokemon.types.map(typeInfo => this.getTypeDetails(typeInfo.type.name));
        const typeDetails = await Promise.all(typeDetailsPromises);

        const effectiveness = {
            double_damage_from: [],
            half_damage_from: [],
            no_damage_from: []
        };

        typeDetails.forEach(details => {
            effectiveness.double_damage_from.push(...details.damage_relations.double_damage_from.map(t => t.name));
            effectiveness.half_damage_from.push(...details.damage_relations.half_damage_from.map(t => t.name));
            effectiveness.no_damage_from.push(...details.damage_relations.no_damage_from.map(t => t.name));
        });

        return {
            weaknesses: [...new Set(effectiveness.double_damage_from)],
            resistances: [...new Set(effectiveness.half_damage_from)],
            immunities: [...new Set(effectiveness.no_damage_from)]
        };
    }
}

