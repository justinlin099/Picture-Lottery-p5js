// 設定選項(圖片)數量
PICTURE_COUNT=int(180);

// 決定抽到的圖片
result=int(random(PICTURE_COUNT));
function preload() {
  
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  text(result, 200, 200);
}
