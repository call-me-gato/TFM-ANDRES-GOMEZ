const glueSketch = (p) => {
    let particles = [];
    let glueColor;
    let bgColor;
    let container;
    
    // Configuración
    const PARTICLE_COUNT = 200;
    const CONNECT_DIST = 100;
    const MOUSE_RADIUS = 200;

    p.setup = () => {
        container = document.getElementById('pill-img-2');
        let canvas = p.createCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
        
        canvas.id('glue_canvas');

        let rootStyles = getComputedStyle(document.documentElement);
        let rawWhite = rootStyles.getPropertyValue('--color-white').trim();
        let rawBg = rootStyles.getPropertyValue('--color-black').trim();
        
        glueColor = p.color(rawWhite || '#ffffff');
        bgColor = p.color(rawBg || '#000000');

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new p.GlueParticle());
        }
    };

    p.draw = () => {
        p.background(bgColor);
        
        // --- CAMBIO DE ESTILO: Stroke Blanco, Relleno Negro ---
        p.stroke(glueColor);
        p.strokeWeight(1); // Grosor de líneaca
        p.fill(bgColor);     // Relleno negro (oculta líneas traseras)

        // 1. Dibujar conexiones PRIMERO (para que queden detrás de las partículas)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let p1 = particles[i];
                let p2 = particles[j];
                
                let d = p5.Vector.dist(p1.pos, p2.pos);

                if (d < CONNECT_DIST) {
                    p.drawViscousConnection(p1, p2, d);
                }
            }
        }

        // 2. Dibujar partículas DESPUÉS (tapando las uniones de los conectores)
        for (let particle of particles) {
            particle.update();
            p.ellipse(particle.pos.x, particle.pos.y, particle.r * 2);
        }
    };

    p.drawViscousConnection = (p1, p2, d) => {
        let r1 = p1.r;
        let r2 = p2.r;
        
        let u = p5.Vector.sub(p2.pos, p1.pos);
        let angle = p.atan2(u.y, u.x);
        
        let spread = p.map(d, 0, CONNECT_DIST, p.PI * 0.6, 0.1);
        
        let p1_upper = p.createVector(p1.pos.x + r1 * p.cos(angle + spread), p1.pos.y + r1 * p.sin(angle + spread));
        let p1_lower = p.createVector(p1.pos.x + r1 * p.cos(angle - spread), p1.pos.y + r1 * p.sin(angle - spread));
        
        let p2_upper = p.createVector(p2.pos.x + r2 * p.cos(angle + p.PI - spread), p2.pos.y + r2 * p.sin(angle + p.PI - spread));
        let p2_lower = p.createVector(p2.pos.x + r2 * p.cos(angle + p.PI + spread), p2.pos.y + r2 * p.sin(angle + p.PI + spread));

        let handleLen = d * 0.5; 

        p.beginShape();
        p.vertex(p1_upper.x, p1_upper.y);
        
        p.bezierVertex(
            p1.pos.x + handleLen * p.cos(angle), p1.pos.y + handleLen * p.sin(angle),
            p2.pos.x - handleLen * p.cos(angle), p2.pos.y - handleLen * p.sin(angle),
            p2_upper.x, p2_upper.y
        );
        
        p.vertex(p2_lower.x, p2_lower.y);
        
        p.bezierVertex(
            p2.pos.x - handleLen * p.cos(angle), p2.pos.y - handleLen * p.sin(angle),
            p1.pos.x + handleLen * p.cos(angle), p1.pos.y + handleLen * p.sin(angle),
            p1_lower.x, p1_lower.y
        );
        
        p.endShape(p.CLOSE);
    };

    p.GlueParticle = class {
        constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p5.Vector.random2D().mult(p.random(0.2, 0.8));
            this.r = p.random(8, 16);
            this.noiseOffset = p.random(1000);
        }

        update() {
            let nX = p.map(p.noise(this.noiseOffset), 0, 1, -0.5, 0.5);
            let nY = p.map(p.noise(this.noiseOffset + 1000), 0, 1, -0.5, 0.5);
            this.vel.add(p.createVector(nX, nY).mult(0.05));
            
            let mouse = p.createVector(p.mouseX, p.mouseY);
            let d = p5.Vector.dist(this.pos, mouse);
            
            if (d < MOUSE_RADIUS) {
                let attraction = p5.Vector.sub(mouse, this.pos);
                attraction.normalize();
                let strength = p.map(d, 0, MOUSE_RADIUS, 0.5, 0);
                attraction.mult(strength);
                this.vel.add(attraction);
            }

            this.vel.mult(0.96); 
            this.vel.limit(3);

            this.pos.add(this.vel);
            this.noiseOffset += 0.01;

            if (this.pos.x < 0) this.pos.x = p.width;
            if (this.pos.x > p.width) this.pos.x = 0;
            if (this.pos.y < 0) this.pos.y = p.height;
            if (this.pos.y > p.height) this.pos.y = 0;
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(container.clientWidth / 1.5, container.clientHeight / 1.5);
    };
};
new p5(glueSketch, 'pill-img-2');