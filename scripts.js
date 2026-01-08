let player, groundSensor, grass, water, fire, coins, enemy1, castle;
let grassImg, waterImg, fireImg, coinsImg, charactersImg, castleImg;
let end1, end2;
let start, cover, text1, text2, text3, text4, music;
let screen, count, texts, kills, score = 0;
let restart = false;
let controls = false;
let death = false;

let tileSpacingX = 16;
let tileSpacingY = 12;

function preload() {
  grassImg = loadImage('assets/grass.png');
  waterImg = loadImage('assets/water.png');
  fireImg = loadImage('assets/fire.png');
  coinsImg = loadImage('assets/coin.png');
  charactersImg = loadImage('assets/characters.png');
  castleImg = loadImage('assets/castle.png');
  music = loadSound('assets/music.mp3');
  music.setVolume(0.05);
}

function setup() {
  new Canvas(200, 160, 'pixelated');
  world.gravity.y = 10;
  allSprites.pixelPerfect = true;
  music.loop();
  deaths = 0;

  grass = new Group();
  grass.layer = 0;
  grass.collider = 'static';
  grass.img = grassImg;
  grass.tile = 'g';

  water = new Group();
  water.layer = 2;
  water.collider = 'static';
  water.img = waterImg;
  water.h = 8;
  water.tile = 'w';

  fire = new Group();
  fire.layer = 2;
  fire.collider = 'static';
  fire.img = fireImg;
  fire.tile = 'f';

  coins = new Group();
  coins.collider = 'static';
  coins.spriteSheet = coinsImg;
  coins.addAni({ w: 16, h: 16, row: 0, frames: 14 });
  coins.tile = 'c';

  new Tiles(
    ['',
      'cc',
      'gg                                     ggg',
      '                                           ',
      '   gg                              cc',
      '       c                        c  gg        g',
      '      ggg    c                  g',
      '            ggg             g                 ccc',
      '                                              ccc',
      '     c c c   c   c c                          ccc',
      'gggggggggggwwwwwgggggffgggggfffgggffffffffffffggggggggggggg'
    ], -2, 50, tileSpacingX, tileSpacingY);


  enemy1 = new Sprite(125, 107, 12, 12);
  enemy1.layer = 1;
  enemy1.anis.w = 16;
  enemy1.anis.h = 16;
  enemy1.anis.offset.y = 1;
  enemy1.anis.frameDelay = 8;
  enemy1.spriteSheet = charactersImg;
  enemy1.addAnis({
    idle: { row: 0, col: 6, frames: 2 },
    knockback: { row: 0, col: 8, frames: 3 },
    run: { row: 1, col: 6, frames: 6 },
    jump: { row: 1, col: 6, frames: 2 }
  });
  enemy1.ani = 'idle';
  enemy1.rotationLock = true;
  enemy1.collider = 'd';

  player = new Sprite(48, 150, 12, 12);
  player.layer = 1;
  player.anis.w = 16;
  player.anis.h = 16;
  player.anis.offset.y = 1;
  player.anis.frameDelay = 8;
  player.spriteSheet = charactersImg;
  player.addAnis({
    idle: { row: 0, frames: 4 },
    knockback: { row: 0, frames: 1 },
    run: { row: 1, frames: 3 },
    jump: { row: 1, col: 3, frames: 2 }
  });
  player.ani = 'idle';
  player.rotationLock = true;

  // IMPORTANT! prevents the player from sticking to the sides of walls
  player.friction = 0;

  player.overlaps(coins, collectCoin);

  // This groundSensor sprite is used to check if the player
  // is close enough to the ground to jump. But why not use
  // `player.colliding(grass)`? Because then the player could
  // jump if they were touching the side of a wall!
  // Also the player's collider bounces a bit when it hits
  // the ground, even if its bounciness is set to 0. When
  // making a platformer game, you want the player to 
  // be able to jump right after they land.
  // This approach was inspired by this tutorial:
  // https://www.iforce2d.net/b2dtut/jumpability
  groundSensor = new Sprite(player.x, player.y, 6, 12);
  groundSensor.visible = false;
  groundSensor.mass = 0.01;
  groundSensor.overlaps(allSprites);

  new GlueJoint(player, groundSensor);
  camera.y = player.y - 52;

  textAlign(CENTER);

  noStroke();
  cover = new Sprite(100, 150);
  cover.pixelPerfect = false;
  cover.w = width * 2;
  cover.h = height * 2;
  cover.color = 0;
  cover.collider = 'n';

  start = new Sprite(100, 150);
  start.pixelPerfect = false;
  start.text = 'START';
  start.w = 50;
  start.h = 25;
  start.stroke = 255;
  start.textColor = 255;
  start.collider = 's';

  text1 = new Sprite(100, 80);
  text1.text = "You, the hero of the light, have been \ndesignated to rescue the hope of the \nkingdom-Princess Hope. As the only one \nleft standing after a deadly battle, please \nhelp your kingdom regain its strength!";
  text1.fill = 0;
  text1.stroke = 0;
  text1.textColor = 255;
  text1.textSize = 10;
  text1.collider = 'n';

  end1 = new Sprite(-width / 2 - 10, height - 65);
  end1.w = width;
  end1.h = height + 20;
  end1.fill = 0;
  end1.collider = 's';

  end2 = new Sprite(825, height - 35);
  end2.w = 20;
  end2.h = 75;
  end2.visible = false;
  end2.collider = 's';
  end2.layer

  castle = new Sprite();
  castle.img = castleImg;
  castle.x = 850;
  castle.y = 88;
  castle.collider = 'n';
  castle.layer = 0;
}

function collectCoin(player, coin) {
  coin.remove();
  score++;
}

function draw() {
  background('skyblue');
  fill(255);
  count++;

  if(death==true){
    deaths++;
    death = false;
  }

  if (start.mouse.presses()) {
    print("start game");
    cover.remove();
    start.remove();
    text1.remove();
    text1 = new Sprite(100, 60);
    text1.fill = 'skyblue';
    text1.stroke = 'skyblue';
    text1.textColor = 'white';
    text1.textSize = 10;
    text1.text = 'Welcome! Use the arrow keys \n to move your character. \nPress ENTER to start.';
    text1.collider = 'n';
    texts = 1;
  }

  if (texts > 1 && player.x >= 45 && player.x <= 760) {
    text1.x = player.x + 50;
  }

  if (texts == -1 && player.x <= 740) {
    text4.remove();
  }

  if (texts == 1 && kb.pressing('enter')) {
    controls = true;
    texts = 2;
    text1.text = 'This red monster is your \nenemy. Try jumping on\n it and then jumping off!'
  }

  if (texts == 2 && kills > 0) {
    text1.text = 'Great job! You killed \nyour first monster! Now \nlet\'s observe the terrain!';
    texts = 3;
  }

  if (texts == 3 && player.x >= 167 && player.x <= 240) {
    text1.text = 'This is water. \nYou will slow down \nand jump lower in it.';
    texts = 4;
  }

  if (texts == 4 && player.x > 240) {
    text1.text = 'Next is lava. \nYou die if you jump  \ninto it and restart your \njourney. Avoid it!';
    texts = 5;
  }

  if (texts == 5 && player.x >= 360) {
    text1.y = 70;
    text1.text = 'The rest of the journey \nis up to you. Good luck! \nRemember to collect all \ncoins.';
    texts = 6;
  }

  if (texts == 6 && player.x > 460) {
    text1.remove();
  }

  text('Coins: ' + score, 160, 20);

  if (player.collides(end2)) {
    if (score >= 0) {
      camera.x = player.x;
      player.x = 48;
      print("win game");
      noStroke();
      cover = new Sprite(815, 140);
      cover.pixelPerfect = false;
      cover.w = width * 2;
      cover.h = height * 2;
      cover.color = 'yellow';
      cover.collider = 'n';

      theend = new Sprite(815, 140);
      theend.pixelPerfect = false;
      theend.text = 'THE END';
      theend.w = 60;
      theend.h = 25;
      theend.stroke = 0;
      theend.textColor = 0;
      theend.collider = 's';

      text2 = new Sprite(815, 90);
      text2.fill = 'yellow';
      text2.stroke = 'yellow';
      text2.textColor = 'red';
      text2.textSize = 10;
      text2.collider = 'n';

      text3 = new Sprite(815, 60);
      text3.text = "CONGRATULATIONS! \n You found the princess!";
      text3.fill = 'yellow';
      text3.stroke = 'yellow';
      text3.textColor = 0;
      text3.textSize = 12;
      text3.collider = 'n';

      controls = false;
    } else {
      text4 = new Sprite(100, 60);
      text4.fill = 'skyblue';
      text4.stroke = 'skyblue';
      text4.textColor = 'white';
      text4.textSize = 10;
      text4.text = 'You lack enough coins to \nenter the castle.';
      text4.collider = 'n';
      texts = -1;
    }
  }

  // make the player slower in water
  if (groundSensor.overlapping(water)) {
    player.drag = 20;
    player.friction = 10;
  } else {
    player.drag = 0;
    player.friction = 0;
  }

  if (groundSensor.overlapping(grass) ||
    groundSensor.overlapping(water) ||
    groundSensor.overlapping(enemy1)) {
    if (kb.presses('up') || kb.presses('space')) {
      player.ani = 'jump';
      player.vel.y = -4.5;
    }
  }

  if (restart && count == 3) {
    enemy1.remove();
    kills = 1;
    restart = false;
  }

  if (groundSensor.overlapping(enemy1)) {
    enemy1.ani = 'knockback';
    restart = true;
    count = 0;
  }

  if (kb.pressing('left') && controls) {
    player.ani = 'run';
    player.vel.x = -1.5;
    player.mirror.x = true;
  } else if (kb.pressing('right') && controls) {
    player.ani = 'run';
    player.vel.x = 1.5;
    player.mirror.x = false;
  } else {
    player.ani = 'idle';
    player.vel.x = 0;
  }

  // if player falls, reset them
  if (player.y > 500 || groundSensor.overlapping(fire) || (!restart && player.collides(enemy1))) {
    player.speed = 0;
    player.x = 48;
    player.y = 100;
    death = true;
  }

  if (player.x >= 40 && player.x <= 763 && controls) {
    camera.x = player.x + 52;
  }

}
