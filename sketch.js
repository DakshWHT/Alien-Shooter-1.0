const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Load images
const playerImg = new Image();
playerImg.src = 'jet.png';

const alienImg1 = new Image();
alienImg1.src = 'rock.png';

const alienImg2 = new Image();
alienImg2.src = 'rock2.png';

const medKitImg = new Image();
medKitImg.src = 'med.png';


let player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 100,
    width: 95,
    height: 75,
    speed: 5,
    dx: 0
};

let bullets = [];
let aliens = [];
let score = 0;
let lives = 5;
let plevel = 1;  // Player level
let alienFrequency = 700;  // Use let instead of const
let fireRockFrequency = 3000;  // Use let instead of const
let medKitFrequency = 10000;  // Use let instead of const

let alienInterval;
let fireRockInterval;
let medKitInterval;

let keysPressed = {};

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function movePlayer() {
    let targetDx = 0;
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
        targetDx = player.speed;
    } else if (keysPressed['ArrowLeft'] || keysPressed['a']) {
        targetDx = -player.speed;
    }

    // Apply acceleration or deceleration
    const acceleration = 0.3;  // Adjust for smoother/slower acceleration
    player.dx += (targetDx - player.dx) * acceleration;

    player.x += player.dx;

    // Wall collision
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function createBullet() {

    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 20,
        speed: 12     
        });
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });
    
    // Remove bullets off screen
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

function createAlien() {
    const size = Math.random() * 50 + 45;
    const x = Math.random() * (canvas.width - size);
    const img = Math.random() < 0.5 ? alienImg1 : alienImg2;  // Randomly choose an image
    const speed = 2; // Normal speed for regular aliens

    aliens.push({
        x: x,
        y: -size,
        width: size,
        height: size,
        speed: speed,
        img: img
    });
}

function drawAliens() {
    aliens.forEach(alien => {
        ctx.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
    });
}

function moveAliens() {
    aliens.forEach(alien => {
        alien.y += alien.speed;
    });
    
    // Remove aliens off screen
    aliens = aliens.filter(alien => alien.y < canvas.height);
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                
                // Remove bullet and alien on collision
                bullets.splice(bulletIndex, 1);
                aliens.splice(alienIndex, 1);
                score++;
                document.getElementById('score').textContent = score;
            }
        });
    });
}

function detectPlayerCollision() {
    aliens.forEach((alien, alienIndex) => {
        if (player.x < alien.x + alien.width &&
            player.x + player.width > alien.x &&
            player.y < alien.y + alien.height &&
            player.y + player.height > alien.y) {
            
            // Remove alien on collision with player and reduce life
            aliens.splice(alienIndex, 1);
            lives--;
            document.getElementById('lives').textContent = lives;
            
            if (lives <= 0) {
                alert('Game Over!');
                document.location.reload();
            }
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawAliens();
    movePlayer();
    moveBullets();
    moveAliens();
    detectCollisions();
    detectPlayerCollision();
    requestAnimationFrame(update);
}

function keyDown(e) {
    keysPressed[e.key] = true;

    // Space bar to shoot
    if (e.key === ' ' || e.key === 'Spacebar') {
        createBullet();
    }
}

function keyUp(e) {
    keysPressed[e.key] = false;
}

function updateIntervals() {
    // Clear existing intervals
    clearInterval(alienInterval);
    clearInterval(fireRockInterval);
    clearInterval(medKitInterval);
    
    // Log to debug interval updates
    console.log(`Updating intervals for Level: ${plevel}`);
    console.log(`Alien Frequency: ${alienFrequency}, Fire Rock Frequency: ${fireRockFrequency}, Med Kit Frequency: ${medKitFrequency}`);

    // Set new intervals based on updated frequencies
    alienInterval = setInterval(createAlien, alienFrequency);
    fireRockInterval = setInterval(createFireRock, fireRockFrequency);
    medKitInterval = setInterval(createMedKit, medKitFrequency);
}

function init() {
    alienInterval = setInterval(createAlien, alienFrequency);
    update();
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
init();
