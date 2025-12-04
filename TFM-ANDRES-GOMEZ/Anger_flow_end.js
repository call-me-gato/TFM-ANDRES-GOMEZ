
// 1. REGISTRAR PLUGINS
gsap.registerPlugin(ScrollTrigger, Physics2DPlugin, SplitText, ScrambleTextPlugin);

window.addEventListener("load", function() {
  
    // ========================================================
    // ANIMACIÓN DE EXPLOSIÓN DE IRA (PHYSICS2D)
    // ========================================================

    const angerSection = document.querySelector('.breakout-anger');
    const angerTitle = document.querySelector('.anger-title');
    const subtitle = document.querySelector('.anger-subtitle');

    const particleSVGs = [
        '<img src="assets/img/angry_face.svg" width="80" height="80">', 
        '<img src="assets/img/fuckyou.svg" width="80" height="80">',
        '<img src="assets/img/badwords.svg" width="80" height="80">',
    ];
    
    const particleCount = 30; // Cantidad de partículas
    let currentExplosion; // Variable para mantener una referencia a la animación en curso

    // Esta función crea y ejecuta toda la animación desde cero.
    function createAndPlayExplosion() {
        // --- A. CREAR ELEMENTOS ---
        const particleContainer = document.createElement('div');
        particleContainer.classList.add('particle-container');
        angerSection.appendChild(particleContainer);

        const titleRect = angerTitle.getBoundingClientRect();
        const sectionRect = angerSection.getBoundingClientRect();
        const spawnX = (titleRect.left + titleRect.width / 2) - sectionRect.left;
        const spawnY = (titleRect.top + titleRect.height / 2) - sectionRect.top;

        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const el = document.createElement('div');
            el.classList.add('anger-particle');
            el.innerHTML = particleSVGs[Math.floor(Math.random() * particleSVGs.length)];
            particleContainer.appendChild(el);
            particles.push(el);

            gsap.set(el, {
                x: spawnX + gsap.utils.random(-500, 500),
                y: spawnY + gsap.utils.random(-500, 500),
                scale: 0,
            });
        }

        const split = new SplitText(subtitle, { type: "lines", linesClass: "line" });

        // --- B. CREAR LA LÍNEA DE TIEMPO ---
        currentExplosion = gsap.timeline({
            onComplete: () => {
                particleContainer.remove(); // Elimina el contenedor de partículas.
                split.revert(); // Limpia el SplitText para la próxima vez.
                currentExplosion = null; // Limpia la referencia.
            }
        });

        // Animación de física para cada partícula
        particles.forEach(p => {
            currentExplosion.to(p, {
                duration: gsap.utils.random(2, 3),
                physics2D: {
                    velocity: gsap.utils.random(500, 900),
                    angle: gsap.utils.random(250, 290),
                    gravity: gsap.utils.random(600, 1000)
                },
                opacity: 1, // Se mantienen visibles hasta que caen fuera de la pantalla
                rotation: gsap.utils.random(-720, 720),
                keyframes: {
                    scale: [1.5, 0], // Anima la escala de 0 -> 2 -> 0
                    ease: 'power2.inOut'
                },
                ease: "power1.out"
            }, gsap.utils.random(0, 0.2));
        });

        // Sacudida al texto del título
        currentExplosion.from(angerTitle, {
            duration: 0.5,
            x: gsap.utils.random(-10, 10),
            y: gsap.utils.random(-5, 5),
            rotation: gsap.utils.random(-5, 5),
            ease: "elastic.out(1, 0.3)"
        }, 0);

        // Animación subtitulo
        currentExplosion.from(split.lines, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
        }, '<0.5');
    }

     // --- C. CREAR EL SCROLLTRIGGER ---
     ScrollTrigger.create({
        trigger: '.breakout-anger',
        start: "top 30%",
        onEnter: () => {
            // Si no hay una animación en curso, crea y ejecuta una nueva.
            if (!currentExplosion) {
                createAndPlayExplosion();
            }
        },
        onLeaveBack: () => {
            // Al subir, matamos la animación actual para "resetearla".
            // Esto dispara su onComplete, que limpia todo.
            if (currentExplosion) {
                currentExplosion.progress(1).kill();
            }
        }
    });
    // --- Animación del flowchart --- //
    const flowchartSection = document.querySelector('.flowchart');
    if (flowchartSection) {
        const flowBoxes = gsap.utils.toArray('.flow-box');
        const flowLines = gsap.utils.toArray('.flow-line');
        const flowBoxParas = gsap.utils.toArray('.flow-box p');

        // Establecer estados iniciales
        gsap.set(flowBoxes, { autoAlpha: 0, y: 50 });
        gsap.set(flowLines, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left' });

        const flowchartTl = gsap.timeline({
            scrollTrigger: {
                trigger: flowchartSection,
                start: "top 60%",
                end: "bottom 100%",
                scrub: 2,
            }
        });
        
        flowBoxes.forEach((box, i) => {
            flowchartTl.to(box, { autoAlpha: 1, y: 0, duration: 1 });
            const p = flowBoxParas[i];
            if (p) {
            const split = new SplitText(p, { type: "lines", linesClass: "line-anim" });
            flowchartTl.from(split.lines, { y: 50, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 });
            }
            if (flowLines[i]) {
                flowchartTl.to(flowLines[i], { autoAlpha: 1, scaleX: 1, duration: 1 });
            }
        });
    }  
    
    // --- Animación del footer ---
    const footerSection = document.querySelector('.footer');
    if (footerSection) {
        const finalLogo = footerSection.querySelector('.final-logo');
        const finalLogoHighlight = finalLogo.querySelector('.final-logo-highlight');
        const scrambleTargets = finalLogo.querySelectorAll('.scramble-target');
        

        // Creamos una timeline para el footer
        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: footerSection,
                start: "top center",
                toggleActions: "play none none reset",
            }
        });

        // 1. Animación del letter-spacing en el contenedor principal del logo
        footerTl.fromTo(finalLogo, 
            { opacity: 0, letterSpacing: '2em' }, // Estado inicial con espaciado amplio
            { opacity: 1, letterSpacing: '-0.08em', ease: 'power2.out', duration: 1.5 }
        );
         // 1b. Animación de scrambleText en los elementos de texto hijos para no perder el HTML
         footerTl.to(scrambleTargets, {
            duration: 1.5,
            scrambleText: {
                text: "{original}", // Usa el texto original como destino, preservando HTML interno
                chars: "upperCase", // Caracteres para el efecto
                speed: 0.5,
            }
        }, 0);

        // // 2. Animación del fondo del footer usando las variables CSS
        footerTl.to(footerSection, {
                    '--grad-stop-1': '5%',
                    '--grad-stop-2': '70%',
                    ease: 'sine.inOut',
                    duration: 3,
                }, -0.5);

        // 3. Animación de rotación para el highlight del logo
        footerTl.to(finalLogoHighlight,
            { rotation: -7, ease: 'power2.out', duration: 2 },
            0   
        );
    }


});

