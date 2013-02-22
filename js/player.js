"use strict";

var MMan = Class.extend({

    /**
     * Milliseconds per frame, the number of milliseconds between each animation frame
     * @type Number
     */
    MPF: 35,

    /**
     * Accumulating delta, will accumulate until greater than MPF
     * @type Number
     */
    acDelta: 0,

    /**
     * Used to calculate the delta time between the current frame and the last
     * @type Number
     */
    lastUpdateTime: 0,

    /**
     * An array of assets
     * @type Array
     */
    assets: ["running01.png",
            "running02.png",
            "running03.png",
            "running04.png",
            "running05.png",
            "running06.png",
            "running07.png",
            "running08.png",
            "running09.png",
            "running10.png"],

    /**
     * The current state in the assets array
     * @type Number
     */
    index: 0,

    //-----------------------------------------
    //
    init: function () {},

    //-----------------------------------------
    // Manages the running state of the player
    run: function() {
        var delta = Date.now() - this.lastUpdateTime;
        if (this.acDelta > this.MPF) {
            clear();
            this.acDelta = 0;

            //if (Key.isDown(Key.LEFT)) {
                drawSprite(this.assets[this.index], 30, 150);
            //}

            //else if (Key.isDown(Key.RIGHT)) {
            //    drawSprite(this.assets[this.index], 30, 150);
            //}
            this.index = (this.index + 1) % this.assets.length;
        } else {
            this.acDelta += delta;
        }
        this.lastUpdateTime = Date.now();
    },

    //-----------------------------------------
    // Manages the waiting state of the player
    wait: function() {

    }
});

/** @constructor */
function MegaMan(x, y) {

	/**
	 * The x-coordinate of the player
	 * @type Number
	 */
	this.x = x;

	/**
	 * The y-coordinate of the player
	 * @type Number
	 */
	this.y = y;

    /**
     * Milliseconds per frame, the number of milliseconds between each animation frame
     * @type Number
     */
    this.MPF = 30;

    /**
     * Accumulating delta, will accumulate until greater than MPS
     * @type Number
     */
    this.acDelta = 0;

    /**
     * Used to calculate the delta time between the current frame and the last
     * @type Number
     */
    this.lastUpdateTime = 0;

	/**
	 * To determine if the player is in the air
	 * @type Boolean
	 */
	this.grounded = true;

	/**
	 * The maximum height of the jump
	 * @type Number
	 */
     this.jumpHeight = 64;

	//For the idle state
	this.breath = 0;
	this.breathIndex = 270;

	this.index = 0;
	this.runMap = {
		right: [
			{sx: 171, sy: 212, swidth: 42, sheight: 75, px: 20, py: 0, width: 42, height: 75},
			{sx: 212, sy: 212, swidth: 50, sheight: 75, px: 13, py: 0, width: 50, height: 75},
			{sx: 260, sy: 212, swidth: 70, sheight: 75, px: 0, py: 0, width: 70, height: 75},
			{sx: 330, sy: 212, swidth: 57, sheight: 75, px: 5, py: 0, width: 57, height: 75},
			{sx: 388, sy: 212, swidth: 57, sheight: 80, px: 15, py: 0, width: 57, height: 80},
			{sx: 440, sy: 212, swidth: 75, sheight: 80, px: 0, py: 0, width: 75, height: 80}
		],
		left: [
			{sx: 482, sy: 212, swidth: 42, sheight: 75, px: 19, py: 0, width: 42, height: 75},
			{sx: 431, sy: 212, swidth: 50, sheight: 75, px: 16, py: 0, width: 50, height: 75},
			{sx: 365, sy: 212, swidth: 70, sheight: 75, px: 10, py: 0, width: 70, height: 75},
			{sx: 308, sy: 212, swidth: 57, sheight: 75, px: 18, py: 0, width: 57, height: 75},
			{sx: 250, sy: 212, swidth: 57, sheight: 80, px: 15, py: 0, width: 57, height: 80},
			{sx: 180, sy: 212, swidth: 75, sheight: 80, px: 4, py: 0, width: 75, height: 80}
		]
	};

	//Mega man sprite images
	//TODO - these are created each time a new mega man object is created, needs to move out
	this.rimg = new Image();
	//this.rimg.src = "http://dl.dropbox.com/u/219302/udacityClass/mmx.png";

	this.limg = new Image();
	//this.limg.src = "http://dl.dropbox.com/u/219302/udacityClass/mmx2.png";
};

MegaMan.prototype.animate = function() {
    var delta = Date.now() - this.lastUpdateTime;
    if (this.acDelta > this.MPF) {
        this.acDelta = 0;
        if(Key.lastPressed(Key.SPACE, 300)) {
            //He is still boosting
            this.boost();
        } else if(Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT) || Key.isDown(Key.UP)) {
            if (Key.isDown(Key.LEFT)) {
                this.runLeft();
            }

            if (Key.isDown(Key.RIGHT)) {
                this.runRight();
            }

            if (Key.isDown(Key.UP)) {

            }
        } else {
            //Otherwise he his idle
            this.idle();
        }
    } else {
        this.acDelta += delta;
    }
    this.lastUpdateTime = Date.now();
};

MegaMan.prototype.runRight = function() {
	this.breath = 0;
	var image = this.runMap.right[this.index];
	this.x = (this.x + frameDistance) % canvas.width;
	clear();
	context.drawImage(this.rimg, image.sx, image.sy, image.swidth, image.sheight,
		this.x + image.px, this.y + image.py, image.width, image.height);
	this.index = (this.index + 1) % this.runMap.right.length;
};

MegaMan.prototype.runLeft = function() {
	this.breath = 0;
	var image = this.runMap.left[this.index];
	this.x = (this.x - frameDistance) < 0 ? canvas.width : (this.x - frameDistance);
	clear();
	context.drawImage(this.limg, image.sx, image.sy, image.swidth, image.sheight,
		this.x + image.px, this.y + image.py, image.width, image.height);
	this.index = (this.index + 1) % this.runMap.left.length;
};

MegaMan.prototype.boost = function() {

};

MegaMan.prototype.jump = function() {

};

MegaMan.prototype.idle = function() {
	if (this.breath == 0 && this.breathIndex == 270) {
		clear();
		this.breathIndex = 340;
		context.drawImage(this.rimg, this.breathIndex, 30, 75, 75, this.x, this.y, 75, 75);
	} else if (this.breath == 0 && this.breathIndex == 340) {
		clear();
		this.breathIndex = 270;
		context.drawImage(this.rimg, this.breathIndex, 30, 75, 75, this.x, this.y, 75, 75);
	}
	this.breath = (this.breath + 1) % 10;
};

//MegaMan.prototype = new AbstractDrawable();