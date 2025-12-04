gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

document.addEventListener("DOMContentLoaded", function() {
    // colores variables en # //
    const rootStyles = getComputedStyle(document.documentElement);
    const realWhite = rootStyles.getPropertyValue('--color-white').trim();
    const realBlack = rootStyles.getPropertyValue('--color-black').trim();
    const realBlue = rootStyles.getPropertyValue('--color-blue').trim();
    const realGray = rootStyles.getPropertyValue('--color-gray').trim();
    

    // 1. El Array de Frases
    const noisePhrases = [
        "Not My President!",
        "<#TotalFraud>",
        "// They stole the election.",
        "if (you_dont_like_this_country) { leave(); }",
        "They're a band of criminals.",
        "The dictatorship is already here.",
        "Left-Wing === Hunger && Misery.",
        "Right-Wing === Fascism && Hate.",
        "All politicians are corrupt.",
        "TRAITOR TO THE NATION!",
        "He's a puppet for [X].",
        "<#TheResistanceContinues>",
        "Wake up! You're being manipulated.",
        "They just repeat what they're told.",
        "CRY, PARAMILITARY, YOUR BUSINESS IS ENDING",
        "I am NOT willing to give the country away to a bunch of bandits",
        "Stop 'progressivism'.",
        "They want to impose an ideology.",
        "It's all staged.",
        "Complicit with the regime.",
        "We cannot coexist with 'them'.",
        "They are the enemy of the people.",
        "It's a witch hunt!",
        "<#LawAndOrder>",
        "Defend your flag.",
        "They're leading us into a civil war.",
        "They have no morals.",
        "This is an existential threat.",
        "<#NoToThePlebiscite>",
        "We must defend democracy.",
        "We have to burn it all down.",
        "This can only be fixed with an iron fist.",
        "They live in a bubble.",
        "They are indoctrinating our children!",
        "Cancel culture",
        "You can't say anything anymore.",
        "Inclusive language is stupidity.",
        "Modern feminism hates men.",
        "If you're not an ally, you're part of the problem.",
        "It limits freedom of speech",
        "What about academic freedom?",
        "That's hate speech.",
        "They want to erase history!",
        "White privilege!",
        "Meritocracy doesn't exist.",
        "Gender equality, woke.",
        "Alerting about climate change, woke.",
        "They are destroying innocence.",
        "He's a gender terrorist.",
        "They get offended by everything.",
        "Snowflake generation.",
        "OK, Boomer.",
        "I do not wish to have homosexuals as neighbors",
        "Racist!",
        "Classist!",
        "Misogynist!",
        "Feminazi!",
        "Stop sexualizing everything.",
        "The patriarchy is to blame.",
        "The 'woke' ideology is the problem.",
        "In the face of job shortages, men should have more right to a job than women",
        "He's just a bitter man.",
        "She's just a frustrated woman.",
        "Vaccines have microchips.",
        "Bill Gates developed the coronavirus",
        "Drinking lemon and gargling is a good way to prevent COVID-19",
        "It's just a flu.",
        "Big Pharma is poisoning us.",
        "<#FreedomNotMasks>",
        "The unvaccinated are second-class citizens.",
        "Beards and mustaches favor the spread of COVID-19",
        "Ivermectin is the miracle cure they're hiding.",
        "They are inflating the death numbers.",
        "5G causes the virus.",
        "It's a population control plan.",
        "The hospitals are empty, it's a hoax.",
        "It's a 'plandemic'.",
        "They want us locked down.",
        "Chlorine dioxide cures everything.",
        "Masks don't work.",
        "Vaccines cause autism.",
        "It's a global experiment.",
        "Bill Gates wants to reduce the world population.",
        "The vaccinated are 'sheep'.",
        "It's a WHO conspiracy.",
        "Vaccines modify your DNA.",
        "The new strain is MORE deadly.",
        "The natural immune system is enough.",
        "The media is lying.",
        "Nostradamus predicted this.",
        "The Simpsons predicted this.",
        "If you're poor, it's because you want to be.",
        "Nobody gets rich by working.",
        "<#EatTheRich>",
        "They want to take everything from you.",
        "Socialism only brings misery.",
        "Capitalism is essentially racist",
        "The rich must pay what they owe.",
        "You live off the government.",
        "Parasite.",
        "Freedom is more important than equality",
        "Immigrants are taking our jobs.",
        "The unemployed could find a job if they wanted to",
        "The market regulates itself.",
        "Savage capitalism is killing us.",
        "Competition is good.",
        "They are destroying the middle class.",
        "The 1% controls us.",
        "Taxes are theft.",
        "It's a pyramid scheme.",
        "Stop complaining and work harder.",
        "We are drowning in taxes.",
        "Billionaires pay nothing.",
        "Class hatred.",
        "Aporophobia",
        "The capitalist dream is a lie.",
        "There isn't enough for everyone.",
        "De-growth is the only solution.",
        "Growth solves everything.",
        "They are stealing your pension.",
        "It's the unions' fault.",
        "Sold-out press.",
        "Don't just get informed, inform yourself.",
        "The earth is flat, stop lying.",
        "They are spraying us (Chemtrails).",
        "Politicians are lizard people.",
        "Climate change is an invention to control us.",
        "Agenda 2030.",
        "The New World Order.",
        "QAnon.",
        "They are controlling the weather (HAARP).",
        "They are silencing the truth.",
        "Soros is behind it all.",
        "The Illuminati.",
        "Don't believe anything you read.",
        "The elites hate us.",
        "Follow the money.",
        "The moon landing was fake.",
        "Governments are hiding the cure for cancer.",
        "We are in the Matrix.",
        "Green energy scam.",
        "Carbon tax theft.",
        "The ice caps are actually growing.",
        "Eco-terrorists are running the government.",
        "They want to ban cars.",
        "Cow farts aren't killing the planet.",
        "Buy Bitcoin, exit the system.",
        "Gold is the only real money.",
        "The dollar is collapsing.",
        "Hyperinflation is here.",
        "They are printing money to rob you.",
        "Rug pull imminent.",
        "Crypto scam.",
        "NFTs are money laundering.",
        "Ponzi economy.",
        "Corporate greed.",
        "Shrinkflation.",
        "Trans genocide.",
        "Heteronormativity.",
        "Toxic masculinity.",
        "The future is female.",
        "Multiculturalism failed.",
        "Go back to where you came from.",
        "Globalist agenda.",
        "World War III started yesterday.",
        "The West has fallen.",
        "Dark MAGA.",
        "Voting doesn't matter.",
        "Selection not election.",
        "Trumptard.",
        "NPC behavior.",
        "Mainstream media is the virus.",
        "Epstein didn't kill himself.",
        "Ghislaine Maxwell list.",
        "AI will replace us.",
        "ChatGPT is biased.",
        "Project Blue Beam.",
        "Moon landing was a Kubrick film.",
        "Obey.",
        "Black Mirror IRL.",
        "Social distancing.",
        "Microplastics in your blood.",
    ];

     // --- Optimización de la animación de frases con Canvas ---

     const container = document.querySelector(".noise-overlay");
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     container.appendChild(canvas);
 
     const quantity = 300;
     const phrases = [];
     const glitchingPhrases = []; // Array para las frases en estado "glitch"
 
     // Función para ajustar el tamaño del canvas al de la ventana
     function resizeCanvas() {
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
     }
     window.addEventListener('resize', resizeCanvas);
     resizeCanvas(); // Ajuste inicial
 
     // Clase para gestionar cada frase como un objeto
     class Phrase {
         constructor() {
             this.text = gsap.utils.random(noisePhrases);
             this.x = gsap.utils.random(0, canvas.width);
             this.y = gsap.utils.random(0, canvas.height);
             this.fontSize = gsap.utils.random(0.8, 1.5);
             this.fontSizeFactor = Math.random(); // Factor de tamaño base entre 0 y 1
             this.updateFontSize(); // Establece el tamaño inicial
             this.baseOpacity = gsap.utils.random(0.5, 1);
             this.opacity = 0; // Inicia invisible
             this.color = realGray;
             this.fontWeight = '100';
             this.shadowBlur = 0;
             this.shadowColor = 'transparent';
 
             // Propiedades para simular el ScrambleText
             this.scrambleChars = "abcdefghijklmnopqrstuvwxyz1234567890<>#*[]/";
             this.scrambleProgress = 0; // 0 = todo mezclado, 1 = revelado
             this.currentText = this._getScrambledText();
 
             this._animate();
         }

         updateFontSize() {
            const isMobile = window.innerWidth < 768;
            const minSize = isMobile ? 0.5 : 0.8; // Rango más pequeño en móvil
            const maxSize = isMobile ? 1.0 : 1.5; // Rango más pequeño en móvil
            // Mapea el factor de tamaño al rango de tamaño de fuente actual (móvil/escritorio)
            // para mantener la proporción de tamaños entre las frases.
            this.fontSize = gsap.utils.mapRange(0, 1, minSize, maxSize, this.fontSizeFactor);
         }
 
         // Genera el texto mezclado basado en el progreso
         _getScrambledText() {
             let scrambled = '';
             const revealPosition = Math.floor(this.text.length * this.scrambleProgress);
             for (let i = 0; i < this.text.length; i++) {
                 if (i < revealPosition) {
                     scrambled += this.text[i];
                 } else {
                     scrambled += gsap.utils.random(this.scrambleChars.split(''));
                 }
             }
             return scrambled;
         }
 
         // Timeline de GSAP para animar las propiedades del objeto
         _animate() {
             const fadeDuration = gsap.utils.mapRange(0.5, 1, 5, 10, this.baseOpacity);
             const scrambleDuration = 0.8;
 
             gsap.timeline({
                 repeat: -1,
                 delay: gsap.utils.random(0, 10),
                 onUpdate: () => {
                     // Actualiza el texto a dibujar en cada frame de la animación de scramble
                     this.currentText = this._getScrambledText();
                 }
             })
             // 1. Aparece con efecto scramble
             .to(this, {
                 scrambleProgress: 1,
                 opacity: this.baseOpacity,
                 duration: scrambleDuration,
                 ease: "none",
             })
             // 2. Mantiene la frase visible y estática
             .to(this, {
                 duration: fadeDuration - scrambleDuration,
             })
             // 3. Desaparece
             .to(this, {
                 opacity: 0,
                 duration: 1,
             })
             // 4. Resetea propiedades para el siguiente ciclo (más eficiente que crear nuevos objetos)
             .set(this, {
                 scrambleProgress: 0,
                 x: gsap.utils.random(0, canvas.width),
                 y: gsap.utils.random(0, canvas.height),
                 text: gsap.utils.random(noisePhrases),
             });
         }
 
         // Dibuja la frase en el canvas
         draw(ctx) {
             ctx.font = `${this.fontWeight} ${this.fontSize}rem 'Roboto Mono', monospace`;
             ctx.fillStyle = this.color;
             ctx.globalAlpha = this.opacity;
             ctx.shadowBlur = this.shadowBlur;
             ctx.shadowColor = this.shadowColor;
             ctx.fillText(this.currentText, this.x, this.y);
         }
     }
 
     // Crear los objetos de frases
     for (let i = 0; i < quantity; i++) {
         phrases.push(new Phrase());
     }
 
     // Función para el efecto "glitch"
     function triggerRandomGlitch() {
         // Solo seleccionar de las frases que no están ya en glitch
         if (phrases.length === 0) {
            const nextGlitchDelay = gsap.utils.random(0.1, 0.5);
            gsap.delayedCall(nextGlitchDelay, triggerRandomGlitch);
            return;
         }
 
         const randomPhrase = gsap.utils.random(phrases);
 
         // Limita la frecuencia de los glitches a ~50% de las llamadas
         if (randomPhrase && Math.random() > 0.2) {
             const originalOpacity = randomPhrase.opacity;
             
             // Mover la frase al array de glitching para que se dibuje encima
             const index = phrases.indexOf(randomPhrase);
             if (index > -1) {
                 phrases.splice(index, 1);
                 glitchingPhrases.push(randomPhrase);
             }
             gsap.timeline({
                onComplete: () => {
                    // Cuando la animación de glitch termina, devolver la frase al array principal
                    const glitchIndex = glitchingPhrases.indexOf(randomPhrase);
                    if (glitchIndex > -1) {
                        glitchingPhrases.splice(glitchIndex, 1);
                        phrases.push(randomPhrase);
                    }
                }
             }).to(randomPhrase, {
                 duration: 0.2,
                 opacity: 1,
                 color: realWhite,
                 shadowBlur: 18,
                 shadowColor: realWhite,
                 fontWeight: "400",
                 ease: "steps(5)",
             })
             .to(randomPhrase, {
                 duration: gsap.utils.random(2, 4),
                 ease: "none",
             })
             .to(randomPhrase, {
                 duration: 0.4,
                 opacity: originalOpacity, // Vuelve a la opacidad que tenía
                 color: realGray,
                 shadowBlur: 0,
                 fontWeight: "100",
                 ease: "power1.out",
             });
         }
 
         const nextGlitchDelay = gsap.utils.random(0.1, 0.5);
         gsap.delayedCall(nextGlitchDelay, triggerRandomGlitch);
     }
 
     // Bucle principal de dibujado que se ejecuta en cada frame
     function draw() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         phrases.forEach(phrase => phrase.draw(ctx));
         glitchingPhrases.forEach(phrase => phrase.draw(ctx)); // Dibujar estas al final para que aparezcan encima
 
     }
 
     gsap.ticker.add(draw); // Engancha la función de dibujado al "ticker" de GSAP
     gsap.delayedCall(2, triggerRandomGlitch); // Inicia los glitches
     
      // Función para ajustar el tamaño del canvas al de la ventana
      function resizeCanvas() {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Si las dimensiones anteriores eran 0, no podemos escalar.
        if (oldWidth === 0 || oldHeight === 0) return;

        // Reposicionar las frases existentes para que mantengan su posición relativa
        phrases.forEach(phrase => {
            phrase.x = (phrase.x / oldWidth) * canvas.width;
            phrase.y = (phrase.y / oldHeight) * canvas.height;
            phrase.updateFontSize();
        });
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Ajuste inicial
 
 

    // Animación para el título principal y CTA del hero //
    
        const titleElement = document.querySelector(".hero-title");
        // Guardamos el HTML original (incluido el <br>) para mantener estructura y saltos de línea
        const originalTitleHTML = titleElement.innerHTML;
        const cta = document.querySelectorAll(".callout-text, .scroll-indicator");
        
        // 1. Definir el estado inicial (no cambiamos el texto para no perder el <br>)
        gsap.set(titleElement, { 
            autoAlpha: 1, 
            color: realWhite, 
            textShadow: `0 0 30px ${realWhite}`
        });
        gsap.set(cta, { 
            autoAlpha: 0, 
            yPercent:20,
        });


        const tl = gsap.timeline();
        tl.to(titleElement, { 
            duration: 2, 
            delay: 0,
            scrambleText: {
                // Usamos el mismo contenido original con el <br> para que se mantengan
                // el número de caracteres, la disposición en dos líneas y la posición
                text: originalTitleHTML, 
                chars: "lowerCase", 
                speed: 0.6,       
                tweenLength: false,
            },
            ease: "power2.inOut" 
        });
        tl.to(titleElement, {
            delay: 0,
            duration: 3,
            color: realBlack, 
            webkitTextStroke: `1px ${realWhite}`,
            textShadow: `0 0 30px ${realGray}`, 
            ease: "power2.inOut"
        });
        tl.to(cta, {
           duration: 1,
           yPercent: 0,
           autoAlpha: 1,
           ease: "power2.inOut"
        }, "-=3");


});