// js/filter-manager.js
import { UI } from './ui.js';
import PokemonService from './pokemon.js';

const ui = new UI();
const pokemonService = new PokemonService();

export function setupFilters(generationContainer, typeContainer, trackingContainer, onFilterChange) {
    ui.renderGenerationFilters(generationContainer);
    ui.renderTrackingFilters(trackingContainer);
    pokemonService.getTypes().then(types => {
        ui.renderTypeFilters(types, typeContainer);
    });

    const handleFilterClick = (event, container, buttonClass) => {
        const target = event.target.closest(buttonClass);
        if (target) {
            if (container === typeContainer || container === trackingContainer) {
                target.classList.toggle('active');
            } else {
                if (target.classList.contains('active')) {
                    target.classList.remove('active');
                } else {
                    const buttons = container.querySelectorAll(buttonClass);
                    buttons.forEach(btn => btn.classList.remove('active'));
                    target.classList.add('active');
                }
            }
            onFilterChange();
        }
    };

    generationContainer.addEventListener('click', (e) => {
        handleFilterClick(e, generationContainer, '.generation-filter-btn');
    });

    typeContainer.addEventListener('click', (e) => {
        handleFilterClick(e, typeContainer, '.type-filter-btn');
    });

    if (trackingContainer) {
        trackingContainer.addEventListener('click', (e) => {
            handleFilterClick(e, trackingContainer, '.tracking-filter-btn');
        });
    }
}
