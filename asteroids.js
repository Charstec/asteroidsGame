// Create variables to be used in multiple functions
// let canvas = document.getElementById('my-house');//=>grab from html
// let ctx = canvas.getContext('2d');//=> now can draw anything
//=>call getContext() on the <canvas> element,supplying '2d' as the argument:context in hand, you can draw anything=>
let canvas;//=>graphics/animations
let ctx;//=>To get the canvas' 2D rendering context, call getContext() on the <canvas> element, supplying '2d' as the argument:=>
let canvasWidth = 1400;//=>used to position things on the screen
let canvasHeight = 1000;
let ship;
let keys = [];/*=>stores multiple keys for the user so he can click
on multiple keys on keyboard at the same time*/
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;
//evtList listens for the page to fully load,then executes function
document.addEventListener('DOMContentLoaded', SetupCanvas);
function SetupCanvas(){//=>function to run once page loads
    canvas = document.getElementById('my-canvas');//=>work with canvas element so grab it by id =>
    ctx = canvas.getContext('2d');//=>context used to draw things on canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';//=>The CanvasRenderingContext2D.fillStyle property of the Canvas 2D API specifies the color, gradient, or pattern to use inside shapes. The default style is #000 (black).
    ctx.fillRect(0,0,canvas.width, canvas.height);//=>start place rectangle how wide and how high=>
    ship = new Ship();//=>creates new instance object of ship
  // Create 8 asteroids/throw onto screen
    for(let i = 0; i < 8; i++){
      asteroids.push(new Asteroid());//=> push into array
    }
  // store all possible keycodes in an array/work with all at same time
  // Here is how to do that:
  // 1)eventListener function called on the document body
  // if any key goes down, I want to put that key into an array  
  // set it to true/set keyup to false
    document.body.addEventListener("keydown", function(e){
      keys[e.keyCode] = true;//=>e.keyCode is deprecated  
    });
    document.body.addEventListener("keyup", function(e){
      keys[e.keyCode] = false;//=>time to make bullets
      if(e.keyCode === 32){//=> 32 is the spacebar keyCode
        bullets.push(new Bullet(ship.angle));
      }
    });
    Render();//=>updates position of all shapes and draws them
}
// class/blueprint create all ships define all attributes and capabilities
// What type of things do I want my ship to be able to do?
class Ship {        
  constructor(){
    this.visible = true;//=> start of game I want visibility
    this.x = canvasWidth / 2;//=>x coordinate starts in center of screen
    this.y = canvasHeight / 2;//=>y coordinate same/change as ship moves
    this.movingForward = false;//=>is my ship moving forward or not?
    this.speed = 0.1;//=>define speed
    this.velX = 0;//=>velocity quickness moving across
    this.velY = 0;//=>velocity up/down vertical
    this.rotateSpeed = 0.001;//=>rotation speed 
    this.radius = 15;
    this.angle = 0;//=>starting angle
    this.strokeColor = "white";//=>stroke instaed of fill set for white
    this.noseX = canvasWidth / 2 + 15;
    this.noseY = canvasHeight / 2;
  }
  Rotate(dir){
      this.angle += this.rotateSpeed * dir;
  }
  // Method handles rotating and moving ship around
  Update(){                  
    //=>moving ship forward
    //=>convert from degree to radians
    //=>The angle made when the radius is wrapped around a circle
    //=>1 Radian is about 57.2958 degrees.
    //=>The Radian is a pure measure based on the Radius of the circle
    //=>represent the ratio of a circle's circumference to its diameter
    //=> that is PI
    //=>In basic mathematics, Pi is used to find the area and circumference of a circle.=>
    //=>1 radian equals 180 degrees divided by π, or 57.2958 degrees.
    let radians = this.angle / Math.PI * 180;
    // old x + cosign radians * distance
    // old y + sine radians * distance 
    // calculate changing values of x and y when moving forward
    if(this.movingForward){
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }
    if(this.x < this.radius){
      this.x = canvas.width;
    }
    if(this.x > canvas.width){
      this.x = this.radius;      
    }
    if(this.y < this.radius){
      this.y = canvas.height;
    }
    if(this.y > canvas.height){
      this.y = this.radius;
    }
    this.velX *= 0.99;
    this.velY *= 0.99;
    
    this.x -= this.velX;
    this.y -= this.velY;
  }
  Draw(){
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = ((Math.PI * 2) / 3);
    let radians = this.angle / Math.PI * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for(let i = 0; i < 3; i++){
      ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
      ctx.stroke();
  }
}

class Bullet{
    constructor(angle){
      this.visible = true;
      this.x = ship.noseX;
      this.y = ship.noseY;
      this.angle = angle;
      this.height = 4;
      this.width = 4;
      this.speed = 5;//= experiment with different speeds(1 - 10)
      this.velX = 0;//=> value that the bullet moves each update
      this.velY = 0;
    }
    Update(){
      var radians = this.angle / Math.PI * 180;
      this.x -= Math.cos(radians) * this.speed;//=>review trig
      this.y -= Math.sin(radians) * this.speed;//=>cos/sin
    }
    Draw(){
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Create the Asteroid class
class Asteroid{
  constructor(x,y,radius,level,collisionRadius){
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 1;//=> experiment with speed
    this.radius = radius || 50;//=>Asteroids bigger than ship
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
    this.collisionRadius = collisionRadius || 46;
    this.level = level || 1;
  }
//Asteriods changed on our screen via Update function
  Update(){
    var radians = this.angle / Math.PI * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;

  if(this.x < this.radius){
    this.x = canvas.width;
  }
  if(this.x > canvas.width){
    this.x = this.radius;      
  }
  if(this.y < this.radius){
    this.y = canvas.height;
  }
  if(this.y > canvas.height){
    this.y = this.radius;
  }
}
Draw(){
   ctx.beginPath();
   let vertAngle = ((Math.PI * 2) / 6);
   var radians = this.angle / Math.PI * 180;
   for(let i = 0; i < 6; i++){//=> asteroids six sides(hexagon)
    ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
  }
  ctx.closePath();
    ctx.stroke();
   }
}

function CircleCollision(p1x, p1y, r1, p2x, p2y, r2){
  let radiusSum;
  let xDiff;
  let yDiff;
  radiusSum = r1 + r2;
  xDiff = p1x - p2x;
  yDiff = p1y - p2y;
  if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))){
    return true;
  } else {
      return false;
  }
}

function DrawLifeShips(){
  let startX = 1350;
  let startY = 10;
  let points = [[9,9], [-9,9]];
  ctx.strokeStyle = 'white';
  for(let i = 0; i < lives; i++){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for(let j = 0; j < points.length; j++){
      ctx.lineTo(startX + points[j][0], startY + points[j][1]);
    }
    ctx.closePath();
    ctx.stroke();
    startX -= 30;
  }
}

function Render(){
    ship.movingForward = (keys[87]);
    if(keys[68]){
      ship.Rotate(1);
    }
    if(keys[65]){
      ship.Rotate(-1);
    }
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText('SCORE: ' + score.toString(), 20, 35);
    if(lives <= 0){
      ship.visible = false;
      ctx.fillStyle = 'white';
      ctx.font = '50px Arial';
      ctx.fillText('GAME OVER', canvasWidth / 2 - 150, canvasHeight / 2);
    }
    DrawLifeShips();

     if(asteroids.length !== 0){
       for(let k = 0; k < asteroids.length; k++){
         if(CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
           ship.x = canvasWidth / 2;
           ship.y = canvasHeight / 2;
           ship.velX = 0;
           ship.velY = 0;
           lives -= 1;
         }
       }
     }

     if(asteroids.length !== 0 && bullets.length !== 0){
 loop1:
         for(let l = 0; l < asteroids.length; l++){
           for(let m = 0; m < bullets.length; m++){
               if(CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                 if(asteroids[l].level === 1){
                   asteroids.push(new Asteroid(asteroids[l].x - 5,
                     asteroids[l].y - 5, 25, 2, 22));
                   asteroids.push(new Asteroid(asteroids[l].x + 5,
                     asteroids[l].y + 5, 25, 2, 22));
                   } else if(asteroids[l].level === 2){
                       asteroids.push(new Asteroid(asteroids[l].x - 5,
                           asteroids[l].y - 5, 15, 3, 12));
                       asteroids.push(new Asteroid(asteroids[l].x + 5,
                           asteroids[l].y + 5, 15, 3, 12));    
                   } 
                   asteroids.splice(l,1);
                   bullets.splice(m,1);
                   score += 20;  
                   break loop1;    
                 }
               }
             }
           }
        if(ship.visible){
          ship.Update();
          ship.Draw();
        }
     
    if(bullets.length !== 0){//=>create bullets for loop
       for(let i = 0; i < bullets.length; i++){
         bullets[i].Update();
         bullets[i].Draw();
       }
    }
    if(asteroids.length !== 0){
      for(let j = 0; j < asteroids.length; j++){
        asteroids[j].Update();
        asteroids[j].Draw(j);
      }
    }
    requestAnimationFrame(Render);
}

