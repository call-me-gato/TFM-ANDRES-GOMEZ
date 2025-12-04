const explosionSketch = (p) => {
        
    let particles = [];
    let strokeColor;
    let bgColor;
    
    // Configuración dinámica
    let bigCircleRadius; // Ya no es constante, se calcula
    const PARTICLE_COUNT = 200;
    const PARTICLE_RADIUS = 6;
    
    // Tiempos
    const SHAKE_DURATION = 1500; // 1.5 segundos temblando
    const EXPLOSION_DURATION = 4000; // 4 segundos de caos rebotando
    
    // Estados: 'SHAKING', 'EXPLODING', 'RETURNING'
    let state = 'SHAKING';
    let stateTimer = 0;

    p.setup = () => {
        container = document.getElementById('pill-img-4');
        let canvas = p.createCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5)
        canvas.id('anger_canvas');

        let rootStyles = getComputedStyle(document.documentElement);
        let rawWhite = rootStyles.getPropertyValue('--color-white').trim();
        let rawBg = rootStyles.getPropertyValue('--color-black').trim();
        
        strokeColor = p.color(rawWhite || '#ffffff');
        bgColor = p.color(rawBg || '#000000');

        calculateSize(); // Calcular tamaño inicial
        initParticles();
        stateTimer = p.millis();
    };

    const calculateSize = () => {
        // El diámetro será el 50% de la dimensión más pequeña (ancho o alto)
        // El radio es la mitad del diámetro (por eso * 0.25)
        let minDimension = Math.min(p.windowWidth, p.windowHeight);
        bigCircleRadius = minDimension * 0.25;
    };

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    };

    p.draw = () => {
        p.background(bgColor);
        p.stroke(strokeColor);
        p.strokeWeight(1.5);
        p.fill(bgColor); 

        let elapsed = p.millis() - stateTimer;
        let center = p.createVector(p.width / 2, p.height / 2);

        // --- FASE 1: TEMBLOR ---
        if (state === 'SHAKING') {
            p.push();
            p.translate(center.x, center.y);
            
            let progress = elapsed / SHAKE_DURATION; 
            let shakeMagnitude = p.map(progress * progress, 0, 1, 1, 20); // Un poco más intenso al final
            
            let shakeX = p.random(-shakeMagnitude, shakeMagnitude);
            let shakeY = p.random(-shakeMagnitude, shakeMagnitude);
            
            // Usamos la variable calculada bigCircleRadius
            p.ellipse(shakeX, shakeY, bigCircleRadius * 2);
            p.pop();

            if (elapsed > SHAKE_DURATION) {
                triggerExplosion();
                state = 'EXPLODING';
                stateTimer = p.millis();
            }
        }
        
        // --- FASE 2 Y 3: EXPLOSIÓN Y RETORNO ---
        else {
            if (state === 'EXPLODING' && elapsed > EXPLOSION_DURATION) {
                state = 'RETURNING';
            }

            let allHome = true;

            particles.forEach(pt => {
                pt.update(state, center);
                pt.display();
                
                if (!pt.isHome) allHome = false;
            });

            if (state === 'RETURNING' && allHome) {
                state = 'SHAKING';
                stateTimer = p.millis();
            }
        }
    };

    const triggerExplosion = () => {
        particles.forEach(pt => {
            pt.explode();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
        calculateSize(); // Recalcular si cambia el tamaño de ventana
    };

    // --- CLASE PARTICLE ---
    class Particle {
        constructor() {
            this.pos = p.createVector(p.width / 2, p.height / 2);
            this.vel = p.createVector(0, 0);
            this.isHome = true;
        }

        explode() {
            this.pos = p.createVector(p.width / 2, p.height / 2);
            
            let angle = p.random(p.TWO_PI);
            // Ajustamos la fuerza para que sea proporcional al tamaño de la pantalla
            // Así las partículas viajan lo suficiente en pantallas grandes
            let forceBase = Math.min(p.width, p.height) * 0.02; // 2% del tamaño de pantalla
            let force = p.random(forceBase * 0.8, forceBase * 2); 
            
            this.vel = p.createVector(p.cos(angle), p.sin(angle)).mult(force);
            this.isHome = false;
        }

        update(currentState, center) {
            if (currentState === 'EXPLODING') {
                // 1. Mover
                this.pos.add(this.vel);
                
                // 2. REBOTE EN PAREDES
                // Invertimos la velocidad si tocamos un borde
                if (this.pos.x < PARTICLE_RADIUS || this.pos.x > p.width - PARTICLE_RADIUS) {
                    this.vel.x *= -1;
                    // Constrain asegura que no se queden pegadas fuera de la pantalla
                    this.pos.x = p.constrain(this.pos.x, PARTICLE_RADIUS, p.width - PARTICLE_RADIUS);
                }
                
                if (this.pos.y < PARTICLE_RADIUS || this.pos.y > p.height - PARTICLE_RADIUS) {
                    this.vel.y *= -1;
                    this.pos.y = p.constrain(this.pos.y, PARTICLE_RADIUS, p.height - PARTICLE_RADIUS);
                }

                // Nota: Eliminé la fricción para que mantengan la energía rebotando
            } 
            else if (currentState === 'RETURNING') {
                // Física de retorno: Atracción magnética fuerte
                this.pos.lerp(center, 0.08); 
                
                let d = p5.Vector.dist(this.pos, center);
                if (d < 5) {
                    this.isHome = true;
                } else {
                    this.isHome = false;
                }
            }
        }

        display() {
            if (state !== 'SHAKING') {
                p.ellipse(this.pos.x, this.pos.y, PARTICLE_RADIUS * 2);
            }
        }
    }
};

// Solo inicializar el sketch en dispositivos de escritorio para ahorrar recursos en móvil.
if (window.matchMedia("(min-width: 769px)").matches) {
    new p5(explosionSketch, 'pill-img-4');
}