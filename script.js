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
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("sorry lah finish d one", canvas.width / 10, canvas.height / 2);
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

let gameOverSoundPlayed = false;
function playGameOverSound() {
    if (gameOverSoundPlayed) return;
    
    const utterance = new SpeechSynthesisUtterance("aiyo sorry lah game finish d liyao hahaha");
    utterance.lang = 'ms-MY';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    
    gameOverSoundPlayed = true;
}

function clearCanvas() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#2ecc71";
    snake.forEach((part, index) => {
        // Head is a different color
        if (index === 0) {
            ctx.fillStyle = "#27ae60";
        } else {
            ctx.fillStyle = "#2ecc71";
        }
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        playEatSound();
        generateFood();
    } else {
        snake.pop();
    }
}

function playEatSound() {
    // Using Web Speech API to say "Walao"
    const utterance = new SpeechSynthesisUtterance("Walao");
    utterance.lang = 'ms-MY'; // Set to Malaysian Malay for the accent
    utterance.rate = 1.2;      // Slightly faster for a punchier sound
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function updateScore() {
    scoreElement.innerText = `Score: ${score}`;
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