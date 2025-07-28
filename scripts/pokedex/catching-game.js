// scripts/pokedex/catching-game.js

export class CatchingGame {
    constructor(container, pokemon, onCatchSuccess, onCatchFailure) {
        this.container = container;
        this.pokemon = pokemon;
        this.onCatchSuccess = onCatchSuccess;
        this.onCatchFailure = onCatchFailure;
        this.isThrown = false;
        this.catchInProgress = false;
        this.animationFrameId = null;

        // Physics engine setup
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.world.gravity.y = 2;

        this.setupBounds();
        this.setupPokemon();
        this.setupPokeball();
        this.setupMouseConstraint();
        this.setupCollisionEvents();
    }

    setupBounds() {
        const wallThickness = 50;
        const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, { 
            isStatic: true,
            isSensor: true,
            label: 'ground'
        });

        const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, { 
            isStatic: true 
        });

        const rightWall = Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, { 
            isStatic: true 
        });

        Matter.World.add(this.world, [ground, leftWall, rightWall]);
    }

    setupPokemon() {
        const pokemonSprite = this.container.querySelector('.wild-pokemon-sprite');
        this.pokemonSprite = pokemonSprite;
        const spriteRect = pokemonSprite.getBoundingClientRect();
        const wallThickness = 20;

        this.pokemonBody = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 2, spriteRect.width * 0.8, spriteRect.height * 0.8, {
            isStatic: true,
            isSensor: true,
            label: 'pokemon'
        });

        const wallOptions = { isStatic: true, isSensor: false, label: 'pokemon-boundary' };
        const topWall = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, spriteRect.top - wallThickness / 2, spriteRect.width, wallThickness, wallOptions);
        const leftWall = Matter.Bodies.rectangle(spriteRect.left - wallThickness / 2, spriteRect.top + spriteRect.height / 2, wallThickness, spriteRect.height, wallOptions);
        const rightWall = Matter.Bodies.rectangle(spriteRect.right + wallThickness / 2, spriteRect.top + spriteRect.height / 2, wallThickness, spriteRect.height, wallOptions);
        
        this.boundaryWalls = [topWall, leftWall, rightWall];

        const extraHeight = 50;
        const safeZone = Matter.Bodies.rectangle(
            spriteRect.left + spriteRect.width / 2, 
            (spriteRect.top + spriteRect.height / 2) + (extraHeight / 2), 
            spriteRect.width, 
            spriteRect.height + extraHeight, 
            { isStatic: true, isSensor: true, label: 'pokemon-safe-zone' }
        );

        Matter.World.add(this.world, [this.pokemonBody, ...this.boundaryWalls, safeZone]);
    }

    setupPokeball() {
        this.pokeballSprite = document.getElementById('pokeball-sprite');
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight - 80;
        this.pokeballStartPosition = { x: startX, y: startY };
        
        this.pokeballBody = Matter.Bodies.circle(startX, startY, 32, {
            restitution: 0.5,
            friction: 0.1,
            density: 0.01,
            label: 'pokeball',
            isStatic: true
        });
        Matter.World.add(this.world, this.pokeballBody);
    }

    setPokeballFrame(frameNumber) {
        const frameHeight = 64;
        const frameRow = Math.floor(frameNumber / 25);
        const frameY = frameRow * frameHeight;
        this.pokeballSprite.style.backgroundPosition = `0px -${frameY}px`;
    }

    startCatchSequence() {
        if (this.catchInProgress) return;
        this.catchInProgress = true;
        this.isThrown = false; // Stop throw animation

        setTimeout(() => {
            // Freeze and rotate
            Matter.Body.setStatic(this.pokeballBody, true);
            Matter.Body.setAngle(this.pokeballBody, 0); // Correct rotation
            this.pokeballSprite.style.transform = 'rotate(0rad)';
            this.setPokeballFrame(225);

            setTimeout(() => {
                // Open pokeball
                this.setPokeballFrame(250);
                
                // Capture pokemon animation
                this.pokemonSprite.classList.add('captured');
                const pokeballRect = this.pokeballSprite.getBoundingClientRect();
                this.pokemonSprite.style.transformOrigin = `${pokeballRect.left - this.pokemonSprite.getBoundingClientRect().left}px ${pokeballRect.top - this.pokemonSprite.getBoundingClientRect().top}px`;


                setTimeout(() => {
                    // Close pokeball
                    this.setPokeballFrame(0);

                    setTimeout(() => {
                        // Start shaking
                        this.startShakingAnimation();
                    }, 500);
                }, 200);
            }, 200);
        }, 300);
    }

    startShakingAnimation() {
        const shakeSequence = [0, 275, 300, 325, 300, 275, 0, 0, 350, 375, 400, 375, 350, 0, 0, 275, 300, 325];
        let frameIndex = 0;
        const interval = 1000 / 4; // 4 FPS

        const isCaught = Math.random() < 0.7;
        // A breakout can happen after the first or second shake.
        const shakesBeforeBreakout = Math.floor(Math.random() * 2) + 1;
        let shakesCompleted = 0;

        const shake = () => {
            if (frameIndex < shakeSequence.length) {
                this.setPokeballFrame(shakeSequence[frameIndex]);

                // Check for breakout at the end of a full shake cycle
                if (!isCaught) {
                    if (frameIndex === 6) { // End of first shake (left)
                        shakesCompleted = 1;
                        if (shakesCompleted >= shakesBeforeBreakout) {
                            setTimeout(() => this.startFailureSequence(), interval);
                            return;
                        }
                    } else if (frameIndex === 13) { // End of second shake (right)
                        shakesCompleted = 2;
                        if (shakesCompleted >= shakesBeforeBreakout) {
                            setTimeout(() => this.startFailureSequence(), interval);
                            return;
                        }
                    }
                }

                frameIndex++;
                setTimeout(shake, interval);
            } else {
                // End of sequence, successful catch
                const successFrames = [350, 375, 400, 0];
                let successIndex = 0;
                const successAnimation = () => {
                    if (successIndex < successFrames.length) {
                        this.setPokeballFrame(successFrames[successIndex]);
                        successIndex++;
                        setTimeout(successAnimation, 100);
                    } else {
                        if (this.onCatchSuccess) {
                            this.onCatchSuccess(this.pokemon);
                        }
                    }
                };
                successAnimation();
            }
        };
        shake();
    }

    startFailureSequence() {
        // Pokemon breaks free
        this.setPokeballFrame(250); // Ball opens
        this.pokemonSprite.classList.remove('captured'); // Pokemon reappears
        
        // Make pokeball fall
        Matter.Body.setStatic(this.pokeballBody, false);

        setTimeout(() => {
            if (this.onCatchFailure) {
                this.onCatchFailure(this.pokemon);
            }
        }, 1000); // Wait a bit before closing the view
    }

    respawnPokeball() {
        if (this.catchInProgress) return;
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
                Matter.Body.setStatic(this.pokeballBody, false);
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
                            if (!otherBody.isSensor) {
                                this.startCatchSequence();
                            }
                            break;
                        case 'ground':
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
                this.respawnPokeball();
            }

            this.animationFrameId = requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        Matter.World.clear(this.world);
        Matter.Engine.clear(this.engine);
    }
}