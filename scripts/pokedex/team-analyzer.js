// js/team-analyzer.js
import PokemonService from './pokemon.js';

const pokemonService = new PokemonService();

export async function analyzeTeam(team) {
    if (team.length === 0) {
        return { weaknesses: {}, resistances: {}, immunities: {} };
    }

    const allTypeEffectiveness = await Promise.all(
        team.map(async (p) => {
            const effectiveness = await pokemonService.getPokemonTypeEffectiveness(p);
            return { pokemon: p, effectiveness };
        })
    );

    const typeInteractions = {
        weaknesses: {},
        resistances: {},
        immunities: {}
    };

    const allTypes = await pokemonService.getTypes();

    allTypes.forEach(type => {
        typeInteractions.weaknesses[type.name] = [];
        typeInteractions.resistances[type.name] = [];
        typeInteractions.immunities[type.name] = [];
    });

    allTypeEffectiveness.forEach(({ pokemon, effectiveness }) => {
        effectiveness.weaknesses.forEach(type => {
            typeInteractions.weaknesses[type].push(pokemon.name);
        });
        effectiveness.resistances.forEach(type => {
            typeInteractions.resistances[type].push(pokemon.name);
        });
        effectiveness.immunities.forEach(type => {
            typeInteractions.immunities[type].push(pokemon.name);
        });
    });

    return typeInteractions;
}
