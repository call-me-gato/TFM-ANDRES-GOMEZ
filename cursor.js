document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');

    // Asegurarse de que el elemento del cursor exista
    if (cursor) {
        /// Posición objetivo (la del mouse real)
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        // Posición actual del cursor (la que se anima)
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        // Factor de suavizado (lerp). Un valor más bajo es más suave/lento.
        const speed = 0.4;
        // Centramos el origen del cursor para que el centro siga al puntero
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        // Actualizamos la posición del mouse real
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Bucle de animación con el ticker de GSAP (más eficiente)
        gsap.ticker.add(() => {
            // Calculamos la diferencia entre la posición actual y la objetivo
            const dx = mouse.x - pos.x;
            const dy = mouse.y - pos.y;

            // Movemos la posición actual una fracción de esa diferencia (lerping)
            pos.x += dx * speed;
            pos.y += dy * speed;

            // Aplicamos la nueva posición al elemento del cursor
            gsap.set(cursor, { x: pos.x, y: pos.y });
        });
    }
});