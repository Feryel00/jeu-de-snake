const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; 
const rows = canvas.height / gridSize;
const columns = canvas.width / gridSize;

let snake;
let fruit;
let gameInterval;
let score = 0;
let level = 1;

const levels = [
    { obstacles: [{ x: 10, y: 10 }, { x: 15, y: 5 }, { x: 8, y: 17 }], speed: 200 },
    { obstacles: [{ x: 5, y: 8 }, { x: 12, y: 12 }, { x: 17, y: 3 },{ x: 10, y: 1 },{ x: 8, y: 17 },{ x: 1, y: 15 }, { x: 18, y: 18 }], speed: 120 },
    { obstacles: [{ x: 3, y: 3 }, { x: 6, y: 15 }, { x: 18, y: 10 }, { x: 2, y: 12 }, { x: 14, y: 5 },{ x: 1, y: 15 }, { x: 18, y: 18 },{ x: 17, y: 17 }], speed: 80 }
];



function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = gridSize;
    this.ySpeed = 0;
    this.total = 1;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#66ff66";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, gridSize, gridSize);
        }
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }
        if (this.y >= canvas.height) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = canvas.width - gridSize;
        }
        if (this.y < 0) {
            this.y = canvas.height - gridSize;
        }
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed !== gridSize) {
                    this.xSpeed = 0;
                    this.ySpeed = -gridSize;
                }
                break;
            case 'Down':
                if (this.ySpeed !== -gridSize) {
                    this.xSpeed = 0;
                    this.ySpeed = gridSize;
                }
                break;
            case 'Left':
                if (this.xSpeed !== gridSize) {
                    this.xSpeed = -gridSize;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed !== -gridSize) {
                    this.xSpeed = gridSize;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            score += 10;
            document.getElementById('score').innerText = score;
            return true;
        }
        return false;
    };
}

function Fruit() {
    this.x = (Math.floor(Math.random() * rows)) * gridSize;
    this.y = (Math.floor(Math.random() * columns)) * gridSize;

    this.draw = function() {
        ctx.fillStyle = "#ff6666";
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    };

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * rows)) * gridSize;
        this.y = (Math.floor(Math.random() * columns)) * gridSize;
    };
}


/*function drawApple(x, y, size) {
  ctx.fillStyle = "red"; // Couleur de la pomme
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2); // la pomme (cercle)
  ctx.fill();

  ctx.fillStyle = "green"; // Couleur pour la tige
  ctx.fillRect(x - 3, y - size - 5, 6, 5); // la tige de la pomme (rectangle)
}*/

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObstacles();
  snake.draw();
  fruit.draw();
  /*drawApple(fruit.x + gridSize / 2, fruit.y + gridSize / 2, gridSize / 2);   */
  checkCollision();
}



function update() {
  snake.update();
  if (snake.eat(fruit)) {
      fruit.pickLocation();
  }
}

function startGame() {
    snake = new Snake();
    fruit = new Fruit();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        update();
        draw();
    }, levels[level - 1].speed);
}

function pauseGame() {
    clearInterval(gameInterval);
}

function resetGame() {
    score = 0;
    level = 1;
    clearInterval(gameInterval);
    startGame();
}

function nextLevel() {
    if (level < levels.length) {
        level++;
        clearInterval(gameInterval);
        startGame();
        document.getElementById('level').innerText = level;
    } else {
        alert("Congratulations! You've completed all levels!");
    }
}

function drawObstacles() {
    ctx.fillStyle = "#333";
    for (let i = 0; i < levels[level - 1].obstacles.length; i++) {
        ctx.fillRect(levels[level - 1].obstacles[i].x * gridSize, levels[level - 1].obstacles[i].y * gridSize, gridSize, gridSize);
    }
}

function checkCollision() {
  for (let i = 0; i < levels[level - 1].obstacles.length; i++) {
      if (snake.x === levels[level - 1].obstacles[i].x * gridSize && snake.y === levels[level - 1].obstacles[i].y * gridSize) {
          gameOver();
      }
  }

  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
      gameOver();
  }
}


function gameOver() {
    clearInterval(gameInterval);
    alert("Game Over! Your score is: " + score);
}



document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('resetButton').addEventListener('click', resetGame);
document.getElementById('nextLevelButton').addEventListener('click', nextLevel);

document.addEventListener('keydown', (evt) => {
    let direction = '';
    switch (evt.key) {
        case 'ArrowUp':
            direction = 'Up';
            break;
        case 'ArrowDown':
            direction = 'Down';
            break;
        case 'ArrowLeft':
            direction = 'Left';
            break;
        case 'ArrowRight':
            direction = 'Right';
            break;
        default:
            break;
    }
    if (direction) {
        evt.preventDefault();
        snake.changeDirection(direction);
    }
});
