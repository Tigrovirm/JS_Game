const game = document.getElementById("game");
const player = document.getElementById("player");
const timeElement = document.getElementById("time");
const scoreElement = document.getElementById("score")

let playerX = 270;
let playerY = 450;
const playerWedth = 40;
const playerHeight = 60;
const playerSpeed = 18;
let timeoutID;
let isJumping = false;
let score = 0;


function movePlayer(direction){
    if (direction === "left"){
        playerX -= playerSpeed;
    }else if (direction === "right" && playerX < game.offsetWidth - playerWedth){
        playerX += playerSpeed;
    }else if (direction === "up" && playerY > game.offsetTop){
        playerY -= playerSpeed;
    }else if (direction === "down" && playerY < game.offsetHeight - playerHeight){
        playerY += playerSpeed;
    }
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    //setTimeout(movePlayer, 20);
}

let bullets = [];
let bulletSpeedY = 5;
let bulletInterval = null;
let bulletCount = 0;

function shootBullet() {
  if (bulletCount < 5) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = (player.offsetLeft + player.offsetWidth / 2 - bullet.offsetWidth / 2) + 'px';
    bullet.style.top = (player.offsetTop - bullet.offsetHeight) + 'px';
    game.appendChild(bullet);
    bullets.push(bullet);
    bulletCount++;
  
    const bulletInterval = setInterval(() => {
      const bulletY = parseInt(bullet.style.top);
      if (bulletY < game.offsetTop) {
        if (game.contains(bullet)){
            game.removeChild(bullet);
        }
        bullets.splice(bullets.indexOf(bullet), 1);
        bulletCount--;
        clearInterval(bulletInterval);
      } else {
        bullet.style.top = (bulletY - bulletSpeedY) + 'px';
      }
    }, 20);
  }
}

document.addEventListener("keydown", function(event){
    if (event.code === "ArrowLeft" && playerX > 0){
        movePlayer("left");
    }else if (event.code === "ArrowRight"){
        movePlayer("right");
    }else if (event.code === "ArrowUp"){
        console.log('tyt')
        movePlayer("up")
    }else if(event.code === "ArrowDown"){
        movePlayer("down")
    }else if (event.code === "Space"){
        shootBullet();
    }
})


let obstacles = [];
let obstacleSpeed = 1;
let obstacleInterval = null;
let initialObstacleSpeed = 1;

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    
    const size = Math.floor(Math.random() * 50) + 20;
    obstacle.style.width = size + 'px';
    obstacle.style.height = size + 'px';
    
    obstacle.style.left = Math.floor(Math.random() * (game.offsetWidth - size)) + 'px';
    obstacle.style.top = '-30px';
    obstacle.classList.add('obstacle-bg');
    game.appendChild(obstacle);
    obstacles.push(obstacle)
  }


function moveObstacles(){
    for (let i = 0; i < obstacles.length; i++){
        const obstacle = obstacles[i];
        const obstacleY = parseInt(obstacle.style.top);
        
        for (let j = 0; j < bullets.length; j++) {
            const bullet = bullets[j];
            const bulletX = parseInt(bullet.style.left);
            const bulletY = parseInt(bullet.style.top);
            if (bulletY >= obstacleY && bulletY <= obstacleY + obstacle.offsetHeight &&
                bulletX >= parseInt(obstacle.style.left) && bulletX + bullet.offsetWidth <= parseInt(obstacle.style.left) + obstacle.offsetWidth) {
                game.removeChild(bullet);
                bullets.splice(j, 1);
                game.removeChild(obstacle);
                obstacles.splice(i, 1);
                score += 3;
                scoreElement.innerText = score;
            }
            if (score > 10){
                obstacleSpeed = 2;
            }
            if (score > 25){
                obstacleSpeed = 4;
            }
            if (score > 50){
                obstacleSpeed = 6;
            }
            if (score > 100){
                obstacleSpeed = 8;
            }
        }
        if (obstacleY >= playerY && obstacleY <= playerY + playerHeight && 
            parseInt(obstacle.style.left) >= playerX && parseInt(obstacle.style.left) <= 
            playerX + playerWedth){
                endGame();
            }
        if (obstacleY > game.offsetHeight){
            game.removeChild(obstacle);
            obstacles.splice(i, 1);
        }else{
            obstacle.style.top = (obstacleY + obstacleSpeed) + 'px';
        }
    }
    timeoutID = setTimeout(moveObstacles, 20);
}
function startGame(){
    //const currentObstaclesSpeed = 1;
    //obstacleSpeed = currentObstaclesSpeed;
    obstacleInterval = setInterval(createObstacle, 1500);
    console.log(obstacleSpeed)
    
    moveObstacles();
}
var restartButton = document.getElementById('restartButton');
function restartGame() {
    obstacles.forEach(function(obstacle) {
        game.removeChild(obstacle);
    });
    obstacles = [];

    bullets.forEach(function(bullet) {
        game.removeChild(bullet);
    });
    bullets = [];
    score = 0;
    scoreElement.innerText = score;
    clearInterval(obstacleInterval);
    const currentObstaclesSpeed = 1;
    obstacleSpeed = currentObstaclesSpeed;
    clearTimeout(timeoutID);
    restartButton.style.display = 'none';
    const overlay = document.querySelector('.overlay');
    overlay.style.direction = 'none';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
    startGame();
}
  function endGame() {
    restartButton.style.visibility = 'visible';
    restartButton.style.textAlign = 'center'
    restartButton.style.display = 'inline-block';
    restartButton.innerText = 'Restart';
    restartButton.style.position = 'absolute';
    restartButton.style.top = '50%';
    restartButton.style.left = '50%';
    restartButton.style.transform = 'translate(0%, 0%)';
    restartButton.style.zIndex = 3;
    document.body.appendChild(restartButton);
  
    restartButton.addEventListener('click', restartGame);
    const overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1.5)';
}
  
startGame()