const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
];

let food = { x: 5, y: 5 };
let dx = 0;
let dy = -1;
let score = 0;
let gameSpeed = 100;
let gameOver = false;

function drawGame() {
    if (gameOver) {
        drawMalaysianFlag();
        ctx.fillStyle = "#FFCC00"; // Yellow
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("HABIS LAH!", canvas.width / 2, canvas.height / 2);
        ctx.strokeText("HABIS LAH!", canvas.width / 2, canvas.height / 2);
        playGameOverSound();
        return;
    }

    clearCanvas();
    moveSnake();
    checkCollision();
    drawFood();
    drawSnake();
    updateScore();

    setTimeout(drawGame, gameSpeed);
}

function clearCanvas() {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMalaysianFlag() {
    const w = canvas.width;
    const h = canvas.height;

    // Background stripes (14 stripes: 7 red, 7 white)
    const stripeHeight = h / 14;
    for (let i = 0; i < 14; i++) {
        ctx.fillStyle = (i % 2 === 0) ? "#C8102E" : "#FFFFFF";
        ctx.fillRect(0, i * stripeHeight, w, stripeHeight);
    }

    // Blue canton
    ctx.fillStyle = "#012169";
    ctx.fillRect(0, 0, w / 2, stripeHeight * 8);

    // Yellow crescent/star representation (Simplified)
    ctx.fillStyle = "#FFCC00";
    ctx.beginPath();
    ctx.arc(w / 4, stripeHeight * 4, stripeHeight * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Cut out to make it look a bit like a crescent
    ctx.fillStyle = "#012169";
    ctx.beginPath();
    ctx.arc(w / 4 + 10, stripeHeight * 4, stripeHeight * 1.8, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnake() {
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.fillStyle = "#FFCC00"; // Yellow head
        } else {
            // Alternating Red and White body
            ctx.fillStyle = (index % 2 === 0) ? "#C8102E" : "#FFFFFF";
        }
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        playEatSound();
        generateFood();
    } else {
        snake.pop();
    }
}

function playEatSound() {
    const utterance = new SpeechSynthesisUtterance("Nice lah!");
    utterance.lang = 'ms-MY';
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
}

let gameOverSoundPlayed = false;
function playGameOverSound() {
    if (gameOverSoundPlayed) return;
    
    const utterance = new SpeechSynthesisUtterance("Adoi, game finish already lah! Not bad effort lah tharma.");
    utterance.lang = 'ms-MY';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    
    gameOverSoundPlayed = true;
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "#00A859"; // Banana Leaf Green
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function updateScore() {
    scoreElement.innerText = `Nasi Lemak Packets: ${score}`;
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

drawGame();