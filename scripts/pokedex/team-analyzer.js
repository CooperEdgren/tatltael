// js/team-analyzer.js
import PokemonService from './pokemon.js';

const pokemonService = new PokemonService();

export async function analyzeTeam(team) {
    if (team.length === 0) {
        return { weaknesses: {}, resistances: {}, immunities: {} };
    }

    const allTypeEffectiveness = await Promise.all(
        team.map(p => pokemonService.getPokemonTypeEffectiveness(p))
    );

    const typeInteractions = {
        weaknesses: {},
        resistances: {},
        immunities: {}
    };

    const allTypes = await pokemonService.getTypes();

    allTypes.forEach(type => {
        typeInteractions.weaknesses[type.name] = 0;
        typeInteractions.resistances[type.name] = 0;
        typeInteractions.immunities[type.name] = 0;
    });

    allTypeEffectiveness.forEach(effectiveness => {
        effectiveness.weaknesses.forEach(type => {
            typeInteractions.weaknesses[type]++;
        });
        effectiveness.resistances.forEach(type => {
            typeInteractions.resistances[type]++;
        });
        effectiveness.immunities.forEach(type => {
            typeInteractions.immunities[type]++;
        });
    });

    return typeInteractions;
}
