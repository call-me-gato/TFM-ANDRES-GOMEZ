const bubbleSketch = (p) => {
    let bubbles = [];
    let strokeColor;
    let gravityEnabled = false;
    let container;

    // Configuración de la física
    const FIXED_RADIUS = 20; // Mucho más pequeñas para que quepan muchas
    const GRAVITY_FORCE = 0.1; // Gravedad un poco más suave para estabilidad
    const BOUNCE_DAMPING = 0.4; // Menos rebote para que se asienten más rápido
    const FRICTION = 0.98; 
    const SLEEP_THRESHOLD = 0.5; // Velocidad debajo de la cual la burbuja se "duerme"

        p.setup = () => {
            container = document.getElementById('pill-img-1');
            let canvas = p.createCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
            canvas.id('bubble_canvas');


            let rootStyles = getComputedStyle(document.documentElement);
            let rawColor = rootStyles.getPropertyValue('--color-white').trim();
            strokeColor = p.color(rawColor);

            p.initGrid();

            // Activar gravedad después de 0.5 segundos
            setTimeout(() => {
                gravityEnabled = true;
            }, 100);
        };

        p.initGrid = () => {
            bubbles = [];
            let diameter = FIXED_RADIUS * 2;
            let spacing = 2; // Espacio muy pequeño entre ellas
            
            let cols = p.floor(p.width / (diameter + spacing));
            let rows = p.floor(p.height / (diameter + spacing));
            
            // Centrar el grid
            let startX = (p.width - (cols * (diameter + spacing))) / 2 + FIXED_RADIUS + spacing/2;
            let startY = (p.height - (rows * (diameter + spacing))) / 2 + FIXED_RADIUS + spacing/2;
            
            // Crear grid masivo
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    // Probabilidad del 90% para llenar casi todo pero dejar algunos huecos aleatorios
                    if (p.random() > 0.1) { 
                        let posX = startX + x * (diameter + spacing);
                        let posY = startY + y * (diameter + spacing);
                        bubbles.push(new p.Bubble(posX, posY));
                    }
                }
            }
        };

        p.draw = () => {
            p.clear();

            // Optimización: Dividir el loop de física en pasos más pequeños (sub-stepping)
            // ayuda a la estabilidad, pero para este demo visual simple, un paso está bien.
            
            if (gravityEnabled) {
                // Resolver Colisiones (Iteramos varias veces para mayor rigidez en el apilamiento)
                for (let k = 0; k < 2; k++) { // 2 pasadas de resolución
                    for (let i = 0; i < bubbles.length; i++) {
                        for (let j = i + 1; j < bubbles.length; j++) {
                            p.resolveCollision(bubbles[i], bubbles[j]);
                        }
                    }
                }
            }

            // Dibujar y Actualizar
            for (let b of bubbles) {
                b.update();
                b.display();
            }
        };

        p.resolveCollision = (b1, b2) => {
            let distVect = p5.Vector.sub(b2.pos, b1.pos);
            let distance = distVect.mag();
            let minDist = b1.r + b2.r;

            if (distance < minDist && distance > 0) {
                // CORRECCIÓN DE POSICIÓN
                let overlap = minDist - distance;
                // Separación suave (0.5 cada una)
                let correction = distVect.copy().normalize().mult(overlap / 2);
                
                b2.pos.add(correction);
                b1.pos.sub(correction);

                // INTERCAMBIO DE VELOCIDAD
                let normal = distVect.copy().normalize();
                let relativeVelocity = p5.Vector.sub(b2.vel, b1.vel);
                let velocityAlongNormal = relativeVelocity.dot(normal);

                if (velocityAlongNormal > 0) return;

                let j = -(1 + BOUNCE_DAMPING) * velocityAlongNormal;
                j /= 2;

                let impulse = normal.mult(j);
                b1.vel.sub(impulse);
                b2.vel.add(impulse);
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
            p.initGrid();
        };

        // --- CLASE BUBBLE ---
        p.Bubble = class {
            constructor(x, y) {
                this.r = FIXED_RADIUS; 
                this.pos = p.createVector(x, y);
                this.vel = p.createVector(0, 0);
                this.acc = p.createVector(0, 0);
                this.isSleeping = false; // Estado para optimizar vibración
            }

            update() {
                if (!gravityEnabled) return;

                // 1. Gravedad
                this.acc.y += GRAVITY_FORCE;

                // 2. Interacción Mouse (Repulsión)
                let mouse = p.createVector(p.mouseX, p.mouseY);
                let distMouse = p5.Vector.dist(this.pos, mouse);
                if (distMouse < 80) { // Radio de efecto del mouse
                    let dir = p5.Vector.sub(this.pos, mouse).normalize().mult(1.5);
                    this.acc.add(dir);
                    this.isSleeping = false; // Despertar si el mouse interactúa
                }

                // 3. Movimiento y Fricción
                this.vel.add(this.acc);
                this.vel.mult(FRICTION);
                
                // --- ESTABILIZACIÓN ANTI-VIBRACIÓN ---
                // Si la velocidad es muy baja, asumimos que está "asentada" y la paramos
                if (this.vel.magSq() < (SLEEP_THRESHOLD * SLEEP_THRESHOLD)) {
                    this.vel.set(0, 0);
                    this.isSleeping = true;
                } else {
                    this.isSleeping = false;
                    this.pos.add(this.vel);
                }
                
                this.acc.mult(0);

                // 4. Límites (Paredes)
                // Suelo
                if (this.pos.y > p.height - this.r) {
                    this.pos.y = p.height - this.r;
                    this.vel.y *= -BOUNCE_DAMPING;
                    if (p.abs(this.vel.y) < SLEEP_THRESHOLD) this.vel.y = 0;
                }
                // Techo
                if (this.pos.y < this.r) {
                    this.pos.y = this.r;
                    this.vel.y *= -BOUNCE_DAMPING;
                }
                // Paredes laterales
                if (this.pos.x > p.width - this.r) {
                    this.pos.x = p.width - this.r;
                    this.vel.x *= -BOUNCE_DAMPING;
                } else if (this.pos.x < this.r) {
                    this.pos.x = this.r;
                    this.vel.x *= -BOUNCE_DAMPING;
                }
            }

            display() {
                // Diseño minimalista: Solo borde blanco, fondo negro
                p.fill(0); 
                p.stroke(strokeColor);
                p.strokeWeight(1); // Línea fina
                p.ellipse(this.pos.x, this.pos.y, this.r * 2);
            }
        
        }
};
// Solo inicializar el sketch en dispositivos de escritorio para ahorrar recursos en móvil.
if (window.matchMedia("(min-width: 769px)").matches) {
    new p5(bubbleSketch, 'pill-img-1');
}