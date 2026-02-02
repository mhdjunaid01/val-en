// ===== STATE MANAGEMENT =====
let noClickCount = 0;

// ===== DOM ELEMENTS =====
const mainImage = document.getElementById('mainImage');
const caption = document.getElementById('caption');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const confettiCanvas = document.getElementById('confettiCanvas');
const successContainer = document.getElementById('successContainer');

// ===== CONFIGURATION =====
const MAX_IMAGES = 5;
const IMAGES = [
    'public/initial-image.jpeg', // Initial (Custom user image)
    'public/image1.jpeg', // 1st NO
    'public/image2.jpeg', // 2nd NO
    'public/image3.jpeg', // 3rd NO
    'public/image4.jpeg', // 4th NO (Final)
    'public/image5.jpeg'  // YES (Success)
];

const CAPTIONS = [
    "<span class='intro-text'>hey shaa</span>Will you be my Valentine? 💕",           // Initial
    "kaddikkum njn yes paranjillel 😡",       // 1st NO
    "yendh bangiya baby ne kanaan.. yes para babee 🥺", // 2nd NO
    "allelum njamala aarkkum vendallo 😭",    // 3rd NO
    "yes paranja umma theraam 😘"             // 4th NO
];

// ===== PRELOAD IMAGES =====
IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
});

// ===== PRELOAD AUDIO =====
const successAudio = new Audio('public/tada-fanfare-a-6313.mp3');
successAudio.preload = 'auto';
successAudio.load();

// ===== UPDATE UI FUNCTION =====
function updateUI(count) {
    // 1. Update Image with Fade Effect
    mainImage.classList.remove('fade-in');
    mainImage.classList.add('fade-out');

    setTimeout(() => {
        mainImage.src = IMAGES[count] || IMAGES[0];
        mainImage.classList.remove('fade-out');
        mainImage.classList.add('fade-in');
    }, 200);

    // 2. Update Caption
    caption.innerHTML = CAPTIONS[count] || CAPTIONS[0];

    // 3. Update Buttons
    // Reset scale classes first
    yesBtn.className = 'btn btn-yes';

    // Calculate scale factor
    let scale = 1 + (count * 0.2); // Grows: 1.2, 1.4, 1.6, 1.8
    yesBtn.style.transform = `scale(${scale})`;

    // No button shrinks
    if (count < 4) {
        noBtn.style.transform = `scale(${1 - count * 0.1})`;
        moveNoButton();
    } else {
        noBtn.classList.add('hidden');
        noBtn.style.display = 'none'; // Force hide just in case
    }
}

// ===== MOVE NO BUTTON =====
function moveNoButton() {
    const rect = noBtn.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // First time adjustment: Escape container but keep visual position
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
        noBtn.style.position = 'fixed';
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
        noBtn.style.transition = 'none'; // No processing

        // Force reflow
        void noBtn.offsetHeight;
    }

    // Calculate max positions
    const maxX = windowWidth - rect.width - 20;
    const maxY = windowHeight - rect.height - 20;

    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);

    // Animate to new position
    noBtn.style.transition = 'all 1.5s linear';
    noBtn.style.position = 'fixed'; // Ensure fixed
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '9999';
}

// ===== CLICK HANDLERS =====
noBtn.addEventListener('click', () => {
    if (noClickCount < 4) {
        noClickCount++;
        console.log(`NO Clicked: ${noClickCount}`);
        updateUI(noClickCount);
    }
});

yesBtn.addEventListener('click', () => {
    console.log("YES Clicked! Success!");

    // Success visuals
    mainImage.src = IMAGES[5]; // Success Image
    caption.innerHTML = "YAYYY ❤️<br>ente valentine nee thanne 😘";

    // Sound Effect (Play Immediately)
    successAudio.currentTime = 0;
    successAudio.play().catch(e => console.log("Audio play failed:", e));

    // Confetti
    resizeConfettiCanvas();
    celebrateWithConfetti();

    // Hide buttons
    yesBtn.classList.add('hidden');
    noBtn.classList.add('hidden');
});


// ===== CONFETTI (Reused from previous) =====
function resizeConfettiCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCanvas.style.width = "100vw";
    confettiCanvas.style.height = "100vh";
}
window.addEventListener("resize", resizeConfettiCanvas);

const confettiInstance = confetti.create(confettiCanvas, {
    resize: false,
    useWorker: true
});

function celebrateWithConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confettiInstance({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#ff4d94', '#ffb3d9', '#ffe4f0']
        });
        confettiInstance({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#ff4d94', '#ffb3d9', '#ffe4f0']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

    setTimeout(() => {
        confettiInstance({
            particleCount: 150,
            spread: 120,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#ff4d94', '#ffb3d9', '#ffe4f0', '#e6007a']
        });
    }, 200);
}

// ===== FLOATING BACKGROUND =====
function createFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-bg';
    document.body.prepend(container);

    const emojis = ['❤️', '💖', '💝', '💕', '🌸', '☁️', '✨'];

    // Create initial batch
    for (let i = 0; i < 15; i++) {
        spawnHeart(container, emojis, true);
    }

    // Continuous spawning
    setInterval(() => {
        spawnHeart(container, emojis);
    }, 800);
}

function spawnHeart(container, emojis, initial = false) {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random Properties
    const size = Math.floor(Math.random() * 20) + 15; // 15px - 35px
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10; // 10s - 20s
    const delay = initial ? Math.random() * -20 : 0; // Negative delay for initial batch to fill screen

    el.style.fontSize = `${size}px`;
    el.style.left = `${left}vw`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);

    // Cleanup
    setTimeout(() => {
        el.remove();
    }, (duration + 1) * 1000);
}

// Start Background
createFloatingHearts();

// ===== BACKGROUND TEXT =====
function createBackgroundText() {
    const container = document.getElementById('bgScrollText');
    const text = "i love u shaa  ❤️  ";
    const repeatedText = text.repeat(20); // Make it long enough

    // Create 15 rows
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('div');
        row.className = 'bg-scroll-row';
        row.textContent = repeatedText;
        container.appendChild(row);
    }
}
createBackgroundText();
