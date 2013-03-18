"use strict";

var canvas,

    ctx,

    // Width of the canvas in pixels
    canvasWidth = 300,

    // Height of the canvas in pixels
    canvasHeight = 250,

    // Frames per second
    FPS = 60,

    // The distance the player travels per frame
    frameDistance= canvasWidth / 100,

    player = new MMan(30, 150),

    player2 = new MMan(70, 150),

    player3 = new MMan(110, 150);

//Helper object for key commands
var Key = {
  pressed: {},
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,

  isDown: function(keyCode) {
    return this.pressed[keyCode] != undefined;
  },

  onKeyDown: function(event) {
    this.pressed[(event || window.event).keyCode] = new Date().getTime();
  },

  onKeyUp: function(event) {
    delete this.pressed[(event || window.event).keyCode];
  }
};

// Determines if two objects in a 2D plane have collided
var collides = function(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

// Returns true if the browser supports canvas
var supported = function() {
  return !!document.createElement('canvas').getContext;
};

// Clears the context so images won't be stacked
var clear = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var setup = function() {
  var body = document.getElementById('wrapper');
  canvas = document.createElement('canvas');

  ctx = canvas.getContext('2d');

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  body.appendChild(canvas);

  // Does most of the heavy lifting by loading our assets into memory
  var spriteSheet = new SpriteSheetClass();
  spriteSheet.load("img/mega_man.png");

  $.ajax({
    url:"/mega_man.json",
    dataType: "jsonp",
    jsonpCallback: "callback",
    success: function(data) {
      spriteSheet.parseAtlasDefinition(data);
    },
    error: function error(data) {
      console.log("OH NO!");
    }
  });

  window.addEventListener('keyup', function(event) { Key.onKeyUp(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeyDown(event); }, false);

  draw();
};

function draw() {
  setTimeout(function() {
    requestAnimFrame(draw);
    player.run();
    player2.wait();
    player3.jump();
  }, 1000 / FPS);
};

if(supported) setup();