let snake;
let food;
let scl = 30;
let score = 0;
let gameStarted = false; // Initialize flag to false
let obstacles = []; // Array to store obstacle positions

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new Snake();
  pickLocation();
  frameRate(10);

  // Add obstacles to the array
  obstacles.push(createVector(50 * scl, 3 * scl));
  obstacles.push(createVector(50 * scl, 4 * scl));
  obstacles.push(createVector(50 * scl, 5 * scl));

  obstacles.push(createVector(6 * scl, 6 * scl));
  obstacles.push(createVector(7 * scl, 6 * scl));
  obstacles.push(createVector(8 * scl, 6 * scl));

  obstacles.push(createVector(25 * scl, 3 * scl));
  obstacles.push(createVector(25 * scl, 4 * scl));
  obstacles.push(createVector(25 * scl, 5 * scl));
  obstacles.push(createVector(25 * scl, 6 * scl));
  obstacles.push(createVector(25 * scl, 7 * scl));

  obstacles.push(createVector(13 * scl, 12 * scl));
  obstacles.push(createVector(14 * scl, 12 * scl));
  obstacles.push(createVector(15 * scl, 12 * scl));
  obstacles.push(createVector(16 * scl, 12 * scl));
  obstacles.push(createVector(17 * scl, 12 * scl));
  obstacles.push(createVector(18 * scl, 12 * scl));
  obstacles.push(createVector(19 * scl, 12 * scl));

  obstacles.push(createVector(30 * scl, 3 * scl));
  obstacles.push(createVector(30 * scl, 4 * scl));
  obstacles.push(createVector(30 * scl, 5 * scl));
}

function drawWall(x, y, w, h) {
  fill(100, 100, 100); // Set fill color to dark gray
  rect(x, y, w, h); // Draw a rectangle to represent the wall
}

function draw() {
    // Set the background color to white
    background(255);
    // Draw the obstacles on the canvas
    fill(200); // Set fill color to light gray
    for (let i = 0; i < obstacles.length; i++) {
        rect(obstacles[i].x, obstacles[i].y, scl, scl); // Draw each obstacle as a rectangle
    }
    if (gameStarted) {
        if (snake.eat(food)) {
            pickLocation();
            score++;
        }
        snake.death(obstacles);
        snake.update();
    }
    // Draw the snake on the canvas
    snake.show();
    // Draw the food on the canvas as a red rectangle
    fill(255, 0, 100);
    rect(food.x, food.y, scl, scl);
    // Display the current score and high score in white text
    textSize(32);
    fill(124, 14, 161);
    text("Your current score: " + score, 10, 40);
}

// generate food location
function pickLocation() {
    let cols = floor(width / scl);
    let rows = floor(height / scl);
    let newLocation = createVector(floor(random(cols)), floor(random(rows)));
    newLocation.mult(scl);

    // Check for collision with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (newLocation.equals(obstacles[i])) {
            // Collision detected, generate new location
            return pickLocation();
        }
    }

    // Check for collision with food
    if (newLocation.equals(food)) {
        // Collision detected, generate new location
        return pickLocation();
    }

    // No collision, use the new location
    food = newLocation;
}


class Snake {
    constructor() {
        // Calculate the center of the canvas
        let x = Math.floor(width / (2 * scl)) * scl;
        let y = Math.floor(height / (2 * scl)) * scl;

        // Initialize the head of the snake at the center of the canvas
        this.x = x;
        this.y = y;
        this.xSpeed = 1;
        this.ySpeed = 0;
        this.tail = [];

        this.powerup = null;
        this.powerupTime = 0;
        this.powerupDuration = 200; // Powerup duration in frames

        this.powerup_rich = null;
        this.powerupTime_rich = 0;
        this.powerupDuration_rich = 200; // Powerup duration in frames
    }

    dir(x, y) {
        this.xSpeed = x;
        this.ySpeed = y;
    }

    update() {
        // add the current head position to the beginning of the tail array
        this.tail.unshift(createVector(this.x, this.y));

        // remove the last element of the tail array if the length of the tail array is greater than the score
        if (this.tail.length > score) {
            this.tail.pop();
        }

        // update the position of the head
        this.x += this.xSpeed * scl;
        this.y += this.ySpeed * scl;

        // Constrain the snake's position within the canvas
        this.x = constrain(this.x, 0, width - scl);
        this.y = constrain(this.y, 0, height - scl);

        // Update power-up timer and remove power-up if duration has expired
        if (this.powerup !== null) {
            this.powerupTime++;
            if (this.powerupTime >= this.powerupDuration) {
                this.removePowerup();
            }
        }
    }

    death(obstacles) {
        // Check if the snake's head goes off the screen
        if (this.x < 0 || this.x + scl > width || this.y < 0 || this.y + scl > height)
        {
            console.log("game over1")
            this.gameOver();
        }

        // Check if the snake hits its tail
        for (let i = 0; i < this.tail.length; i++) {
            let d = dist(this.x, this.y, this.tail[i].x, this.tail[i].y);
            if (d < 1)
            {
                console.log("game over2")
                this.gameOver();
            }
        }

        // Check if the snake hits an obstacle
        for (let i = 0; i < obstacles.length; i++) {
            let d = dist(this.x, this.y, obstacles[i].x, obstacles[i].y);
            if (d < 1)
            {
                console.log("game over3")
                this.gameOver();
            }
        }
    }

    eat(pos) {
        // Calculate the distance between the snake's head and the food
        let d = dist(this.x, this.y, pos.x, pos.y);
        // Check if the snake has eaten the food
        if (d < (scl * 0.2)) {
            this.generatePowerup();
            return true;
        } else if (this.powerup !== null && dist(this.x, this.y, this.powerup.x, this.powerup.y) < (scl * 0.2) && this.powerupType === "speed") {
            this.applyPowerupEffect();
            return true;
        } else if (this.powerup !== null && dist(this.x, this.y, this.powerup.x, this.powerup.y) < (scl * 0.2) && this.powerupType === "longer")
        {
            console.log("access longer", this.powerupType)
            this.applyPowerupEffect();
            return true;
        } else {
            return false;
        }
    }


    show() {
        // Draw snake segments and head
        fill(255); // Set fill color to white
        for (let i = 0; i < this.tail.length; i++) {
          rect(this.tail[i].x, this.tail[i].y, scl, scl); // Draw each tail segment as a rectangle
        }
        rect(this.x, this.y, scl, scl); // Draw the head as a rectangle

        // Draw power-up if one is active
        if (this.powerup !== null) {
          fill(9, 171, 230); // Set fill color to yellow
          rect(this.powerup.x, this.powerup.y, scl, scl); // Draw the power-up as an ellipse
        }
    }

    generatePowerup() {
        // Generate a speed power-up at a random location on the canvas
        let x = floor(width / scl);
        let y = floor(height / scl);

        // Generate a random location and check if it collides with any obstacles
        let collided = true;
        while (collided) {
          let powerupLocation = createVector(floor(random(x)) * scl, floor(random(y)) * scl);
          collided = false;
          for (let obstacle of obstacles) {
            if (powerupLocation.equals(obstacle)) {
              collided = true;
              break;
            }
          }
          if (!collided) {
            this.powerup = powerupLocation;
          }
        }

        // Generate a random number between 0 and 1
        let randomNumber = Math.random();
        // Round the random number to the nearest integer (0 or 1)
        let randomZeroOrOne = Math.round(randomNumber);
        if (randomZeroOrOne === 0) {
          this.powerupType = "speed";
        } else if (randomZeroOrOne === 1) {
          this.powerupType = "longer";
        }
        console.log("generated power", this.powerupType)
    }


    removePowerup() {
        this.powerup = null;
        this.powerupTime = 0;
        this.powerupEffect = null;
    }

    applyPowerupEffect() {
        if (this.powerupType === "speed")
        {
            this.xSpeed *= 2;
            this.ySpeed *= 2;
        } else
        {
            score += 5
            snake.update();
        }
        this.removePowerup();
    }

    gameOver() {
        alert("Game over! Your score is: " + score);
        startBtn.style.display = "block";
        score = 0;
        restartGame();
        gameStarted = false; // Reset the gameStarted flag
    }
}

let startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", function() {
    startBtn.style.display = "none";
    setup();
    gameStarted = true; // Set the gameStarted flag to true
});

function keyPressed() {
    if (keyCode === UP_ARROW) {
    snake.dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
    snake.dir(0, 1);
    } else if (keyCode === LEFT_ARROW) {
    snake.dir(-1, 0);
    } else if (keyCode === RIGHT_ARROW) {
    snake.dir(1, 0);
  }
}

function restartGame() {
    score = 0;
    snake = new Snake();
    pickLocation();
    gameStarted = false; // Reset the gameStarted flag
}
