// scripts/pokedex/catching-game.js

export class CatchingGame {
    constructor(container, pokemon) {
        this.container = container;
        this.pokemon = pokemon;
        this.isThrown = false;
        this.animationFrameId = null;

        // Physics engine setup
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.world.gravity.y = 2; // A bit stronger gravity

        // We won't use the canvas renderer, but it's useful for debugging
        // const render = Matter.Render.create({
        //     element: this.container,
        //     engine: this.engine,
        //     options: { width: window.innerWidth, height: window.innerHeight, wireframes: true, background: 'transparent' }
        // });
        // Matter.Render.run(render);

        this.setupBounds();
        this.setupPokemon();
        this.setupPokeball();
        this.setupMouseConstraint();
        this.setupCollisionEvents();
    }

    setupBounds() {
        const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { 
            isStatic: true,
            isSensor: true, // It detects collisions but doesn't produce a physical response
            label: 'ground'
        });
        Matter.World.add(this.world, ground);
    }

    setupPokemon() {
        const pokemonSprite = this.container.querySelector('.wild-pokemon-sprite');
        const spriteRect = pokemonSprite.getBoundingClientRect();
        this.pokemonBody = Matter.Bodies.rectangle(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 2, spriteRect.width * 0.8, spriteRect.height * 0.8, {
            isStatic: true,
            isSensor: true,
            label: 'pokemon'
        });
        Matter.World.add(this.world, this.pokemonBody);
    }

    setupPokeball() {
        this.pokeballSprite = document.getElementById('pokeball-sprite');
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight - 80; // 80px from the bottom
        this.pokeballStartPosition = { x: startX, y: startY };
        
        this.pokeballBody = Matter.Bodies.circle(startX, startY, 32, { // 32 is radius for 64px sprite
            restitution: 0.5,
            friction: 0.1,
            density: 0.01,
            label: 'pokeball',
            isStatic: true // Start as static
        });
        Matter.World.add(this.world, this.pokeballBody);
    }

    respawnPokeball() {
        // Reset physics properties
        Matter.Body.setStatic(this.pokeballBody, true);
        Matter.Body.setPosition(this.pokeballBody, this.pokeballStartPosition);
        Matter.Body.setVelocity(this.pokeballBody, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.pokeballBody, 0);

        // Reset state and appearance
        this.isThrown = false;
        this.pokeballSprite.style.transform = 'rotate(0rad)';
        this.pokeballSprite.style.left = `${this.pokeballStartPosition.x - this.pokeballSprite.offsetWidth / 2}px`;
        this.pokeballSprite.style.top = `${this.pokeballStartPosition.y - this.pokeballSprite.offsetHeight / 2}px`;
        this.pokeballSprite.style.backgroundPosition = '0px 0px'; // Reset to frame 0

        // Trigger respawn animation
        this.pokeballSprite.classList.add('pokeball-respawn');
        setTimeout(() => {
            this.pokeballSprite.classList.remove('pokeball-respawn');
        }, 300); // Duration of the animation
    }

    setupMouseConstraint() {
        this.mouse = Matter.Mouse.create(this.container);
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        Matter.World.add(this.world, this.mouseConstraint);

        Matter.Events.on(this.mouseConstraint, 'mousedown', (event) => {
            if (this.mouseConstraint.body === this.pokeballBody) {
                Matter.Body.setStatic(this.pokeballBody, false);
            }
        });

        Matter.Events.on(this.mouseConstraint, 'enddrag', (event) => {
            if (event.body === this.pokeballBody) {
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
                if (pair.bodyA === this.pokeballBody || pair.bodyB === this.pokeballBody) {
                    const otherBody = pair.bodyA === this.pokeballBody ? pair.bodyB : pair.bodyA;
                    if (otherBody.label === 'ground' || otherBody.label === 'pokemon') {
                        this.isThrown = false; // Stop the animation loop
                    }
                }
            }
        });
    }

    throwAnimationLoop() {
        if (!this.isThrown) {
            this.pokeballSprite.style.backgroundPosition = '0px 0px'; // Reset to default frame
            return;
        }
        
        const frames = [200, 175, 150, 125, 100, 75, 50, 25];
        const frameHeight = 64; // Each frame is 64px high now
        let currentFrameIndex = 0;

        const animate = () => {
            if (!this.isThrown) return;
            // The vertical position on the sprite sheet is calculated differently now
            // We need to find the row number and multiply by the new frame height
            const frameRow = Math.floor(frames[currentFrameIndex] / 25);
            const frameY = frameRow * frameHeight;
            this.pokeballSprite.style.backgroundPosition = `0px -${frameY}px`;
            currentFrameIndex = (currentFrameIndex + 1) % frames.length;
            setTimeout(animate, 50); // Adjust for animation speed
        };
        animate();
    }

    run() {
        const gameLoop = () => {
            Matter.Engine.update(this.engine);

            // Sync sprite to physics body
            const pos = this.pokeballBody.position;
            this.pokeballSprite.style.left = `${pos.x - this.pokeballSprite.offsetWidth / 2}px`;
            this.pokeballSprite.style.top = `${pos.y - this.pokeballSprite.offsetHeight / 2}px`;
            this.pokeballSprite.style.transform = `rotate(${this.pokeballBody.angle}rad)`;

            // Check if the pokeball is off-screen
            if (pos.y > window.innerHeight + 200) { // 200px buffer
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