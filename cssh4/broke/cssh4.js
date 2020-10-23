var myGamePiece;

function start() {

    myGamePiece = new component(30, 30, "red", 30, 730, 10);
    myGameArea.bulletsize = 5;
    myGamePiece.shoot = function() {
        myGameArea.bullets.push(new component(myGameArea.bulletsize, myGameArea.bulletsize, "blue", myGamePiece.x + (myGamePiece.width - 5)/2, myGamePiece.y - 5, 10, "bullet"))
    }
    myGameArea.start();
    

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}



function spawner() {
    myGameArea.enemies.push(new component(30, 30, "green", getRandomInt(0, 770), 0, 5, "enemy"))
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.bullets = [];
      this.enemies = [];
      this.canvas.width = 800;
      this.canvas.height = 800;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
      this.enemyspawner = setInterval(spawner, 1000)
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  
  function component(width, height, color, x, y, speed, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.maxX = myGameArea.canvas.width - 30;
    this.maxY = 0;
    this.type = type;
    this.speed = speed;
    this.update = function(){
        ctx = myGameArea.context;
        
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
    this.newPos = function() {
        if(this.type == "bullet") {
            this.y -= this.speed
            if(this.y < -5) myGameArea.bullets.shift();
            return 0;
        }
        if(this.type == "enemy") {
            if(this.y > 725) endGame();
            this.y += this.speed
        } else {
            this.x += this.speed;
        }
    }

  }
  
function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();   

    myGameArea.bullets.forEach(function(bullet){
        bullet.update();
        bullet.newPos();
    })
    myGameArea.enemies.forEach(function(enemy){
        enemy.update();
        enemy.newPos();
    })
}

function endGame() {
    myGameArea.enemies = null;
    myGameArea.bullets = null;
	
    clearInterval(myGameArea.interval);
    clearInterval(myGameArea.enemyspawner);
	myGameArea.enemyspawner = 0;
	clearInterval(spawner);
    
	window.removeEventListener("keydown", handleInput, true);
	
    myGameArea.clear();
    return 0;
}

function handleInput(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    switch (event.key) {
        case "ArrowLeft":
            if(myGamePiece.x > 0) {
                myGamePiece.speed = -Math.abs(myGamePiece.speed);
                myGamePiece.newPos();
            }
            break;
        case "ArrowRight":
            if(myGamePiece.x < myGameArea.canvas.width - myGamePiece.width) {
                myGamePiece.speed = Math.abs(myGamePiece.speed)
                myGamePiece.newPos();
            }
            break;
        case "ArrowUp":
            console.log("shooting!")
            myGamePiece.shoot();
            break;
        
        default:
            console.log(event.code)
            if(event.code === "KeyE") myGameArea.bulletsize = 800;
            return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    
    event.preventDefault();
  }

window.addEventListener("keydown", handleInput, true);
