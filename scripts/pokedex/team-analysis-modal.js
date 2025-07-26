import { analyzeTeam } from './team-analyzer.js';
import { allPokemon } from './state.js';
import PokemonService from './pokemon.js';

const pokemonService = new PokemonService();

const modal = document.getElementById('team-analysis-modal');
const modalContent = document.getElementById('team-analysis-content');
const closeModalBtn = modal.querySelector('.close-button');

function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

export async function openTeamAnalysisModal(team) {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    modalContent.innerHTML = '<h2>Analyzing Team...</h2>';

    const teamDetails = team.map(p => allPokemon.find(ap => ap.id === p.id));
    const analysis = await analyzeTeam(teamDetails);
    const allTypes = await pokemonService.getTypes();

    renderAnalysis(analysis, teamDetails, allTypes);
}

function renderAnalysis(analysis, teamDetails, allTypes) {
    let content = '<h2>Team Defensive Analysis</h2>';
    
    const tableHead = `
        <thead>
            <tr>
                <th>Type</th>
                ${teamDetails.map(p => `<th><img src="${p.sprite}" class="team-analysis-sprite" alt="${p.name}"></th>`).join('')}
            </tr>
        </thead>
    `;

    const tableBodyRows = allTypes.map(type => {
        const typeName = type.name;
        const cells = teamDetails.map(pokemon => {
            let effectivenessClass = '';
            if (analysis.weaknesses[typeName]?.includes(pokemon.name)) {
                effectivenessClass = 'weak';
            } else if (analysis.resistances[typeName]?.includes(pokemon.name)) {
                effectivenessClass = 'resist';
            } else if (analysis.immunities[typeName]?.includes(pokemon.name)) {
                effectivenessClass = 'immune';
            }
            return `<td class="${effectivenessClass}"></td>`;
        }).join('');

        return `
            <tr>
                <td><img src="images/pokedex-assets/icons/${typeName}.svg" alt="${typeName}" class="type-badge-small"></td>
                ${cells}
            </tr>
        `;
    }).join('');

    content += `<table class="team-analysis-table">${tableHead}<tbody>${tableBodyRows}</tbody></table>`;
    modalContent.innerHTML = content;
}
