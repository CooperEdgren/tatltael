import { POKEAPI_BASE_URL, SUPPORTED_GAMES } from './constants.js';
import * as cache from './cache.js';

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

    async getPokemon(limit) {
        const data = await this._fetch(`pokemon?limit=${limit}`);
        const pokemonDetailsPromises = data.results.map(async (p) => {
            const details = await this.getPokemonDetails(p.name);
            const species = await this.getPokemonSpecies(details.id);
            const generationUrl = species.generation.url;
            const generationId = parseInt(generationUrl.split('/').slice(-2, -1)[0]);
            return {
                id: details.id,
                name: details.name,
                primaryType: details.types[0].type.name,
                types: details.types,
                generation: generationId,
                sprite: details.sprites.front_default,
                shinySprite: details.sprites.front_shiny,
                url: p.url
            };
        });
        return Promise.all(pokemonDetailsPromises);
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
        return this._fetch(evolutionChainUrl);
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

