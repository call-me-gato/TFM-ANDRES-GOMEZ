const splitGravitySketch = (p) => {
        
        let particles = [];
        let strokeColor;
        let bgColor;
        
        // --- CONTROL DE ESTADOS ---
        let state = 'WAITING'; // Estados posibles: 'WAITING', 'EXPLODING', 'RETURNING'
        let stateTimer = 0;

        // Tiempos (milisegundos)
        const TIME_TO_WAIT = 500;      // Tiempo quieto en grid inicial
        const TIME_TO_EXPLODE = 4000;   // Duración de la caída/apilamiento
        
        // Configuración Física
        const BOUNCE_RESTITUTION = 0.3;
        const FRICTION = 0.98; 
        const WALL_DAMPING = 0.5; 

        p.setup = () => {
            container = document.getElementById('pill-img-3');
            let canvas = p.createCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5)
            canvas.id('sorting_canvas');

            let rootStyles = getComputedStyle(document.documentElement);
            let rawWhite = rootStyles.getPropertyValue('--color-white').trim();
            let rawBg = rootStyles.getPropertyValue('--color-black').trim();
            
            strokeColor = p.color(rawWhite || '#ffffff');
            bgColor = p.color(rawBg || '#000000');

            initGrid();
            stateTimer = p.millis();
        };

        const initGrid = () => {
            particles = [];
            state = 'WAITING';
            stateTimer = p.millis();

            let r = 15; 
            let spacing = r * 2.2; 
            
            let gridWidth = p.width * 0.4; 
            let cols = Math.floor(gridWidth / spacing);
            let rows = 14; 
            
            let startX = (p.width - (cols * spacing)) / 2;
            let startY = (p.height - (rows * spacing)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let x = startX + i * spacing;
                    let y = startY + j * spacing;
                    particles.push(new Particle(x, y, r));
                }
            }
        };

        p.draw = () => {
            p.background(bgColor);
            p.stroke(strokeColor);
            p.strokeWeight(1);
            p.fill(bgColor);

            let elapsed = p.millis() - stateTimer;

            // --- MÁQUINA DE ESTADOS ---

            // 1. ESPERANDO (Grid quieto)
            if (state === 'WAITING') {
                if (elapsed > TIME_TO_WAIT) {
                    state = 'EXPLODING';
                    triggerExplosion();
                    stateTimer = p.millis(); // Reset timer para el nuevo estado
                }
            }
            
            // 2. EXPLOTANDO (Gravedad y paredes)
            else if (state === 'EXPLODING') {
                if (elapsed > TIME_TO_EXPLODE) {
                    state = 'RETURNING';
                    // No reseteamos timer aquí, lo manejamos en la lógica de retorno
                }
            }

            // 3. RETORNANDO (Vuelo de vuelta)
            else if (state === 'RETURNING') {
                // Verificar si todas llegaron a casa
                let allHome = particles.every(pt => pt.isHome);
                
                if (allHome) {
                    // Si todas llegaron, reiniciar ciclo
                    state = 'WAITING';
                    particles.forEach(pt => pt.resetPhysics()); // Limpiar velocidades residuales
                    stateTimer = p.millis();
                }
            }

            // --- FÍSICA Y DIBUJO ---
            
            // Actualizar lógica individual según el estado
            particles.forEach(pt => pt.update(state));

            // Colisiones solo durante la explosión
            if (state === 'EXPLODING') {
                const ITERATIONS = 4;
                for (let k = 0; k < ITERATIONS; k++) {
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            resolveCollision(particles[i], particles[j]);
                        }
                    }
                    particles.forEach(pt => pt.checkWalls());
                }
            }

            particles.forEach(pt => pt.display());
        };

        const resolveCollision = (p1, p2) => {
            let distVect = p5.Vector.sub(p2.pos, p1.pos);
            let distance = distVect.mag();
            let minDist = p1.r + p2.r;

            if (distance < minDist && distance > 0) {
                let overlap = minDist - distance;
                let correction = distVect.copy().normalize().mult(overlap / 2);
                p2.pos.add(correction);
                p1.pos.sub(correction);

                let normal = distVect.copy().normalize();
                let relativeVelocity = p5.Vector.sub(p2.vel, p1.vel);
                let velocityAlongNormal = relativeVelocity.dot(normal);

                if (velocityAlongNormal > 0) return;

                let j = -(1 + BOUNCE_RESTITUTION) * velocityAlongNormal;
                j /= 2;

                let impulse = normal.mult(j);
                p1.vel.sub(impulse);
                p2.vel.add(impulse);
            }
        };

        const triggerExplosion = () => {
            particles.forEach(pt => {
                let direction = p.random() > 0.5 ? 1 : -1;
                pt.activateGravity(direction);
            });
        };

        p.windowResized = () => {
            p.resizeCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
            initGrid();
        };

        class Particle {
            constructor(x, y, r) {
                this.origin = p.createVector(x, y); // Recordar dónde nací
                this.pos = p.createVector(x, y);
                this.vel = p.createVector(0, 0);
                this.acc = p.createVector(0, 0);
                this.r = r;
                this.gravityDir = 0;
                this.isHome = true; 
            }

            activateGravity(direction) {
                this.gravityDir = direction;
                this.vel.y = p.random(-2, 2);
                this.vel.x = p.random(-0.5, 0.5); 
                this.isHome = false;
            }

            resetPhysics() {
                this.vel.mult(0);
                this.acc.mult(0);
                this.pos.set(this.origin); // Asegurar posición exacta
                this.isHome = true;
            }

            update(currentState) {
                if (currentState === 'EXPLODING') {
                    // Física normal de caída
                    let gravityForce = p.createVector(this.gravityDir * 0.8, 0);
                    this.acc.add(gravityForce);
                    this.vel.add(this.acc);
                    this.vel.mult(FRICTION);
                    this.pos.add(this.vel);
                    this.acc.mult(0);
                } 
                else if (currentState === 'RETURNING') {
                    // Física de retorno (Lerp / Atracción)
                    // Usamos lerp para un movimiento suave magnético hacia el origen
                    this.pos.lerp(this.origin, 0.05); // 0.05 es la velocidad de retorno (0 a 1)
                    
                    // Comprobar si llegué
                    let d = p5.Vector.dist(this.pos, this.origin);
                    if (d < 1) {
                        this.isHome = true;
                        this.pos.set(this.origin); // Snap final
                    } else {
                        this.isHome = false;
                    }
                }
            }

            checkWalls() {
                // Pared Derecha
                if (this.pos.x > p.width - this.r) {
                    this.pos.x = p.width - this.r;
                    this.vel.x *= -WALL_DAMPING;
                    this.vel.y *= 0.95; 
                }
                // Pared Izquierda
                else if (this.pos.x < this.r) {
                    this.pos.x = this.r;
                    this.vel.x *= -WALL_DAMPING;
                    this.vel.y *= 0.95;
                }
                // Piso
                if (this.pos.y > p.height - this.r) {
                    this.pos.y = p.height - this.r;
                    this.vel.y *= -WALL_DAMPING;
                    this.vel.x *= 0.9; 
                }
                // Techo
                else if (this.pos.y < this.r) {
                    this.pos.y = this.r;
                    this.vel.y *= -WALL_DAMPING;
                }
            }

            display() {
                p.ellipse(this.pos.x, this.pos.y, this.r * 2);
            }
        }
    };

    new p5(splitGravitySketch, 'pill-img-3');