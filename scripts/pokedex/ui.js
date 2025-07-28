import { SPRITE_BASE_URL, LANGUAGE_ENGLISH, POKEBALLS, MAX_GENERATION, MAX_STAT_VALUE, POKEMON_TYPES } from './constants.js';
import * as favorites from './favorites.js';
import * as tracker from './tracker.js';

const typeColorMap = new Map();

export function cacheTypeColors() {
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);

    POKEMON_TYPES.forEach(type => {
        tempDiv.className = `type-${type}`;
        const color = getComputedStyle(tempDiv).backgroundColor;
        typeColorMap.set(type, color);
    });

    document.body.removeChild(tempDiv);
}

export class UI {
    constructor(pokedexContainer, modalBody, loader, generationFilterContainer, typeFilterContainer, navPillContainer, headerTitle, menuButton) {
        this.pokedexContainer = pokedexContainer;
        this.modalBody = modalBody;
        this.loader = loader;
        this.generationFilterContainer = generationFilterContainer;
        this.typeFilterContainer = typeFilterContainer;
        this.trackingFilterContainer = document.getElementById('tracking-filter-container');
        this.navPillContainer = navPillContainer;
        this.headerTitle = headerTitle;
        this.menuButton = menuButton;
        this.errorMessageElement = document.getElementById('error-message');
        this.notificationContainer = document.getElementById('notification-container');
    }

    showNotification(message, type = 'info', duration = 3000) {
        if (!this.notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notification.style.animation = `fadeInDown 0.3s forwards, fadeOutUp 0.3s ${duration / 1000 - 0.3}s forwards`;

        this.notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    createScanButton() {
        const filtersToggleBtn = document.getElementById('filters-toggle-btn');
        if (!filtersToggleBtn) return;

        const scanBtn = document.createElement('button');
        scanBtn.id = 'scan-qr-btn';
        scanBtn.className = 'scan-btn';
        scanBtn.textContent = 'Scan';
        
        filtersToggleBtn.parentNode.insertBefore(scanBtn, filtersToggleBtn.nextSibling);
    }

    showLoader() {
        this.loader.style.display = 'block';
        this.hideError();
    }

    hideLoader() {
        this.loader.style.display = 'none';
    }

    showError(message) {
        this.errorMessageElement.textContent = message;
        this.errorMessageElement.style.display = 'block';
    }

    hideError() {
        this.errorMessageElement.textContent = '';
        this.errorMessageElement.style.display = 'none';
    }

    setHeaderTitle(title) {
        const currentTitleSpan = this.headerTitle.querySelector('span');
        if (currentTitleSpan && currentTitleSpan.textContent === title) return;

        // 1. Create the new span and measure it
        const newTitleSpan = document.createElement('span');
        newTitleSpan.textContent = title;
        newTitleSpan.style.visibility = 'hidden'; // Render invisibly to measure
        this.headerTitle.appendChild(newTitleSpan);
        const { width, height } = newTitleSpan.getBoundingClientRect();
        this.headerTitle.removeChild(newTitleSpan);
        newTitleSpan.style.visibility = 'visible';

        // 2. Set container size to prevent collapse
        this.headerTitle.style.width = `${width}px`;
        this.headerTitle.style.height = `${height}px`;

        // 3. Animate out the old title
        if (currentTitleSpan) {
            currentTitleSpan.classList.add('header-title-old');
            currentTitleSpan.addEventListener('animationend', () => {
                currentTitleSpan.remove();
            }, { once: true });
        }

        // 4. Animate in the new title
        newTitleSpan.classList.add('header-title-new');
        this.headerTitle.appendChild(newTitleSpan);
        
        requestAnimationFrame(() => {
            newTitleSpan.classList.add('header-title-active');
        });

        // 5. Clean up styles after animation
        newTitleSpan.addEventListener('animationend', () => {
            newTitleSpan.classList.remove('header-title-new', 'header-title-active');
            this.headerTitle.style.width = '';
            this.headerTitle.style.height = '';
        }, { once: true });
    }

    toggleNavPill() {
        this.navPillContainer.classList.toggle('nav-active');
    }

    hideMenuButton() {
        this.menuButton.style.display = 'none';
    }

    showMenuButton() {
        this.menuButton.style.display = 'block';
    }

    showPokedexView() {
        document.getElementById('pokedex-view').classList.remove('hidden');
        document.getElementById('trainer-card-view').classList.add('hidden');
    }

    showTrainerCardView() {
        document.getElementById('pokedex-view').classList.add('hidden');
        document.getElementById('trainer-card-view').classList.remove('hidden');
    }

    renderPokemonList(pokemonList, isShiny = false) {
        this.hideError();
        this.pokedexContainer.innerHTML = ''; // Clear existing content
        this.appendPokemonList(pokemonList, isShiny);
    }

    appendPokemonList(pokemonList, isShiny = false) {
        const fragment = document.createDocumentFragment();
        pokemonList.forEach(pokemon => {
            const pokemonCard = this.createPokemonCard(pokemon, isShiny);
            fragment.appendChild(pokemonCard);
        });
        this.pokedexContainer.appendChild(fragment);
    }

    createPokemonCard(pokemon, isShiny = false) {
        const pokemonId = pokemon.id;
        const isFavorite = favorites.isFavorite(pokemonId);
        const isCaught = tracker.isCaught(pokemonId);
        const isSeen = tracker.isSeen(pokemonId);
        let sprite = isShiny ? pokemon.shinySprite : pokemon.sprite;
        if (isShiny) {
            sprite = pokemon.animatedShinySprite || pokemon.shinySprite;
        } else {
            sprite = pokemon.animatedSprite || pokemon.sprite;
        }
    
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.dataset.id = pokemonId;
    
        this._styleDetailsPane(pokemon.types, pokemonCard);
    
        pokemonCard.innerHTML = `
            <div class="card-loader"></div>
            <div class="card-button-container">
                <button class="card-icon-btn favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-id="${pokemonId}" aria-label="Favorite">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                <button class="card-icon-btn seen-btn ${isSeen ? 'is-seen' : ''}" data-id="${pokemonId}" aria-label="Mark as Seen">
                    <img src="images/pokedex-assets/icons/eye.svg" alt="Seen">
                </button>
                <button class="card-icon-btn caught-btn ${isCaught ? 'is-caught' : ''}" data-id="${pokemonId}" aria-label="Mark as Caught">
                    <img src="images/pokedex-assets/svg/pokeball.svg" alt="Caught">
                </button>
            </div>
            <div class="pokemon-card-main-content">
                <img src="${sprite}" alt="${pokemon.name}">
                <div class="pokemon-card-content">
                    <h3>${pokemon.name}</h3>
                    <p class="pokemon-id">#${pokemonId.toString().padStart(3, '0')}</p>
                </div>
            </div>
        `;
        return pokemonCard;
    }

    renderPokemonDetail(pokemon, species, encounters, evolutionChain, typeEffectiveness, isCatchableInWild, isLoading = false) {
        this.hideError();
        this.modalBody.innerHTML = this._createDetailMarkup(pokemon, species, typeEffectiveness, isCatchableInWild, isLoading);

        this._styleDetailsPane(pokemon.types);
        
        if (!isLoading) {
            this._animateSprite(pokemon.sprites);
            if (isCatchableInWild) {
                this._renderLocationEncounterSection(encounters);
                this._renderCatchRateSection(pokemon, species);
            }
            this._renderEvolutionSection(pokemon, evolutionChain);
        }
    }

    _createDetailMarkup(pokemon, species, typeEffectiveness, isCatchableInWild, isLoading) {
        const sprite = pokemon.sprite || pokemon.sprites?.front_default;
        const shinySprite = pokemon.shinySprite || pokemon.sprites?.front_shiny;
        const isFavorite = favorites.isFavorite(pokemon.id);
        const isCaught = tracker.isCaught(pokemon.id);
        const isSeen = tracker.isSeen(pokemon.id);

        const types = pokemon.types.map(typeInfo => {
            const typeName = typeInfo.type.name;
            return `<img src="images/pokedex-assets/types/${typeName}.png" alt="${typeName}" class="type-badge">`;
        }).join('');

        const stats = pokemon.stats ? pokemon.stats.map(statInfo => `
            <div class="stat">
                <span class="stat-name">${statInfo.stat.name}</span>
                <div class="stat-bar"><div class="stat-bar-inner" style="width: ${statInfo.base_stat / (MAX_STAT_VALUE / 100)}%"></div></div>
                <span class="stat-value">${statInfo.base_stat}</span>
            </div>
        `).join('') : '<div class="loader-small"></div>';

        const genus = species ? species.genera.find(entry => entry.language.name === LANGUAGE_ENGLISH)?.genus || 'Unknown' : '';
        const flavorText = species ? species.flavor_text_entries.find(entry => entry.language.name === LANGUAGE_ENGLISH)?.flavor_text || 'No description available.' : '<div class="loader-small"></div>';

        const typeEffectivenessMarkup = typeEffectiveness ? this._renderTypeEffectiveness(typeEffectiveness) : '<div class="loader-small"></div>';
        
        let catchAndLocationMarkup = '<div class="loader-small"></div>';
        if (!isLoading) {
            if (isCatchableInWild) {
                catchAndLocationMarkup = `
                    <div class="location-encounter-section"><h3>Location/Encounter Rate</h3><div class="location-encounter-content"></div></div>
                    <div class="catch-rates-section"></div>
                `;
            } else {
                const isLegendary = species.is_legendary;
                const isMythical = species.is_mythical;
                const evolvesFrom = species.evolves_from_species;
                let message = '';

                if (isLegendary || isMythical) {
                    message = `<p>${this._formatLocationName(pokemon.name)} is a special Pokémon and is not typically found roaming in the wild.</p>`;
                } else if (evolvesFrom) {
                    message = `<p>${this._formatLocationName(pokemon.name)} is not found in the wild in the supported games and must be evolved from ${this._formatLocationName(evolvesFrom.name)}.</p>`;
                } else {
                    message = `<p>${this._formatLocationName(pokemon.name)} is not found in the wild in the supported games. It is likely a starter, gift, or event Pokémon.</p>`;
                }
                catchAndLocationMarkup = `<div class="catch-info-section"><h3>Availability</h3>${message}</div>`;
            }
        }

        const evolutionMarkup = !isLoading ? `<div class="evolution-section"><h3>Evolution</h3><div class="evolution-content"></div></div>` : '<div class="loader-small"></div>';

        return `
            <div class="sprite-container">
                <img src="${sprite}" alt="${pokemon.name}" class="modal-sprite" data-pokemon-name="${pokemon.name}" data-sprite="${sprite}" data-shiny-sprite="${shinySprite}">
                <button class="close-button" aria-label="Close">&times;</button>
            </div>
            <div class="details-content-pane">
                <div class="details-inner-content">
                    <h2 class="pokemon-name">${pokemon.name}</h2>
                    <div class="details-header">
                        <button id="modal-shiny-toggle" class="card-icon-btn shiny-btn" aria-label="Toggle shiny sprite">
                            <img src="images/pokedex-assets/png/shiny-symbol.png" alt="Shiny">
                        </button>
                        <button class="card-icon-btn seen-btn ${isSeen ? 'is-seen' : ''}" data-id="${pokemon.id}" aria-label="Mark as Seen">
                            <img src="images/pokedex-assets/icons/eye.svg" alt="Seen">
                        </button>
                        <p class="pokemon-id-display">#${pokemon.id.toString().padStart(3, '0')}</p>
                        <button class="card-icon-btn caught-btn ${isCaught ? 'is-caught' : ''}" data-id="${pokemon.id}" aria-label="Mark as Caught">
                            <img src="images/pokedex-assets/svg/pokeball.svg" alt="Caught">
                        </button>
                        <button class="card-icon-btn favorite-btn-modal ${isFavorite ? 'is-favorite' : ''}" data-id="${pokemon.id}" aria-label="Favorite">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                    </div>
                    <div class="types-container">${types}</div>
                    <div class="info-container">
                        <h4>${genus}</h4>
                        <p>${flavorText}</p>
                        <div class="info-grid">
                            <div class="info-item"><h4>Height</h4><p>${pokemon.height ? pokemon.height / 10 + ' m' : '...'}</p></div>
                            <div class="info-item"><h4>Weight</h4><p>${pokemon.weight ? pokemon.weight / 10 + ' kg' : '...'}</p></div>
                            <div class="info-item"><h4>Abilities</h4><p>${pokemon.abilities ? pokemon.abilities.map(a => a.ability.name).join(', ') : '...'}</p></div>
                            <div class="info-item"><h4>Base Experience</h4><p>${pokemon.base_experience || '...'}</p></div>
                            <div class="info-item"><h4>Common Nature</h4><p>${this._getFluffNature(pokemon.id)}</p></div>
                            <div class="info-item"><h4>Favorite Food</h4><p>${this._getFluffFood(pokemon.types)}</p></div>
                        </div>
                    </div>
                    <div class="stats-container"><h3>Base Stats</h3>${stats}</div>
                    ${typeEffectivenessMarkup}
                    ${catchAndLocationMarkup}
                    ${evolutionMarkup}
                </div>
            </div>
        `;
    }

    _styleDetailsPane(types, element) {
        const targetElement = element || this.modalBody.querySelector('.details-content-pane');
        if (!targetElement) return;
        
        // Clear existing type classes
        const classList = targetElement.className.split(' ');
        const filteredClasses = classList.filter(c => !c.startsWith('type-'));
        targetElement.className = filteredClasses.join(' ');

        targetElement.style.background = '';

        const typeNames = types.map(typeInfo => typeInfo.type.name);
        if (typeNames.length > 1) {
            const typeColors = typeNames.map(typeName => this._getTypeColor(typeName));
            targetElement.style.background = `linear-gradient(to bottom right, ${typeColors.join(', ')})`;
        } else {
            targetElement.classList.add(`type-${typeNames[0]}`);
        }

        if (!element) {
            targetElement.classList.add('show-content');
        }
    }

    _getTypeColor(typeName) {
        return typeColorMap.get(typeName) || 'var(--default-type-color)';
    }

    _animateSprite(sprites) {
        const modalSprite = this.modalBody.querySelector('.modal-sprite');
        const introSprite = sprites.versions['generation-v']['black-white'].animated.front_default;
        const idleSprite = sprites.versions['generation-v']['black-white'].animated.front_default || sprites.front_default;
        const shinyIdleSprite = sprites.versions['generation-v']['black-white'].animated.front_shiny || sprites.front_shiny;

        modalSprite.dataset.idle = idleSprite;
        modalSprite.dataset.shinyIdle = shinyIdleSprite;

        if (introSprite) {
            modalSprite.src = introSprite;
            setTimeout(() => {
                modalSprite.src = modalSprite.classList.contains('is-shiny') ? shinyIdleSprite : idleSprite;
                if (!modalSprite.classList.contains('idle-animation-sprite')) {
                    modalSprite.classList.add('idle-animation-sprite');
                }
            }, 1000);
        } else {
            modalSprite.src = idleSprite;
            if (!modalSprite.classList.contains('idle-animation-sprite')) {
                modalSprite.classList.add('idle-animation-sprite');
            }
        }
    }

    _calculateCatchChance(catchRate, ball, hpPercentage = 100, status = 'none') {
        const ballBonuses = {
            'poke-ball': 1, 'great-ball': 1.5, 'ultra-ball': 2, 'master-ball': 255,
            'safari-ball': 1.5, 'net-ball': 3.5, 'dive-ball': 3.5, 'nest-ball': 1, // Simplified for now
            'repeat-ball': 3.5, 'timer-ball': 1, // Simplified for now
            'luxury-ball': 1, 'premier-ball': 1, 'dusk-ball': 3.5, 'heal-ball': 1,
            'quick-ball': 5, 'fast-ball': 4, 'level-ball': 1, // Simplified
            'lure-ball': 3, 'heavy-ball': 1, // Simplified
            'love-ball': 8, 'friend-ball': 1, 'moon-ball': 3.5, 'sport-ball': 1.5,
            'dream-ball': 255, 'beast-ball': 5, 'cherish-ball': 1
        };
        const ballBonus = ballBonuses[ball.name.toLowerCase().replace(' ', '-')] || 1;
        const statusBonus = status === 'sleep' || status === 'freeze' ? 2.5 : status !== 'none' ? 1.5 : 1;
        
        // Gen V formula
        const maxHP = 100; // Assuming max HP for simplicity in calculation
        const currentHP = Math.max(1, Math.floor(maxHP * (hpPercentage / 100)));
        const modifiedRate = Math.floor(((3 * maxHP - 2 * currentHP) * catchRate * ballBonus) / (3 * maxHP));
        const finalRate = Math.min(255, modifiedRate) * statusBonus;

        const shakeProbability = Math.floor(65536 / (255 / finalRate)**0.25);
        let catchProbability = (shakeProbability / 65536)**4;

        return Math.round(catchProbability * 1000) / 10; // Return percentage with one decimal place
    }

    _renderCatchRateSection(pokemon, species) {
        const catchRateSection = this.modalBody.querySelector('.catch-rates-section');
        if (!catchRateSection) return;

        const baseCaptureRate = species.capture_rate;

        catchRateSection.innerHTML = `
            <h3>Catch Rate Calculator <span class="info-tooltip" title="Uses the Gen V catch formula. Assumes max HP is 100 for calculation.">?</span></h3>
            <div class="catch-conditions">
                <div class="hp-slider-container">
                    <label for="hp-slider">Target HP: <span id="hp-value">100%</span></label>
                    <input type="range" id="hp-slider" min="1" max="100" value="100">
                </div>
                <div class="status-buttons-container">
                    <button class="status-btn" data-status="none">Healthy</button>
                    <button class="status-btn" data-status="sleep">Sleep</button>
                    <button class="status-btn" data-status="paralysis">Paralyze</button>
                    <button class="status-btn" data-status="freeze">Freeze</button>
                    <button class="status-btn" data-status="burn">Burn</button>
                    <button class="status-btn" data-status="poison">Poison</button>
                </div>
            </div>
            <div class="pokeball-buttons-container"></div>
        `;

        const hpSlider = catchRateSection.querySelector('#hp-slider');
        const hpValue = catchRateSection.querySelector('#hp-value');
        const statusButtons = catchRateSection.querySelectorAll('.status-btn');
        const pokeballContainer = catchRateSection.querySelector('.pokeball-buttons-container');

        const updateCatchRates = () => {
            const hp = parseInt(hpSlider.value);
            const activeStatusBtn = catchRateSection.querySelector('.status-btn.active');
            const status = activeStatusBtn ? activeStatusBtn.dataset.status : 'none';
            hpValue.textContent = `${hp}%`;

            pokeballContainer.innerHTML = POKEBALLS.map(ball => {
                const chance = this._calculateCatchChance(baseCaptureRate, ball, hp, status);
                return `
                    <div class="pokeball-button">
                        <img src="${ball.sprite}" alt="${ball.name}">
                        <p>${ball.name}</p>
                        <p class="catch-rate-percentage">${chance}%</p>
                    </div>
                `;
            }).join('');
        };

        hpSlider.addEventListener('input', updateCatchRates);
        statusButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                statusButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateCatchRates();
            });
        });

        // Set initial state
        statusButtons[0].classList.add('active');
        updateCatchRates();
    }

    _formatLocationName(name) {
        return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    _renderLocationEncounterSection(encounters) {
        const container = this.modalBody.querySelector('.location-encounter-content');
        if (!container) return;
        container.innerHTML = '';

        const versions = Object.keys(encounters);
        if (versions.length === 0) {
            container.innerHTML = '<p>Not found in the wild in supported games.</p>';
            return;
        }

        const select = document.createElement('select');
        select.classList.add('game-version-select');
        versions.forEach(version => {
            const option = document.createElement('option');
            option.value = version;
            option.textContent = this._formatLocationName(version);
            select.appendChild(option);
        });

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('location-table-container');

        container.appendChild(select);
        container.appendChild(tableContainer);

        const renderTableForVersion = (version) => {
            const locations = encounters[version].reduce((acc, e) => {
                const locationName = this._formatLocationName(e.location);
                if (!acc[locationName]) {
                    acc[locationName] = [];
                }
                acc[locationName].push(e);
                return acc;
            }, {});

            tableContainer.innerHTML = `
                <table class="location-table">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Method</th>
                            <th>Rate <span class="info-tooltip" title="This value represents the relative frequency of encounter, not a direct percentage.">?</span></th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(locations).map(([locationName, details]) => 
                            details.map((e, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${details.length}">${locationName}</td>` : ''}
                                    <td>${this._formatLocationName(e.method)}</td>
                                    <td>${e.chance}%</td>
                                    <td>${e.min_level}-${e.max_level}</td>
                                </tr>
                            `).join('')
                        ).join('')}
                    </tbody>
                </table>
            `;
        };

        select.addEventListener('change', (e) => renderTableForVersion(e.target.value));
        
        // Initial render
        renderTableForVersion(versions[0]);
    }

    _renderEvolutionSection(pokemon, evolutionTree) {
        const evolutionSection = this.modalBody.querySelector('.evolution-section');
        if (!evolutionTree || !evolutionTree.evolves_to || evolutionTree.evolves_to.length === 0) {
            evolutionSection.style.display = 'none';
            return;
        }
        evolutionSection.style.display = 'block';

        const evolutionContent = evolutionSection.querySelector('.evolution-content');
        evolutionContent.innerHTML = ''; // Clear previous content

        const createPokemonNode = (node) => {
            const evoName = node.species_name.replace(/-/g, ' ');
            const evoSprite = `${SPRITE_BASE_URL}${node.species_id}.png`;
            return `
                <button class="evolution-button" data-id="${node.species_id}">
                    <img src="${evoSprite}" alt="${evoName}" class="idle-animation-sprite">
                    <p>${evoName}</p>
                </button>
            `;
        };

        const createArrowNode = (trigger) => {
            return `
                <div class="evolution-arrow">
                    <p class="evolution-trigger">${trigger || ''}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            `;
        };

        const buildPathHtml = (node) => {
            let pathHtml = createPokemonNode(node);
            if (node.evolves_to.length === 1) {
                pathHtml += createArrowNode(node.evolves_to[0].trigger);
                pathHtml += buildPathHtml(node.evolves_to[0]);
            } else if (node.evolves_to.length > 1) {
                // This case handles branching from an intermediate evolution (e.g. Kirlia)
                const branchesHtml = node.evolves_to.map(branch => {
                    return `<div class="evolution-path">${createArrowNode(branch.trigger)}${buildPathHtml(branch)}</div>`;
                }).join('');
                pathHtml += `<div class="evolution-branches">${branchesHtml}</div>`;
            }
            return pathHtml;
        };

        if (evolutionTree.evolves_to.length > 1) {
            const baseHtml = `<div class="evolution-base">${createPokemonNode(evolutionTree)}</div>`;
            const branchesHtml = evolutionTree.evolves_to.map(branch => {
                return `<div class="evolution-path">${createArrowNode(branch.trigger)}${buildPathHtml(branch)}</div>`;
            }).join('');
            
            evolutionContent.innerHTML = `<div class="evolution-branch-container">${baseHtml}<div class="evolution-branches">${branchesHtml}</div></div>`;
        } else {
            const pathHtml = buildPathHtml(evolutionTree);
            evolutionContent.innerHTML = `<div class="evolution-path">${pathHtml}</div>`;
        }

        evolutionContent.querySelectorAll('.evolution-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const pokemonId = event.currentTarget.dataset.id;
                if (pokemonId === String(pokemon.id)) return;
                const customEvent = new CustomEvent('evolution-click', { detail: pokemonId });
                document.dispatchEvent(customEvent);
            });
        });
    }

    renderTypeFilters(types, container) {
        if (!container) return;
        container.innerHTML = '';
        types.forEach(type => {
            const button = document.createElement('button');
            button.classList.add('type-filter-btn');
            button.dataset.type = type.name;
            button.innerHTML = `<img src="images/pokedex-assets/icons/${type.name}.svg" alt="${type.name}"> ${type.name}`;
            container.appendChild(button);
        });
        
    }

    renderGenerationFilters(container) {
        if (!container) return;
        container.innerHTML = '';
    
        for (let i = 1; i <= MAX_GENERATION; i++) {
            const button = document.createElement('button');
            button.classList.add('generation-filter-btn');
            button.dataset.generation = i;
            button.textContent = `Gen ${i}`;
            container.appendChild(button);
        }
    }

    renderTrackingFilters(container) {
        if (!container) return;
        container.innerHTML = `
            <button id="favorites-filter-btn" class="tracking-filter-btn" aria-label="Show favorites">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Favorites
            </button>
            <button id="seen-filter-btn" class="tracking-filter-btn" aria-label="Show seen">
                <img src="images/pokedex-assets/icons/eye.svg" alt="Seen">
                Seen
            </button>
            <button id="caught-filter-btn" class="tracking-filter-btn" aria-label="Show caught">
                <img src="images/pokedex-assets/svg/pokeball.svg" alt="Caught">
                Caught
            </button>
        `;
    }

    _getFluffNature(pokemonId) {
        const natures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];
        return natures[pokemonId % natures.length];
    }

    _getFluffFood(types) {
        const typeFoodMap = {
            grass: 'Berries',
            fire: 'Spicy Poffins',
            water: 'Seaweed',
            bug: 'Sap',
            normal: 'Anything',
            poison: 'Toxic Sludge',
            electric: 'Batteries',
            ground: 'Minerals',
            fairy: 'Moon cakes',
            fighting: 'Protein Shakes',
            psychic: 'Brain Food',
            rock: 'Geodes',
            ghost: 'Lost Souls',
            ice: 'Ice Cream',
            dragon: 'Precious Gems',
            dark: 'Shadows',
            steel: 'Nuts and Bolts',
            flying: 'Seeds'
        };
        const primaryType = types[0].type.name;
        return typeFoodMap[primaryType] || 'Pokepuffs';
    }

    _renderTypeEffectiveness(effectiveness) {
        const createTypeImages = (types) => types.map(type => `<img src="images/pokedex-assets/types/${type}.png" alt="${type}" class="type-badge-small">`).join('');

        const weaknesses = createTypeImages(effectiveness.weaknesses);
        const resistances = createTypeImages(effectiveness.resistances);
        const immunities = createTypeImages(effectiveness.immunities);

        return `
            <div class="type-effectiveness-container">
                <h3>Type Effectiveness</h3>
                <div class="type-effectiveness-grid">
                    <div class="effectiveness-category">
                        <h4>Weaknesses</h4>
                        <div class="type-icons-grid">${weaknesses || 'None'}</div>
                    </div>
                    <div class="effectiveness-category">
                        <h4>Resistances</h4>
                        <div class="type-icons-grid">${resistances || 'None'}</div>
                    </div>
                    <div class="effectiveness-category">
                        <h4>Immunities</h4>
                        <div class="type-icons-grid">${immunities || 'None'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCompareModal(pokemon1, pokemon2, effectiveness1, effectiveness2) {
        this.modalBody.innerHTML = `
            <div class="compare-container">
                ${this._createCompareColumn(pokemon1, effectiveness1)}
                ${this._createCompareColumn(pokemon2, effectiveness2)}
            </div>
        `;
        const modal = document.getElementById('pokemon-modal');
        modal.classList.add('compare-modal');
        modal.style.display = 'block';

        // Apply type-based gradients to columns
        const columns = this.modalBody.querySelectorAll('.compare-column .details-content-pane');
        if (columns.length === 2) {
            this._styleDetailsPane(pokemon1.types, columns[0]);
            this._styleDetailsPane(pokemon2.types, columns[1]);
        }
    }

    showEncounterPrompt(pokemon, onCatch, onViewDetails) {
        const promptContainer = document.createElement('div');
        promptContainer.id = 'encounter-prompt';
        promptContainer.className = 'encounter-prompt';

        promptContainer.innerHTML = `
            <div class="prompt-content">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p>A wild ${pokemon.name} appeared!</p>
                <div class="prompt-buttons">
                    <button id="catch-btn">Catch</button>
                    <button id="view-details-btn">View Details</button>
                </div>
            </div>
        `;

        document.body.appendChild(promptContainer);

        document.getElementById('catch-btn').addEventListener('click', () => {
            onCatch();
            promptContainer.remove();
        });

        document.getElementById('view-details-btn').addEventListener('click', () => {
            onViewDetails();
            promptContainer.remove();
        });
    }

    _createCompareColumn(pokemon, effectiveness) {
        const animatedSprite = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemon.sprites.front_default;
        
        const types = pokemon.types.map(t => `<img src="images/pokedex-assets/types/${t.type.name}.png" alt="${t.type.name}" class="type-badge">`).join(' ');

        const stats = pokemon.stats.map((s, index) => `
            <div class="stat">
                <span class="stat-name">${s.stat.name}</span>
                <div class="stat-bar"><div class="stat-bar-inner ${pokemon.statComparisons[index]}" style="width: ${s.base_stat / (MAX_STAT_VALUE / 100)}%"></div></div>
                <span class="stat-value">${s.base_stat}</span>
            </div>
        `).join('');

        const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

        const winnerBadge = pokemon.overall === 'winner' ? '<span class="winner-badge">Higher Stats</span>' : '';
        const advantageLabel = pokemon.advantage === 'advantage' ? '<span class="advantage-label">Super-effective!</span>' : '';

        return `
            <div class="compare-column" data-pokemon-id="${pokemon.id}">
                <div class="compare-header">
                    ${winnerBadge}
                    ${advantageLabel}
                    <h2 class="pokemon-name-compare">${pokemon.name}</h2>
                    <p class="pokemon-id-display">#${pokemon.id.toString().padStart(3, '0')}</p>
                </div>
                <div class="sprite-container">
                    <img src="${animatedSprite}" alt="${pokemon.name}" class="modal-sprite idle-animation-sprite" data-pokemon-name="${pokemon.name}">
                </div>
                <div class="details-content-pane show-content">
                     <div class="details-inner-content">
                        <div class="types-container">${types}</div>
                        <div class="info-container">
                            <div class="info-grid">
                                <div class="info-item"><h4>Height</h4><p>${pokemon.height / 10} m</p></div>
                                <div class="info-item"><h4>Weight</h4><p>${pokemon.weight / 10} kg</p></div>
                            </div>
                            <div class="info-item"><h4>Abilities</h4><p>${abilities}</p></div>
                        </div>
                        <div class="stats-container">
                            <h3>Base Stats</h3>
                            ${stats}
                        </div>
                        ${this._renderTypeEffectiveness(effectiveness)}
                    </div>
                </div>
            </div>
        `;
    }

    closeCompareModal() {
        const modal = document.getElementById('pokemon-modal');
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('compare-modal', 'closing');
            this.modalBody.innerHTML = '';
            document.body.classList.remove('modal-open');
            document.dispatchEvent(new Event('clearComparison'));
        }, 500); // Match animation duration
    }
}