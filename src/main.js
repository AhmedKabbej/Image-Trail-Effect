import './style.css'
import { gsap } from 'gsap'



// ==================== INTRO ANIMATION ====================
function initIntro() {
    const introScreen = document.querySelector('.intro-screen');
    const introText = document.querySelector('.intro-text');
    const mainContent = document.querySelector('.main-content');

    // Split text into characters

    const text = introText.textContent.trim()
    introText.innerHTML = ''

    text.split('').forEach((char, i) => {
        const span = document.createElement('span')
        span.className = 'char'
        span.textContent = char === ' ' ? '\u00A0' : char

        // petit décalage aléatoire façon GSAP
        span.dataset.delay = Math.random() * 0.3
        span.dataset.y = Math.random() * 40 + 40
        span.dataset.rotate = Math.random() * 30 - 15

        introText.appendChild(span)
    })

    const chars = document.querySelectorAll('.char')


    // Intro timeline
    const tl = gsap.timeline({
        onComplete: () => {
            // Activate main content after intro
            mainContent.classList.add('active');
            initMainExperience();
        }
    });

    // Animate characters in
    tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out'
    })
        // Hold for a moment
        .to({}, { duration: 1 })
        // Animate characters out
        .to(chars, {
            opacity: 0,
            y: -50,
            duration: 0.6,
            stagger: 0.03,
            ease: 'power3.in'
        })
        // Fade out intro screen
        .to(introScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                introScreen.style.display = 'none';
            }
        });
}

// mon experience principal / test
function initMainExperience() {
    // Configuration - Images depuis le dossier public
    const totalImages = 10; // Nombre total d'images (img1.png à img10.jpg)
    const images = Array.from({ length: totalImages }, (_, i) => `/img${i + 1}.jpg`);

    const cursor = document.querySelector('.cursor');
    let mouseX = 0;
    let mouseY = 0;
    let currentImageIndex = 0;
    let lastTime = 0;

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

    // Custom cursor follow
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.3,
            ease: 'power2.out'
        });

        // Throttled image trail creation
        const currentTime = Date.now();
        if (currentTime - lastTime > throttleDelay) {
            createTrailImage(mouseX, mouseY);
            lastTime = currentTime;
        }
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    function createTrailImage(x, y) {
        const trailImg = document.createElement('div');
        trailImg.className = 'trail-image';

        const img = document.createElement('img');
        img.src = images[currentImageIndex];
        trailImg.appendChild(img);

        document.body.appendChild(trailImg);

        // Cycle through images
        currentImageIndex = (currentImageIndex + 1) % images.length;

        // Random rotation
        const rotation = (Math.random() - 0.5) * 30;

        // Set initial position
        gsap.set(trailImg, {
            x: x,
            y: y,
            rotation: rotation
        });

        // Animate in and out
        const tl = gsap.timeline({
            onComplete: () => trailImg.remove()
        });

        tl.to(trailImg, {
            scale: 1,
            opacity: 1,
            duration: appearSpeed,
            ease: 'back.out(1.7)'
        })
            .to(trailImg, {
                scale: 0.8,
                opacity: 0,
                duration: disappearSpeed,
                delay: disappearDelay,
                ease: 'power2.in'
            });

        // Slight float animation
        gsap.to(trailImg, {
            y: y - 30,
            duration: appearSpeed + disappearSpeed + disappearDelay,
            ease: 'power1.out'
        });
    }

    // Preload images
    function preloadImages() {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();
}

// ==================== INITIALIZE ====================
window.addEventListener('load', () => {
    initIntro();
});