// 設定選項(圖片)數量
const PICTURE_COUNT = 180;
// 設定顯示圖片數量(會影響到網頁載入速度)
const TOTAL_DISPLAY_IMAGE_COUNT = 30;
var result;
var pictures=[];
var viewWidthRatio = 9;
var viewHeightRatio = 18;
var viewWidth, viewHeight;
var pictureSpeed = 32;
const DEBUG_MODE = false;

let a = 0;
let aspeed = 1;
let b = 128;
let bspeed = -1; 
let fireworks = [];
var lotteryAlive = true;

class lotteryPicture {
  constructor(picture, index) {
    this.picture = picture;
    this.index = index;
    this.x =(windowWidth-pictureSize)/2;
    this.y =(viewHeight-pictureSize)/2-(viewWidth-10)*(TOTAL_DISPLAY_IMAGE_COUNT-(index-1));
    this.yTarget = (viewHeight-pictureSize)/2+(viewWidth-10)*(index-1);
    this.ySpeed=10;
  }
  update() {
    if(this.y < this.yTarget-1){
      this.y += (this.yTarget-this.y)/pictureSpeed;
    }else if(lotteryAlive){
      for(let i=0;i<10;i++){
        shootFirework();
      }
      lotteryAlive = false;
    }
    
  }
  display() {
    //最佳化效能，圖片在畫面外時不繪製
    if(this.y < windowHeight || this.y+pictureSize>0){
      image(this.picture, this.x, this.y, pictureSize, pictureSize);
    }
  }
}
function preload() {
  // 決定抽到的圖片編號
  result=int(random(PICTURE_COUNT));
  console.log("result="+result);
  let startindex = result-TOTAL_DISPLAY_IMAGE_COUNT;
  let endindex = result;
  if (windowWidth > windowHeight) {
    viewHeight = windowHeight;
    viewWidth = viewHeight * viewWidthRatio / viewHeightRatio;
  } else {
    viewWidth = windowWidth;
    viewHeight = windowHeight;
  }
  pictureSize = viewWidth -20;
  j=0;
  if (startindex <= 0) {
    // 載入圖片
    for (let i = startindex+180; i <= 180; i++) {
      pictures.push(new lotteryPicture(loadImage("/Picture-Lottery-p5js/image/" + str(i) + ".png"),j));
      j++;
    }
    for (let i = 1; i < endindex; i++) {
      pictures.push(new lotteryPicture(loadImage("/Picture-Lottery-p5js/image/" + str(i) + ".png"),j));
      j++;
    }
  }else{
    // 載入圖片
    for (let i = startindex; i < endindex; i++) {
      pictures.push(new lotteryPicture(loadImage("/Picture-Lottery-p5js/image/" + str(i) + ".png"),j));
      j++;
    }
  }
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  // 設定圖片寬度
  

}

function draw() {
  background(220);
  
  // 繪製漸層背景
  let aCol = color(a, 70, 70);
  let bCol = color(b, 100, 140);

  aspeed = bounce(a, 0, 250, aspeed)
  bspeed = bounce(b, 0, 250, bspeed);

  a += aspeed;
  b += bspeed;

  for (let i = 0; i <= width; i++) {
    let inter = map(i, 0, width, 0, 1);
    let col = lerpColor(aCol, bCol, inter);
    stroke(col);
    line(i, 0, i, height);
  }

  // 繪製三角形
  noStroke();
  fill('#ffffff');
  
  
  if(DEBUG_MODE){
    fill(random(255), random(255), random(255));
    textSize(32);
    text(result, random(200), 200);
  }
  
  for(let i=0;i<pictures.length;i++){
    pictures[i].update();
    pictures[i].display();
  }

  triangle((windowWidth-viewWidth)/2, windowHeight/2+20, (windowWidth-viewWidth)/2, windowHeight/2-20, (windowWidth-viewWidth)/2+40, windowHeight/2);
  
  for (let i = fireworks.length - 1; i >= 0; i--) { // Loop through the fireworks array in reverse order
    fireworks[i].update();                          // Update the properties of each firework
    if (!fireworks[i].alive) {                      // Check if the firework is no longer alive, and if so, remove it from the array
      fireworks.splice(i, 1);
    }
  }

    
}

function bounce(num, low, high, speed) {
  if (num < low || num > high) {
    speed *= -1;
  }
  return speed;
}

function shootFirework() {
  let firework = new Firework(random(windowWidth), windowHeight/2+random(windowHeight/2)); // new fire work start at mouse x, y position
  fireworks.push(firework);
}

// firework code

class Firework {
  constructor(x, y) {
    this.init(x, y); // Call the init method to initialize the properties of the firework
  }

  init(x, y) {

    // Initialize various properties of the firework

    this.size = 5;              // Size of the firework
    this.x = x;                 // Current x-coordinate
    this.y = y;                 // Current y-coordinate
    this.vx = random(-3, 3);    // Horizontal velocity
    this.vy = -random(5, 12);   // Vertical velocity (negative for upward motion)
    this.ay = 0.2;              // Vertical acceleration (gravity-like effect)
    this.px = this.x;           // Previous x-coordinate (for drawing)
    this.py = this.y;           // Previous y-coordinate (for drawing)
    this.particleCount = 300;   // Number of particles in the explosion
    this.particles = [];        // Array to store individual particles
    this.loadParticles();       // Initialize particles
    this.exploded = false;      // Indicates whether the firework has exploded
    this.particleEnded = 0;     // Count of particles that have ended (burned out)
    this.alive = true;          // Indicates whether the firework is active
  }

  move() {
    // Update the previous position and move the firework
    this.px = this.x;        // Update the previous x position
    this.py = this.y;        // Update the previous y position
    this.x += random(-2, 2); //move the firework - x coordinate
    this.y += this.vy;       //move the firework - x coordinate
  }

  accelerate() {
    this.vy += this.ay;      // Accelerate the firework by adjusting its vertical velocity
  }

  update() {
    if (this.exploded) {     // Update particles if the firework has exploded
      for (let i = 0; i < this.particleCount; i++) {
        this.particles[i].update();
      }
      if (this.particleCount === this.particleEnded) {
        this.alive = false;
      }
    } else {                 // Accelerate, move, and draw the firework until it explodes
      this.accelerate();
      this.move();
      this.draw();
      if (this.vy >= 0) {
        this.explode();
      }
    }
  }

  draw() {                  // Draw the firework as a line
    push();
    strokeWeight(this.size);
    stroke(0, 0, 95);
    line(this.x, this.y, this.px, this.py);
    pop();
  }

  loadParticles() {         // Initialize particles for the explosion
    let colorBase = random(100);
    for (let i = 0; i < this.particleCount; i++) {
      let color = random(256);
      this.particles.push(new Particle(this, color));
    }
  }

  explode() {                                           // Explode the firework by adjusting particle positions
    this.exploded = true;
    for (let i = 0; i < this.particleCount; i++) {      // Randomly disperse particles from the firework's position
      this.particles[i].x = this.x + random(-0.2, 0.2);
      this.particles[i].y = this.y + random(-0.2, 0.2);
    }
  }
}



// Define a Particle class

class Particle {
  constructor(parent, color) {
    this.parent = parent;       // Reference to the parent Firework object
    this.size = random(7, 10);  // Size of the particle
    this.colorr = random(255);
    this.colorg = random(255);
    this.colorb = random(255);
             // Color of the particle
    this.vx = random(-5, 5);    // Horizontal velocity of the particle
    this.vy = random(-5, 5);    // Vertical velocity of the particle
    this.x = 0;                 // Current x-coordinate of the particle
    this.y = 0;                 // Current y-coordinate of the particle
    this.gFactor = random(2.9, 3.5); // Factor for gravitational acceleration
    this.alive = true;          // Indicates whether the particle is active
  }

  move() {
    this.x += this.vx;          // Move the particle based on its velocity - x coordinate
    this.y += this.vy;          // Move the particle based on its velocity - y coordinate
  }

  accelerate() {
    // Apply gravitational acceleration to the particle's velocity
    // Calculate the distance between the particle and its parent firework
    let d = max(10, dist(this.x, this.y, this.parent.x, this.parent.y)); // Calculate gravitational force based on particle size and distance
    let ug = -200 * this.size / pow(d, this.gFactor);                    // Calculate horizontal and vertical components of the acceleration
    let ax = (this.parent.x - this.x) * ug;                              // Update the particle's velocity with the acceleration x - cood
    let ay = (this.parent.y - this.y) * ug;                              // Update the particle's velocity with the acceleration y - cood
    this.vx += ax;
    this.vy += ay + 0.016;                                               // Add a small vertical acceleration (air resistance)
    this.vx *= 0.9;                                                      // Apply some damping to the horizontal velocity
    this.vy *= 0.9;                                                      // Apply some damping to the vertical velocity
  }

  burn() {                            // Reduce the size of the particle over time and mark it as not alive when it's too small
    this.size *= 0.975;               // Gradually decrease the size
    if (this.size < 0.1) {
      this.alive = false;             // Mark the particle as not alive when it's very small
      this.parent.particleEnded += 1; // Increase the count of particles that have burned out
    }
  }

  update() {
    if (this.alive) {    // Update the particle's position, velocity, and size
      this.accelerate(); // Accelerate based on gravity and parent firework
      this.move();       // Move based on velocity
      this.draw();       // Draw the particle
      this.burn();       // Reduce size over time and mark as not alive if too small
    }
  }

  draw() {               // Draw the particle as a point
    push();
    stroke(this.colorr, this.colorg, this.colorb);
    strokeWeight(this.size);
    point(this.x, this.y);
    pop();
  }
}
