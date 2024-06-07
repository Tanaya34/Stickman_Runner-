const stickman = document.getElementById('stickman');
const obstacles = document.querySelectorAll('.obstacle');
const startButton = document.getElementById('startButton');
const scoreboard = document.getElementById('scoreboard');
const highscoreBoard = document.getElementById('highscore');
const gameOverMessage = document.getElementById('gameOverMessage');
let isJumping = false;
let jumpHeight = 150;  // Maximum jump height
let jumpSpeed = 20;    // Jump speed
let gravity = 10;       // Gravity effect
let stickmanSpeed = 2; // Stickman initial speed
let obstacleSpeed = 2; // Obstacle initial speed
let obstacleDistance = 500; // Initial distance between stickman and first obstacle
let obstacleSpacing = 150; // Spacing between obstacles
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameInterval;
let stickmanInterval;
let obstacleInterval;
let isPaused = false; 

highscoreBoard.textContent = 'High Score: ' + highscore;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isJumping) {
        jump();
    }
});

pauseButton.addEventListener('click', togglePause);

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        clearInterval(stickmanInterval);
        clearInterval(obstacleInterval);
        pauseButton.textContent = 'Resume';
    } else {
        startIntervals(); // Resume game intervals
        pauseButton.textContent = 'Pause';
    }
}

function startIntervals() {
    gameInterval = setInterval(() => {
        score++;
        scoreboard.textContent = 'Score: ' + score;
        checkCollision();
    }, 20);

    stickmanInterval = setInterval(() => {
        stickman.style.left = (parseInt(stickman.style.left) + stickmanSpeed) + 'px';
        if (parseInt(stickman.style.left) > 800) {
            stickman.style.left = '50px';
        }
    }, 20);

    obstacleInterval = setInterval(() => {
        obstacles.forEach(obstacle => {
            obstacle.style.right = (parseInt(obstacle.style.right) + obstacleSpeed) + 'px';
            if (parseInt(obstacle.style.right) > 800) {
                obstacle.style.right = '-50px';
            }
        });
    }, 20);
}

function startGame() {
    score = 0;
    scoreboard.textContent = 'Score: ' + score;
    stickman.style.left = '50px';
    stickman.style.bottom = '0px';
    startButton.style.display = 'none';
    gameOverMessage.style.display = 'none';

    // Reset obstacle positions
    obstacles.forEach((obstacle, index) => {
        obstacle.style.right = (obstacleDistance + (index * obstacleSpacing)) + 'px'; // Reset to initial position
    });

    gameInterval = setInterval(() => {
        score++;
        scoreboard.textContent = 'Score: ' + score;
        checkCollision();
    }, 20);

    stickmanInterval = setInterval(() => {
        stickman.style.left = (parseInt(stickman.style.left) + stickmanSpeed) + 'px';
        if (parseInt(stickman.style.left) > 800) {
            stickman.style.left = '50px';
        }
    }, 20);

    obstacleInterval = setInterval(() => {
        obstacles.forEach(obstacle => {
            obstacle.style.right = (parseInt(obstacle.style.right) + obstacleSpeed) + 'px';
            if (parseInt(obstacle.style.right) > 800) {
                obstacle.style.right = '-50px';
            }
        });
    }, 20);
}

function jump() {
    isJumping = true;
    let upInterval = setInterval(() => {
        if (parseInt(stickman.style.bottom) >= jumpHeight) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (parseInt(stickman.style.bottom) <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    stickman.style.bottom = '0px';
                } else {
                    stickman.style.bottom = (parseInt(stickman.style.bottom) - gravity) + 'px';
                }
            }, 20);
        } else {
            stickman.style.bottom = (parseInt(stickman.style.bottom) + jumpSpeed) + 'px';
        }
    }, 20);
}

function checkCollision() {
    const stickmanRect = stickman.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            stickmanRect.left < obstacleRect.right &&
            stickmanRect.right > obstacleRect.left &&
            stickmanRect.bottom > obstacleRect.top
        ) {
            clearInterval(gameInterval);
            clearInterval(stickmanInterval);
            clearInterval(obstacleInterval);
            gameOverMessage.style.display = 'block';
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('highscore', highscore);
                highscoreBoard.textContent = 'High Score: ' + highscore;
            }
            alert('Game Over! Your score: ' + score);
            startButton.style.display = 'block';
        }
    });
}
