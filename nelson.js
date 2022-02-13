var w = window.innerWidth;
var h = window.innerHeight;

var santa, chimneyImg, houseImg, giftImg;
var x = [], y = [], direction = [];
var spawn = 0;
var score = 0;
var gameOver = false;

function setup() {
  createCanvas(w, h);
  frameRate(60);
  noSmooth();
  noStroke();
  fill(color(248, 248, 248));

  chimneyImg = loadImage("assets/chimney.png");
  houseImg = loadImage("assets/ground.png");
  giftImg = loadImage("assets/gift.png");

  santa = createSprite(w / 2 - 64, h / 2, 128, 128);

  santa.addAnimation("running", "assets/santa1.png", "assets/santa2.png");
  santa.addAnimation("jumping", "assets/santa3.png");
  santa.addAnimation("front", "assets/santa4.png");
  santa.animation.frameDelay = 12;
  santa.velocity.x = 14;

  chimneys = new Group();
  houses = new Group();
  gifts = new Group();


  for (var i = 0; i < 200; i++) {
    x[i] = random(0, w) + camera.position.x;
    y[i] = random(0, h);
    direction[i] = random(1, 2);
  }
  newGame();

}

function draw() {
  camera.position.x = santa.position.x;
  // gravity
  santa.velocity.y += 2;
  if (!gameOver) {
    santa.velocity.x = 14;
    santa.changeAnimation(santa.position.y > h / 2 ? "running" : "jumping");
    // stay on the ground
    if (santa.position.y > h / 2) santa.position.y = h / 2;
    if (santa.overlap(chimneys)) {
      santa.changeAnimation("running");
      santa.velocity.y = 0;
      if (santa.position.y > h / 2 - 80) die();
    } else {
      if (frameCount > spawn) {
        if (random(0, 1) < 0.6) {
          var chimney = createSprite(santa.position.x + w, h / 2 + 4);
          chimney.addImage(chimneyImg);
          chimney.setCollider("rectangle", 0, 0, 140, 132);
          chimneys.add(chimney);
        } else {
          var gift = createSprite(santa.position.x + w, h / 2);
          gift.addImage(giftImg);
          gift.setCollider("rectangle", 0, 0, 128, 114);
          gifts.add(gift);
        }
        chimneys.forEach(function (chimney) { if (chimney.position.x < santa.position.x - w) chimney.remove() });
        gifts.forEach(function (gift) { if (gift.position.x < santa.position.x - w) gift.remove() });

        // random chimney spawn
        spawn = random(frameCount + 40, frameCount + 100);
      }
      // add buildings
      if (frameCount % 50 == 0) {
        var house = createSprite(santa.position.x + w, h - 56);
        house.addImage(houseImg);
        houses.add(house);
        houses.forEach(function (house) { if (house.position.x < santa.position.x - w) house.remove() });
      }
    }
    santa.overlap(gifts, gifted);
  }

  background(0, 64, 88);
  rect(camera.position.x - w / 2 - 40, h / 2 + 64, w + 80, h / 2 - 64);
  drawSprites(houses);
  drawSprite(santa);
  drawSprites(chimneys);
  drawSprites(gifts);
  drawSnow();
  textSize(48);
  text(score, camera.position.x, 64);
}
function die() {
  santa.changeAnimation("front");
  gameOver = true;
  santa.velocity.x = 0;
  santa.velocity.y = -30;
}
function jump() {
  if (gameOver)
    newGame();
  if (santa.position.y >= h / 2)
    santa.velocity.y = -35;
  else if (santa.overlap(chimneys)) {
    santa.position.y -= 1;
    santa.velocity.y = -35;
  }
}
function gifted(santa, gift) {
  gift.remove();
  score += 100;
}
function mouseClicked() { jump() }
function keyPressed() { jump() }
function newGame() {
  gameOver = false;
  santa.position.x = w / 2;
  santa.position.y = h / 2;
  score = 0;
  frameCount = 0;
  gifts.removeSprites();
  chimneys.removeSprites();
  houses.removeSprites();
  for (var i = 0; i < w * 2; i += 728) {
    var house = createSprite(i, h - 56);
    house.addImage(houseImg);
    houses.add(house);
  }
}
function drawSnow() {
  for (var i = 0; i < x.length; i++) {
    rect(x[i], y[i], 8, 8);

    if (santa.velocity.x != 0) x[i] += direction[i];
    y[i] += direction[i];

    if (x[i] > w * 4 + camera.position.x || y[i] > h) {
      x[i] = random(0, w * 4) + camera.position.x - w / 2;
      y[i] = 0;
    }
  }
}