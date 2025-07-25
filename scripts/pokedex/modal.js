let ui;
let pokemonService;

let isAnimating = false;
let lastClickedCard = null;
let scrollPosition = 0;
let currentModalPokemonId = null;
let originalHeaderText = '';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// This function animates the elements on the page when a modal is opened or closed.
// It creates a "zoom in" effect from the clicked card.
function animateElements(originCard, reverse = false) {
    const pokedexContainer = document.getElementById('pokedex');
    const searchBar = document.getElementById('search-bar');
    const generationFilterContainer = document.getElementById('generation-filter-container');
    const typeFilterContainer = document.getElementById('type-filter-container');
    const shinyToggleBtn = document.getElementById('shiny-toggle');

    const elementsToAnimate = [
        ...pokedexContainer.querySelectorAll('.pokemon-card'),
        searchBar,
        generationFilterContainer,
        typeFilterContainer,
        shinyToggleBtn
    ];

    const originRect = originCard.getBoundingClientRect();
    const originX = originRect.left + originRect.width / 2;
    const originY = originRect.top + originRect.height / 2;

    // Calculate a delay for each element based on its distance from the clicked card.
    elementsToAnimate.forEach(el => {
        el.style.transitionDelay = '0s';
        if (el === originCard) return;

        const elRect = el.getBoundingClientRect();
        const elX = elRect.left + elRect.width / 2;
        const elY = elRect.top + elRect.height / 2;
        const distance = Math.sqrt(Math.pow(elX - originX, 2) + Math.pow(elY - originY, 2));
        const delay = distance / 4000;
        
        el.style.transitionDelay = `${delay}s`;
        el.classList.toggle('hide', !reverse);
    });
}

export async function openModal(pokemonId, basicPokemonInfo, card) {
    if (isAnimating) return;
    isAnimating = true;
    currentModalPokemonId = pokemonId;

    const modal = document.getElementById('pokemon-modal');
    const body = document.body;
    const transitionOverlay = document.getElementById('transition-overlay');
    const animatedSpriteContainer = document.getElementById('animated-sprite-container');

    if (card) {
        lastClickedCard = card;
        scrollPosition = window.scrollY;
        card.classList.add('hide-content');
        animateElements(card, false);

        const cardRect = card.getBoundingClientRect();
        const cardStyle = getComputedStyle(card);
        const cardBgColor = cardStyle.backgroundColor;
        const cardImage = card.querySelector('img');
        const cardImageRect = cardImage.getBoundingClientRect();

        // Render the initial modal with only basic info and loading placeholders
        ui.renderPokemonDetail(basicPokemonInfo, null, null, null, null, false, true);
        modal.style.display = 'block';
        modal.style.visibility = 'hidden';

        await sleep(50);

        const modalSprite = document.querySelector('.modal-sprite');
        const modalSpriteRect = modalSprite.getBoundingClientRect();
        const detailsPane = document.querySelector('.details-content-pane');
        const detailsPaneRect = detailsPane.getBoundingClientRect();
        const detailsPaneStyle = getComputedStyle(detailsPane);
        const detailsPaneBgColor = detailsPaneStyle.backgroundColor;
        const detailsPaneRadius = detailsPaneStyle.borderRadius;

        // Animate the sprite from the card to the modal.
        const animatedSprite = cardImage.cloneNode(true);
        animatedSpriteContainer.innerHTML = '';
        animatedSpriteContainer.appendChild(animatedSprite);
        animatedSpriteContainer.style.top = `${cardImageRect.top}px`;
        animatedSpriteContainer.style.left = `${cardImageRect.left}px`;
        animatedSpriteContainer.style.width = `${cardImageRect.width}px`;
        animatedSpriteContainer.style.height = `${cardImageRect.height}px`;

        // Animate the background color from the card to the modal.
        transitionOverlay.style.backgroundColor = cardBgColor;
        transitionOverlay.style.top = `${cardRect.top}px`;
        transitionOverlay.style.left = `${cardRect.left}px`;
        transitionOverlay.style.width = `${cardRect.width}px`;
        transitionOverlay.style.height = `${cardRect.height}px`;
        transitionOverlay.style.borderRadius = cardStyle.borderRadius;
        transitionOverlay.style.opacity = '1';

        card.style.visibility = 'hidden';

        requestAnimationFrame(() => {
            transitionOverlay.style.backgroundColor = detailsPaneBgColor;
            transitionOverlay.style.top = `${detailsPaneRect.top}px`;
            transitionOverlay.style.left = `${detailsPaneRect.left}px`;
            transitionOverlay.style.width = `${detailsPaneRect.width}px`;
            transitionOverlay.style.height = `${detailsPaneRect.height}px`;
            transitionOverlay.style.borderRadius = detailsPaneRadius;

            animatedSpriteContainer.style.top = `${modalSpriteRect.top}px`;
            animatedSpriteContainer.style.left = `${modalSpriteRect.left}px`;
            animatedSpriteContainer.style.width = `${modalSpriteRect.width}px`;
            animatedSpriteContainer.style.height = `${modalSpriteRect.height}px`;
        });

        await sleep(500);

        modal.style.visibility = 'visible';
        detailsPane.classList.add('show-content');
        document.documentElement.classList.add('modal-open');
        body.classList.add('modal-open');
        ui.setHeaderTitle(basicPokemonInfo.name);
        animatedSpriteContainer.innerHTML = '';
        transitionOverlay.style.opacity = '0';
    } else {
        // This case is for when we don't have a card to animate from, e.g., evolution click
        ui.renderPokemonDetail(basicPokemonInfo, null, null, null, null, false, true);
        ui.setHeaderTitle(basicPokemonInfo.name);
        const detailsPane = document.querySelector('.details-content-pane');
        detailsPane.classList.add('show-content');
        modal.style.display = 'block';
        document.documentElement.classList.add('modal-open');
        body.classList.add('modal-open');
    }
    
    isAnimating = false;
}

export async function closeModal() {
    if (isAnimating) return;

    const modal = document.getElementById('pokemon-modal');
    const body = document.body;
    const card = document.querySelector(`.pokemon-card[data-id="${currentModalPokemonId}"]`);

    if (!card || !lastClickedCard) {
        modal.style.display = 'none';
        body.classList.remove('modal-open');
        ui.setHeaderTitle(originalHeaderText);
        currentModalPokemonId = null;
        lastClickedCard = null;
        return;
    }

    isAnimating = true;

    animateElements(card, true);

    const detailsPane = document.querySelector('.details-content-pane');
    detailsPane.classList.remove('show-content');

    await sleep(100);

    const cardRect = card.getBoundingClientRect();
    const cardStyle = getComputedStyle(card);
    const cardBgColor = cardStyle.backgroundColor;
    const cardImage = card.querySelector('img');
    const cardImageRect = cardImage.getBoundingClientRect();

    const modalSprite = document.querySelector('.modal-sprite');
    const modalSpriteRect = modalSprite.getBoundingClientRect();
    const detailsPaneRect = detailsPane.getBoundingClientRect();
    const detailsPaneStyle = getComputedStyle(detailsPane);
    const detailsPaneBgColor = detailsPaneStyle.backgroundColor;
    const detailsPaneRadius = detailsPaneStyle.borderRadius;

    const transitionOverlay = document.getElementById('transition-overlay');
    transitionOverlay.style.backgroundColor = detailsPaneBgColor;
    transitionOverlay.style.top = `${detailsPaneRect.top}px`;
    transitionOverlay.style.left = `${detailsPaneRect.left}px`;
    transitionOverlay.style.width = `${detailsPaneRect.width}px`;
    transitionOverlay.style.height = `${detailsPaneRect.height}px`;
    transitionOverlay.style.borderRadius = detailsPaneRadius;
    transitionOverlay.style.opacity = '1';

    const animatedSpriteContainer = document.getElementById('animated-sprite-container');
    const animatedSprite = modalSprite.cloneNode(true);
    animatedSpriteContainer.innerHTML = '';
    animatedSpriteContainer.appendChild(animatedSprite);
    animatedSpriteContainer.style.top = `${modalSpriteRect.top}px`;
    animatedSpriteContainer.style.left = `${modalSpriteRect.left}px`;
    animatedSpriteContainer.style.width = `${modalSpriteRect.width}px`;
    animatedSpriteContainer.style.height = `${modalSpriteRect.height}px`;

    modal.style.visibility = 'hidden';

    requestAnimationFrame(() => {
        transitionOverlay.style.backgroundColor = cardBgColor;
        transitionOverlay.style.top = `${cardRect.top}px`;
        transitionOverlay.style.left = `${cardRect.left}px`;
        transitionOverlay.style.width = `${cardRect.width}px`;
        transitionOverlay.style.height = `${cardRect.height}px`;
        transitionOverlay.style.borderRadius = cardStyle.borderRadius;

        animatedSpriteContainer.style.top = `${cardImageRect.top}px`;
        animatedSpriteContainer.style.left = `${cardImageRect.left}px`;
        animatedSpriteContainer.style.width = `${cardImageRect.width}px`;
        animatedSpriteContainer.style.height = `${cardImageRect.height}px`;
    });

    await sleep(500);

    modal.style.display = 'none';
    document.documentElement.classList.remove('modal-open');
    body.classList.remove('modal-open');
    ui.setHeaderTitle(originalHeaderText);
    window.scrollTo(0, scrollPosition);
    
    card.style.visibility = 'visible';
    card.classList.remove('hide-content');
    card.classList.remove('hide');

    if (lastClickedCard) {
        lastClickedCard.style.visibility = 'visible';
        lastClickedCard.classList.remove('hide-content');
    }

    animatedSpriteContainer.innerHTML = '';
    transitionOverlay.style.opacity = '0';
    lastClickedCard = null;
    currentModalPokemonId = null;
    isAnimating = false;
}

export function initModal(headerText, uiInstance, pokemonServiceInstance) {
    originalHeaderText = headerText;
    ui = uiInstance;
    pokemonService = pokemonServiceInstance;
    const modal = document.getElementById('pokemon-modal');
    const modalBody = document.getElementById('modal-body');
    const pokedexContainer = document.getElementById('pokedex');

    modal.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('.favorite-btn-modal');
        if (favoriteButton) {
            const pokemonId = parseInt(favoriteButton.dataset.id);
            favorites.toggleFavorite(pokemonId);
            favoriteButton.classList.toggle('is-favorite', favorites.isFavorite(pokemonId));
            const cardFavoriteBtn = pokedexContainer.querySelector(`.pokemon-card[data-id="${pokemonId}"] .favorite-btn`);
            if (cardFavoriteBtn) {
                cardFavoriteBtn.classList.toggle('is-favorite', favorites.isFavorite(pokemonId));
            }
            return;
        }

        const seenButton = event.target.closest('.seen-btn');
        if (seenButton) {
            const pokemonId = parseInt(seenButton.dataset.id);
            tracker.toggleSeen(pokemonId);
            seenButton.classList.toggle('is-seen', tracker.isSeen(pokemonId));
            const caughtButton = seenButton.parentElement.querySelector('.caught-btn');
            caughtButton.classList.toggle('is-caught', tracker.isCaught(pokemonId));
            const cardSeenBtn = pokedexContainer.querySelector(`.pokemon-card[data-id="${pokemonId}"] .seen-btn`);
            if (cardSeenBtn) {
                cardSeenBtn.classList.toggle('is-seen', tracker.isSeen(pokemonId));
                const cardCaughtBtn = cardSeenBtn.parentElement.querySelector('.caught-btn');
                cardCaughtBtn.classList.toggle('is-caught', tracker.isCaught(pokemonId));
            }
            return;
        }

        const caughtButton = event.target.closest('.caught-btn');
        if (caughtButton) {
            const pokemonId = parseInt(caughtButton.dataset.id);
            tracker.toggleCaught(pokemonId);
            caughtButton.classList.toggle('is-caught', tracker.isCaught(pokemonId));
            const seenButton = caughtButton.parentElement.querySelector('.seen-btn');
            seenButton.classList.toggle('is-seen', tracker.isSeen(pokemonId));
            const cardCaughtBtn = pokedexContainer.querySelector(`.pokemon-card[data-id="${pokemonId}"] .caught-btn`);
            if (cardCaughtBtn) {
                cardCaughtBtn.classList.toggle('is-caught', tracker.isCaught(pokemonId));
                const cardSeenBtn = cardCaughtBtn.parentElement.querySelector('.seen-btn');
                cardSeenBtn.classList.toggle('is-seen', tracker.isSeen(pokemonId));
            }
            return;
        }

        const shinyButton = event.target.closest('#modal-shiny-toggle');
        if (shinyButton) {
            const modalSprite = modalBody.querySelector('.modal-sprite');
            const isShiny = modalSprite.src === modalSprite.dataset.shinySprite;
            modalSprite.src = isShiny ? modalSprite.dataset.sprite : modalSprite.dataset.shinySprite;
            shinyButton.classList.toggle('active', !isShiny);
            return;
        }

        const sprite = event.target.closest('.modal-sprite');
        if (sprite) {
            const pokemonName = sprite.dataset.pokemonName.toLowerCase().replace(/♀/g, '-f').replace(/♂/g, '-m');
            const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName}.mp3`;
            const cryAudio = document.getElementById('pokemon-cry-audio');
            cryAudio.src = cryUrl;
            cryAudio.play();
            return;
        }

        if (event.target.matches('.close-button')) {
            if (modal.classList.contains('compare-modal')) {
                ui.closeCompareModal();
                ui.showMenuButton();
                ui.setHeaderTitle(originalHeaderText);
                ui.modalBody = document.getElementById('modal-body');
            } else {
                closeModal();
            }
        }
    });

    document.addEventListener('pokemonDetailsLoaded', (event) => {
        const { pokemon, species, encounters, evolutionChain, typeEffectiveness, isCatchableInWild } = event.detail;
        if (pokemon.id === currentModalPokemonId) {
            // Re-render the detail view with the complete data
            ui.renderPokemonDetail(pokemon, species, encounters, evolutionChain, typeEffectiveness, isCatchableInWild, false);
        }
    });

    document.addEventListener('evolution-click', async (event) => {
        const pokemonId = event.detail;
        ui.showLoader();
        try {
            const pokemon = await pokemonService.getPokemonDetails(pokemonId);
            const species = await pokemonService.getPokemonSpecies(pokemonId);
            const rawEncounters = await pokemonService.getPokemonEncounters(pokemonId);
            const encounters = pokemonService.processEncounters(rawEncounters);
            const evolutionChain = await pokemonService.getEvolutionChain(species.evolution_chain.url);
            const typeEffectiveness = await pokemonService.getPokemonTypeEffectiveness(pokemon);
            const isCatchableInWild = rawEncounters && rawEncounters.length > 0;

            ui.renderPokemonDetail(pokemon, species, encounters, evolutionChain, typeEffectiveness, isCatchableInWild);
            ui.setHeaderTitle(pokemon.name);
            
            currentModalPokemonId = pokemon.id;
            
            const detailsPane = document.querySelector('.details-content-pane');
            detailsPane.classList.add('show-content');

        } catch (error) {
            console.error('Error opening evolved Pokemon modal:', error);
            ui.showError('Failed to load evolved Pokémon details.');
        } finally {
            ui.hideLoader();
        }
    });
}
