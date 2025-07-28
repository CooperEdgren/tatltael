// scripts/pokedex/catching-game.js

const POKEBALLS = [
    { name: 'Poké Ball', column: 0, bonus: 1 },
    { name: 'Great Ball', column: 1, bonus: 1.5 },
    { name: 'Safari Ball', column: 2, bonus: 1.5 },
    { name: 'Ultra Ball', column: 3, bonus: 2 },
    { name: 'Master Ball', column: 4, bonus: 255 },
    { name: 'Net Ball', column: 5, bonus: 1 }, // Special logic
    { name: 'Dive Ball', column: 6, bonus: 3.5 }, // Special logic (assume true)
    { name: 'Nest Ball', column: 7, bonus: 1 }, // Special logic
    { name: 'Repeat Ball', column: 8, bonus: 1 }, // Special logic
    { name: 'Timer Ball', column: 9, bonus: 1 }, // Special logic
    { name: 'Luxury Ball', column: 10, bonus: 1 },
    { name: 'Premier Ball', column: 11, bonus: 1 },
    { name: 'Dusk Ball', column: 12, bonus: 3.5 }, // Special logic (assume true)
    { name: 'Heal Ball', column: 13, bonus: 1 },
    { name: 'Quick Ball', column: 14, bonus: 1 }, // Special logic
    { name: 'Cherish Ball', column: 15, bonus: 1 },
];

export class CatchingGame {
    constructor(container, pokemonData, ui, onCatchSuccess, onCatchFailure) {
        this.container = container;
        this.pokemonData = pokemonData;
        this.pokemon = pokemonData.pokemon;
        this.pokemon.level = Math.floor(Math.random() * 50) + 1; 
        this.ui = ui;
        this.onCatchSuccess = onCatchSuccess;
        this.onCatchFailure = onCatchFailure;
        this.isThrown = false;
        this.catchInProgress = false;
        this.animationFrameId = null;
        this.startTime = Date.now();
        this.elapsedTime = 0;

        this.inventory = POKEBALLS.map(ball => ({ ...ball, count: 5 }));
        this.currentBallIndex = 0;

        // DOM elements
        this.inventoryContainer = document.getElementById('inventory-container');
        this.inventoryButton = document.getElementById('inventory-button');
        this.prevBallBtn = document.getElementById('prev-ball-btn');
        this.nextBallBtn = document.getElementById('next-ball-btn');
        this.closeInventoryBtn = document.getElementById('close-inventory-btn');

        // Physics engine setup
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.world.gravity.y = 2;

        this.setupBounds();
        this.setupPokemon();
        this.setupPokeball();
        this.setupMouseConstraint();
        this.setupCollisionEvents();
        this.setupInventoryControls();
    }

    setupInventoryControls() {
        const openInventory = () => this.inventoryContainer.classList.add('open');
        const closeInventory = () => this.inventoryContainer.classList.remove('open');

        this.inventoryButton.addEventListener('click', openInventory);
        this.inventoryButton.addEventListener('touchstart', (e) => { e.preventDefault(); openInventory(); });

        this.closeInventoryBtn.addEventListener('click', closeInventory);
        this.closeInventoryBtn.addEventListener('touchstart', (e) => { e.preventDefault(); closeInventory(); });

        const prevBtnAction = () => this.switchBall(-1);
        this.prevBallBtn.addEventListener('click', prevBtnAction);
        this.prevBallBtn.addEventListener('touchstart', (e) => { e.preventDefault(); prevBtnAction(); });

        const nextBtnAction = () => this.switchBall(1);
        this.nextBallBtn.addEventListener('click', nextBtnAction);
        this.nextBallBtn.addEventListener('touchstart', (e) => { e.preventDefault(); nextBtnAction(); });

        this.updateInventoryUI();
    }

    switchBall(direction) {
        const oldBallIndex = this.currentBallIndex;
        this.currentBallIndex = (this.currentBallIndex + direction + this.inventory.length) % this.inventory.length;
        
        this.animateIncomingBall(direction);
        this.animateOutgoingBall(oldBallIndex, direction);

        setTimeout(() => this.updateInventoryUI(), 50);
    }

    updateInventoryUI() {
        const prevIndex = (this.currentBallIndex - 1 + this.inventory.length) % this.inventory.length;
        const nextIndex = (this.currentBallIndex + 1) % this.inventory.length;

        this.updateButton(this.prevBallBtn, this.inventory[prevIndex]);
        this.updateButton(this.nextBallBtn, this.inventory[nextIndex]);
    }

    updateButton(button, ball) {
        const frame = ball.column;
        const frameY = Math.floor(frame / 25) * 64;
        const frameX = (frame % 25) * 64;
        
        button.style.backgroundPosition = `-${frameX}px -${frameY}px`;

        let countEl = button.querySelector('.ball-count');
        if (!countEl) {
            countEl = document.createElement('span');
            countEl.className = 'ball-count';
            button.appendChild(countEl);
        }
        countEl.textContent = `x${ball.count}`;
    }

    animateIncomingBall(direction) {
        const movingBall = document.createElement('div');
        movingBall.className = 'moving-ball';
        this.container.appendChild(movingBall);

        const startButton = direction === 1 ? this.nextBallBtn : this.prevBallBtn;
        const startRect = startButton.getBoundingClientRect();
        const endRect = this.pokeballSprite.getBoundingClientRect();

        const ballData = this.inventory[this.currentBallIndex];
        const frame = ballData.column;
        const frameY = Math.floor(frame / 25) * 64;
        const frameX = (frame % 25) * 64;
        movingBall.style.backgroundImage = `url('../images/pokedex-assets/png/pokeballs_sprites.png')`;
        movingBall.style.backgroundSize = '1600px 1088px';
        movingBall.style.backgroundPosition = `-${frameX}px -${frameY}px`;

        Object.assign(movingBall.style, { left: `${startRect.left}px`, top: `${startRect.top}px` });
        requestAnimationFrame(() => {
            Object.assign(movingBall.style, { left: `${endRect.left}px`, top: `${endRect.top}px`, transform: 'scale(1)' });
        });

        setTimeout(() => {
            this.setPokeballFrame(0);
            movingBall.remove();
        }, 300);
    }

    animateOutgoingBall(oldBallIndex, direction) {
        const movingBall = document.createElement('div');
        movingBall.className = 'moving-ball';
        this.container.appendChild(movingBall);

        const startRect = this.pokeballSprite.getBoundingClientRect();
        const endButton = direction === 1 ? this.prevBallBtn : this.nextBallBtn;
        const endRect = endButton.getBoundingClientRect();

        const ballData = this.inventory[oldBallIndex];
        const frame = ballData.column;
        const frameY = Math.floor(frame / 25) * 64;
        const frameX = (frame % 25) * 64;
        movingBall.style.backgroundImage = `url('../images/pokedex-assets/png/pokeballs_sprites.png')`;
        movingBall.style.backgroundSize = '1600px 1088px';
        movingBall.style.backgroundPosition = `-${frameX}px -${frameY}px`;

        Object.assign(movingBall.style, { left: `${startRect.left}px`, top: `${startRect.top}px` });
        requestAnimationFrame(() => {
            Object.assign(movingBall.style, { left: `${endRect.left}px`, top: `${endRect.top}px`, transform: 'scale(1)' });
        });

        setTimeout(() => movingBall.remove(), 300);
    }

    setupBounds() {
        const wallThickness = 50;
        const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, { isStatic: true, isSensor: true, label: 'ground' });
        const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, { isStatic: true });
        const rightWall = Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, { isStatic: true });
        Matter.World.add(this.world, [ground, leftWall, rightWall]);
    }

    setupPokemon() {
        const pokemonSprite = this.container.querySelector('.wild-pokemon-sprite');
        this.pokemonSprite = pokemonSprite;
        const spriteRect = pokemonSprite.getBoundingClientRect();
        const wallThickness = 20;
        const pokemonWidth = 75;
        const pokemonHeight = 75;

        this.pokemonBody = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 2, pokemonWidth * 0.8, pokemonHeight * 0.8, { isStatic: true, isSensor: true, label: 'pokemon' });
        const wallOptions = { isStatic: true, isSensor: false, label: 'pokemon-boundary' };
        const topWall = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, spriteRect.top - wallThickness / 2, pokemonWidth, wallThickness, wallOptions);
        const leftWall = Matter.Bodies.rectangle(spriteRect.left - wallThickness / 2, spriteRect.top + spriteRect.height / 2, wallThickness, pokemonHeight, wallOptions);
        const rightWall = Matter.Bodies.rectangle(spriteRect.right + wallThickness / 2, spriteRect.top + spriteRect.height / 2, wallThickness, pokemonHeight, wallOptions);
        this.boundaryWalls = [topWall, leftWall, rightWall];
        const extraHeight = 50;
        const safeZone = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, (spriteRect.top + spriteRect.height / 2) + (extraHeight / 2), pokemonWidth, pokemonHeight + extraHeight, { isStatic: true, isSensor: true, label: 'pokemon-safe-zone' });
        Matter.World.add(this.world, [this.pokemonBody, ...this.boundaryWalls, safeZone]);
    }

    setupPokeball() {
        this.pokeballSprite = document.getElementById('pokeball-sprite');
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight - 80;
        this.pokeballStartPosition = { x: startX, y: startY };
        this.pokeballBody = Matter.Bodies.circle(startX, startY, 32, { restitution: 0.5, friction: 0.1, density: 0.01, label: 'pokeball', isStatic: true });
        Matter.World.add(this.world, this.pokeballBody);
    }

    setPokeballFrame(frameNumber) {
        const ball = this.inventory[this.currentBallIndex];
        const frameHeight = 64;
        const frameRow = Math.floor((frameNumber + ball.column) / 25);
        const frameX = (frameNumber + ball.column) % 25;
        const frameY = frameRow * frameHeight;
        this.pokeballSprite.style.backgroundPosition = `-${frameX * 64}px -${frameY}px`;
    }

    calculateCatchChance() {
        const ball = this.inventory[this.currentBallIndex];
        const hpMax = 100;
        const hpCurrent = 100;
        const statusBonus = 1;
        const baseCaptureRate = this.pokemonData.species.capture_rate;

        let ballBonus = ball.bonus;
        const turns = this.elapsedTime / 6000;

        switch (ball.name) {
            case 'Net Ball':
                if (this.pokemon.types.some(t => t.type.name === 'water' || t.type.name === 'bug')) ballBonus = 3.5;
                break;
            case 'Nest Ball':
                if (this.pokemon.level >= 1 && this.pokemon.level <= 29) ballBonus = (41 - this.pokemon.level) / 10;
                break;
            case 'Timer Ball':
                ballBonus = Math.min(4, 1 + turns * 0.3);
                break;
            case 'Quick Ball':
                if (turns < 1) ballBonus = 5;
                break;
        }

        if (ball.name === 'Master Ball') return 1;

        const a = Math.floor(((3 * hpMax - 2 * hpCurrent) * baseCaptureRate * ballBonus) / (3 * hpMax));
        const b = Math.min(255, a) * statusBonus;
        return b / 255;
    }

    startCatchSequence() {
        if (this.catchInProgress) return;
        
        const currentBall = this.inventory[this.currentBallIndex];
        if (currentBall.count <= 0) {
            this.ui.showNotification(`Out of ${currentBall.name}s!`, 'info');
            return;
        }
        
        this.catchInProgress = true;
        this.isThrown = false;
        currentBall.count--;
        this.updateInventoryUI();

        setTimeout(() => {
            Matter.Body.setStatic(this.pokeballBody, true);
            Matter.Body.setAngle(this.pokeballBody, 0);
            this.pokeballSprite.style.transform = 'rotate(0rad)';
            this.setPokeballFrame(225);

            setTimeout(() => {
                this.setPokeballFrame(250);
                this.pokemonSprite.classList.add('captured');
                const pokeballRect = this.pokeballSprite.getBoundingClientRect();
                this.pokemonSprite.style.transformOrigin = `${pokeballRect.left - this.pokemonSprite.getBoundingClientRect().left}px ${pokeballRect.top - this.pokemonSprite.getBoundingClientRect().top}px`;

                setTimeout(() => {
                    this.setPokeballFrame(0);
                    setTimeout(() => this.startShakingAnimation(), 500);
                }, 200);
            }, 200);
        }, 300);
    }

    startShakingAnimation() {
        const catchProbability = this.calculateCatchChance();
        const isCaught = Math.random() < catchProbability;
        
        const shakeSequence = [0, 275, 300, 325, 300, 275, 0, 0, 350, 375, 400, 375, 350, 0, 0, 275, 300, 325];
        let frameIndex = 0;
        const interval = 250;
        const shakesBeforeBreakout = Math.floor(Math.random() * 3);
        let shakesCompleted = 0;

        const shake = () => {
            if (frameIndex < shakeSequence.length && this.catchInProgress) {
                this.setPokeballFrame(shakeSequence[frameIndex]);

                if (frameIndex === 6 || frameIndex === 13 || frameIndex === 17) {
                    shakesCompleted++;
                    if (!isCaught && shakesCompleted > shakesBeforeBreakout) {
                        setTimeout(() => this.startFailureSequence(), interval);
                        return;
                    }
                }

                frameIndex++;
                setTimeout(shake, interval);
            } else if (this.catchInProgress) {
                if (isCaught) {
                    this.ui.showNotification(`Gotcha! ${this.pokemon.name} was caught!`, 'success');
                    const successFrames = [350, 375, 400, 0];
                    let successIndex = 0;
                    const successAnimation = () => {
                        if (successIndex < successFrames.length) {
                            this.setPokeballFrame(successFrames[successIndex]);
                            successIndex++;
                            setTimeout(successAnimation, 100);
                        } else {
                            if (this.onCatchSuccess) this.onCatchSuccess(this.pokemon);
                        }
                    };
                    successAnimation();
                } else {
                     this.startFailureSequence();
                }
            }
        };
        shake();
    }

    startFailureSequence() {
        if (!this.catchInProgress) return;
        this.ui.showNotification(`Oh no! ${this.pokemon.name} broke free!`, 'failure');
        this.setPokeballFrame(250);
        this.pokemonSprite.classList.remove('captured');
        Matter.Body.setStatic(this.pokeballBody, false);
        setTimeout(() => this.respawnPokeball(), 1000);
    }

    respawnPokeball() {
        if (this.catchInProgress) {
            this.catchInProgress = false;
        }
        Matter.Body.setStatic(this.pokeballBody, true);
        Matter.Body.setPosition(this.pokeballBody, this.pokeballStartPosition);
        Matter.Body.setVelocity(this.pokeballBody, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.pokeballBody, 0);

        this.isThrown = false;
        this.pokeballSprite.style.transform = 'rotate(0rad)';
        this.pokeballSprite.style.left = `${this.pokeballStartPosition.x - this.pokeballSprite.offsetWidth / 2}px`;
        this.pokeballSprite.style.top = `${this.pokeballStartPosition.y - this.pokeballSprite.offsetHeight / 2}px`;
        this.setPokeballFrame(0);

        this.pokeballSprite.classList.add('pokeball-respawn');
        setTimeout(() => this.pokeballSprite.classList.remove('pokeball-respawn'), 300);
    }

    setupMouseConstraint() {
        this.mouse = Matter.Mouse.create(this.container);
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Matter.World.add(this.world, this.mouseConstraint);

        Matter.Events.on(this.mouseConstraint, 'mousedown', (event) => {
            if (this.mouseConstraint.body === this.pokeballBody && !this.catchInProgress) {
                const currentBall = this.inventory[this.currentBallIndex];
                if (currentBall.count > 0) {
                    Matter.Body.setStatic(this.pokeballBody, false);
                } else {
                    this.ui.showNotification(`Out of ${currentBall.name}s!`, 'info');
                }
            }
        });

        Matter.Events.on(this.mouseConstraint, 'enddrag', (event) => {
            if (event.body === this.pokeballBody && !this.catchInProgress) {
                this.isThrown = true;
                this.throwAnimationLoop();
            }
        });
    }

    setupCollisionEvents() {
        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                if (pair.bodyA.label === 'pokeball' || pair.bodyB.label === 'pokeball') {
                    const otherBody = pair.bodyA.label === 'pokeball' ? pair.bodyB : pair.bodyA;
                    switch (otherBody.label) {
                        case 'pokemon-safe-zone':
                            this.boundaryWalls.forEach(wall => wall.isSensor = true);
                            break;
                        case 'pokemon-boundary':
                            if (!otherBody.isSensor) this.startCatchSequence();
                            break;
                        case 'ground':
                            this.isThrown = false;
                            if (!this.catchInProgress) {
                                this.respawnPokeball();
                            }
                            break;
                        case 'pokemon':
                            this.isThrown = false;
                            break;
                    }
                }
            }
        });

        Matter.Events.on(this.engine, 'collisionEnd', (event) => {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                if ((pair.bodyA.label === 'pokeball' && pair.bodyB.label === 'pokemon-safe-zone') ||
                    (pair.bodyB.label === 'pokeball' && pair.bodyA.label === 'pokemon-safe-zone')) {
                    this.boundaryWalls.forEach(wall => wall.isSensor = false);
                }
            }
        });
    }

    throwAnimationLoop() {
        if (!this.isThrown) {
            this.setPokeballFrame(0);
            return;
        }
        
        const frames = [200, 175, 150, 125, 100, 75, 50, 25];
        let currentFrameIndex = 0;

        const animate = () => {
            if (!this.isThrown) return;
            this.setPokeballFrame(frames[currentFrameIndex]);
            currentFrameIndex = (currentFrameIndex + 1) % frames.length;
            setTimeout(animate, 50);
        };
        animate();
    }

    run() {
        const gameLoop = () => {
            this.elapsedTime = Date.now() - this.startTime;

            if (!this.catchInProgress) {
                Matter.Engine.update(this.engine);
            }

            const pos = this.pokeballBody.position;
            this.pokeballSprite.style.left = `${pos.x - this.pokeballSprite.offsetWidth / 2}px`;
            this.pokeballSprite.style.top = `${pos.y - this.pokeballSprite.offsetHeight / 2}px`;
            if (!this.catchInProgress) {
                this.pokeballSprite.style.transform = `rotate(${this.pokeballBody.angle}rad)`;
            }

            const buffer = 200;
            if (pos.y > window.innerHeight + buffer || pos.x > window.innerWidth + buffer || pos.x < -buffer) {
                if (!this.catchInProgress) {
                    this.respawnPokeball();
                }
            }

            this.animationFrameId = requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.catchInProgress = false;
        Matter.World.clear(this.world);
        Matter.Engine.clear(this.engine);
    }
}
