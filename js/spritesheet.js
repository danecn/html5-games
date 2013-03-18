"use strict";

// We keep a global dictionary of loaded sprite-sheets,
// which are each an instance of our SpriteSheetClass
// below.
//
// This dictionary is indexed by the URL path that the
// atlas is located at. For example, calling:
//
// gSpriteSheets['running.png']
//
// would return the SpriteSheetClass object associated
// to that URL, assuming that it exists.
var gSpriteSheets = {};

//-----------------------------------------
var SpriteSheetClass = Class.extend({

    // The Image object
    img: null,

    // The URL path of the atlas
    url: "",

    // An array of all the sprites in our atlas.
    sprites: [],

    //-----------------------------------------
    init: function () {},

    //-----------------------------------------
    // Load the atlas at the path 'imgName' into
    // memory
    load: function (imgName) {
        this.url = imgName;

        var img = new Image();
        img.src = imgName;
        this.img = img;

        gSpriteSheets[imgName] = this;
    },

    //-----------------------------------------
    // Define a sprite for this atlas
    defSprite: function (name, x, y, w, h, cx, cy) {
        var spt = {
            "id": name,
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "cx": cx === null ? 0 : cx,
            "cy": cy === null ? 0 : cy
        };

        this.sprites.push(spt);
    },

    //-----------------------------------------
    // Parse the JSON file passed in
    parseAtlasDefinition: function (atlasJSON) {

        //var parsed = JSON.parse(atlasJSON);
        var parsed = atlasJSON;

        // For each sprite in the parsed JSON
        for(var key in parsed.frames) {
            var sprite = parsed.frames[key];

            /**
             * Define the center of the sprite as an offset
             *
             * IMPORTANT to round the offsets; without rounding
             * there will be data loss in the images
             */
            var cx = -(((sprite.w * 0.5) + 0.5) << 0);
            var cy = -(((sprite.h * 0.5) + 0.5) << 0);

            // Define the sprite for this sheet by calling
            // defSprite to store it into the 'sprites' Array.
            this.defSprite(key, sprite.x, sprite.y, sprite.w, sprite.h, cx, cy);
        }
    },

    //-----------------------------------------
    // Walk through all the sprite definitions for this
    // atlas, and find which one matches the name.
    getStats: function (name) {
        for(var i = 0; i < this.sprites.length; i++) {
            if(this.sprites[i].id === name) {
                return this.sprites[i];
            }
        }
        return null;
    }

});

function clearSprite(spritename, posX, posY) {
    for(var sheetName in gSpriteSheets) {

        var sheet = gSpriteSheets[sheetName];
        var sprite = sheet.getStats(spritename);

        if(sprite === null) {
            continue;
        }

        ctx.clearRect(posX+sprite.cx, posY+sprite.cy, sprite.w, sprite.h);

        return;
    }
}

//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite name
function drawSprite(spritename, posX, posY) {
    for(var sheetName in gSpriteSheets) {

        var sheet = gSpriteSheets[sheetName];
        var sprite = sheet.getStats(spritename);

        if(sprite === null) {
            continue;
        }

        __drawSpriteInternal(sprite, sheet, posX, posY);

        return;
    }
}

//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite object stored in the 'sprites Array,
// the 'SpriteSheetClass' object stored in the
// 'gSpriteSheets' dictionary, and the position on
// canvas to draw to.
function __drawSpriteInternal(spt, sheet, posX, posY) {
    if (spt === null || sheet === null) {
        return;
    }

    var hlf = {
        x: spt.cx,
        y: spt.cy
    };

    ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX + hlf.x, posY + hlf.y, spt.w, spt.h);
}

