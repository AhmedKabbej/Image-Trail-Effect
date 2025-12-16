import './style.css';
import { gsap } from 'gsap';

// --- Intro animée ---
function initIntro() {
    const introScreen = document.querySelector('.intro-screen');
    const introText = document.querySelector('.intro-text');
    const mainContent = document.querySelector('.main-content');

    const baseText = 'Welcome to my '; 
    const words = ['experience', 'imagetrial'];
    let wordIndex = 0;

    // Crée un span par lettre
    function createWordSpans(word) {
        const container = document.createElement('span');
        container.className = 'word';
        word.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.opacity = 0;
            container.appendChild(span);
        });
        return container;
    }

    // Initialisation
    introText.innerHTML = '';
    introText.appendChild(document.createTextNode(baseText));
    let wordContainer = createWordSpans(words[wordIndex]);
    introText.appendChild(wordContainer);

    const tl = gsap.timeline({
        onComplete: () => {
            mainContent.classList.add('active');
            initMainExperience();
        }
    });

    const duration = 0.5;
    const staggerTime = 0.05;
    const pause = 1;

    // Faire apparaître le premier mot
    tl.to(wordContainer.querySelectorAll('.char'), {
        opacity: 1,
        y: 0,
        duration: duration,
        stagger: staggerTime,
        ease: 'power3.out'
    })
    .to({}, { duration: pause }) // pause

    // Faire disparaître le premier mot et afficher le second
    .to(wordContainer.querySelectorAll('.char'), {
        opacity: 0,
        y: -50,
        duration: duration,
        stagger: staggerTime,
        ease: 'power3.in',
        onComplete: () => {
            wordIndex++;
            const newWord = createWordSpans(words[wordIndex]);
            introText.appendChild(newWord);
            wordContainer.remove();
            wordContainer = newWord;

            gsap.to(wordContainer.querySelectorAll('.char'), {
                opacity: 1,
                y: 0,
                duration: duration,
                stagger: staggerTime,
                ease: 'power3.out'
            });
        }
    })

    .to({}, { duration: pause }) // pause finale

    // Disparaît tout l'intro
    .to(introScreen, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            introScreen.style.display = 'none';
        }
    });
}



 // Settings controllables
 let throttleDelay = 100; // milliseconds between trail spawns
 let appearSpeed = 0.5;
 let disappearSpeed = 0.5;
 let disappearDelay = 0.8;

 // GUI Controls
 const spacingSlider = document.getElementById('spacing');
 const appearSlider = document.getElementById('appearSpeed');
 const disappearSlider = document.getElementById('disappearSpeed');
 const delaySlider = document.getElementById('disappearDelay');
 
 const spacingValue = document.getElementById('spacingValue');
 const appearValue = document.getElementById('appearValue');
 const disappearValue = document.getElementById('disappearValue');
 const delayValue = document.getElementById('delayValue');

 spacingSlider.addEventListener('input', (e) => {
     throttleDelay = parseInt(e.target.value);
     spacingValue.textContent = `${throttleDelay}ms`;
 });

 appearSlider.addEventListener('input', (e) => {
     appearSpeed = parseFloat(e.target.value);
     appearValue.textContent = `${appearSpeed}s`;
 });

 disappearSlider.addEventListener('input', (e) => {
     disappearSpeed = parseFloat(e.target.value);
     disappearValue.textContent = `${disappearSpeed}s`;
 });

 delaySlider.addEventListener('input', (e) => {
     disappearDelay = parseFloat(e.target.value);
     delayValue.textContent = `${disappearDelay}s`;
 });



// --- Expérience principale ---
function initMainExperience() {
    const totalImages = 10;
    const images = Array.from({ length: totalImages }, (_, i) => `/img${i + 1}.jpg`);

    const cursor = document.querySelector('.cursor');
    let mouseX = 0, mouseY = 0, currentImageIndex = 0, lastTime = 0;
    let throttleDelay = 100, appearSpeed = 0.5, disappearSpeed = 0.5, disappearDelay = 0.8;
    
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.3, ease: 'power2.out' });

        const now = Date.now();
        if (now - lastTime > throttleDelay) {
            createTrailImage(mouseX, mouseY);
            lastTime = now;
        }
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    function createTrailImage(x, y) {
        const trailImg = document.createElement('div');
        trailImg.className = 'trail-image';
        const img = document.createElement('img');
        img.src = images[currentImageIndex];
        trailImg.appendChild(img);
        document.body.appendChild(trailImg);

        currentImageIndex = (currentImageIndex + 1) % images.length;
        const rotation = (Math.random() - 0.5) * 30;

        gsap.set(trailImg, { x, y, rotation });
        const tl = gsap.timeline({ onComplete: () => trailImg.remove() });
        tl.to(trailImg, { scale: 1, opacity: 1, duration: appearSpeed, ease: 'back.out(1.7)' })
          .to(trailImg, { scale: 0.8, opacity: 0, duration: disappearSpeed, delay: disappearDelay, ease: 'power2.in' });

        gsap.to(trailImg, { y: y - 30, duration: appearSpeed + disappearSpeed + disappearDelay, ease: 'power1.out' });
    }

    // Précharger images
    images.forEach(src => new Image().src = src);
}

// --- Lancement ---
window.addEventListener('load', () => {
    initIntro();
});
