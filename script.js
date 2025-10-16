const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

const box = 15;
let snake, food, score, direction, game;

function initGame() {
  snake = [{ x: 7 * box, y: 7 * box }];
  food = {
    x: Math.floor(Math.random() * 15) * box,
    y: Math.floor(Math.random() * 15) * box,
  };
  score = 0;
  direction = null;
  scoreDisplay.textContent = "Score: 0";
}

function drawGame() {
  ctx.clearRect(0, 0, 400, 400);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc77";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Check food collision
  if (headX === food.x && headY === food.y) {
    eatSound.play();
    score++;
    scoreDisplay.textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Check collisions
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= 400 ||
    headY >= 400 ||
    collision(newHead, snake)
  ) {
    gameOverSound.play();
    clearInterval(game);
    alert("💀 Game Over! Final Score: " + score);
    restartBtn.style.display = "inline-block";
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(seg => seg.x === head.x && seg.y === head.y);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

startBtn.addEventListener("click", () => {
  initGame();
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  game = setInterval(drawGame, 100);
});

restartBtn.addEventListener("click", () => {
  initGame();
  restartBtn.style.display = "none";
  game = setInterval(drawGame, 100);
});
initGame();