// script.js

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

document.addEventListener("DOMContentLoaded", function() {
   
   // Esperamos a que las fuentes estén cargadas para evitar que SplitText calcule mal las líneas.
    document.fonts.ready.then(function () {
        
        // --- Animación de scroll horizontal para las 'pills' ---
        const pillsSection = document.querySelector(".pills-horizontal-scroll");
        const pillsWrapper = document.querySelector(".pills-wrapper");

        if (pillsSection && pillsWrapper) {
            // Para crear un "retraso" en el scroll (un espacio donde el usuario hace scroll pero
            // el movimiento horizontal aún no ha comenzado), usamos una timeline.
            // Esto nos permite tener un control preciso sobre cuándo empieza la animación
            // sin afectar la posición del 'pin'.

             // Definimos una proporción para la pausa inicial y final.
            // Un valor de 0.1 significa que la pausa durará un 10% de la distancia
            // que dura la animación de movimiento principal.
            const startPauseRatio = 0.10;
            const endPauseRatio = 0.10;

            const horizontalScrollAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: pillsSection,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    // El final es la distancia del movimiento MÁS la distancia de AMBAS pausas.
                    end: () => {
                        const moveDistance = pillsWrapper.scrollWidth - window.innerWidth;
                        const totalScroll = moveDistance * (1 + startPauseRatio + endPauseRatio);
                        return `+=${totalScroll}`;
                    },
                    invalidateOnRefresh: true,
                }
            });
             // 1. Añadimos la animación de movimiento a la timeline, con un retraso para la pausa inicial.
            horizontalScrollAnim.to(pillsWrapper, {
                x: () => `-${pillsWrapper.scrollWidth - window.innerWidth}`,
                ease: "none",
                duration: 1, // La duración del movimiento es nuestra unidad base (1).
            }, startPauseRatio); // El tercer parámetro es la posición, que aquí actúa como el delay.
            // 2. Añadimos un tween vacío para crear la pausa final.
            // Su duración es relativa a la duración del movimiento (1).
            horizontalScrollAnim.to({}, { duration: endPauseRatio });

           // -- Animación de rotación del cursor durante el scroll horizontal --
            ScrollTrigger.create({
                trigger: pillsSection,
                start: "top top",
                end: () => { // El final debe coincidir con el final del pin
                    const moveDistance = pillsWrapper.scrollWidth - window.innerWidth;
                    const totalScroll = moveDistance * (1 + startPauseRatio + endPauseRatio);
                    return `+=${totalScroll}`;
                },
                invalidateOnRefresh: true,
                // Gira el cursor 90 grados suavemente al entrar/salir de la sección
                onEnter: () => gsap.to(".custom-cursor", { rotation: 90, duration: 0.5, ease: "power2.out" }),
                onLeave: () => gsap.to(".custom-cursor", { rotation: 0, duration: 0.5, ease: "power2.out" }),
                onEnterBack: () => gsap.to(".custom-cursor", { rotation: 90, duration: 0.5, ease: "power2.out" }),
                onLeaveBack: () => gsap.to(".custom-cursor", { rotation: 0, duration: 0.5, ease: "power2.out" })
            });
            
            // --Animación títulos de los pills -- //
            gsap.utils.toArray(".horizontal-pill").forEach(pill => {
                const textHighlights = pill.querySelectorAll(".pill-title .text-highlight");

                if (textHighlights.length > 0) {
                  
                    // 2. Animamos DESDE el placeholder HACIA el texto original.
                    gsap.to(textHighlights, {
                        duration: 1,
                        delay: 0.2,
                        scrambleText: {
                            text: "{original}", // El texto final al que queremos llegar.
                            chars: "lowerCase", // Caracteres a usar en el scramble.
                            speed: 0.5,
                            tweenLength: false
                        },
                        ease: "none",
                        scrollTrigger: {
                            trigger: pill, // El trigger es la 'pill' individual.
                            containerAnimation: horizontalScrollAnim, // Vincula el trigger al scroll horizontal.
                            start: "left 50%", // La animación empieza cuando la 'pill' está al 70% de la pantalla.
                            toggleActions: "play none none none", // La animación solo se ejecuta una vez.
                        }
                    });
                }
                    // -- Animación de cada texto descriptivo de los pills -- //
                const pillText = pill.querySelector(".pill-text");
                if(pillText) {
                    // Dividimos el texto en líneas para animarlas individualmente
                    const split = new SplitText(pillText, { type: "lines", linesClass: "line" });

                        gsap.from(split.lines, {
                            y: 50,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            stagger: 0.1, // Añadimos un pequeño retraso entre cada línea
                            scrollTrigger: {
                                trigger: pill,
                                containerAnimation: horizontalScrollAnim,
                                start: "left 30%", 
                                toggleActions: "play none none none",
                            }
                        });
                    }
                });
            }
        });

});
window.addEventListener("load", function() {
    // Fuerza a ScrollTrigger a recalcular todas las posiciones de inicio/fin
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        gsap.to(loaderContainer, {
            opacity: 0,
            duration: 0.5,
            delay: 0.5, // Pequeño delay para que se vea el loader
            onComplete: () => {
                loaderContainer.style.display = 'none';
                // Fuerza a ScrollTrigger a recalcular todas las posiciones de inicio/fin
                // DESPUÉS de que el loader se ha ido y el layout es estable.
                ScrollTrigger.refresh();
                console.log("ScrollTrigger refrescado después de la carga completa.");
            }
        });
    } else {
        // Si no hay loader, refrescar de todas formas.
        ScrollTrigger.refresh();
        console.log("ScrollTrigger refrescado después de la carga completa.");
    }
});