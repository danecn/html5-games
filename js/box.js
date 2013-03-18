"use strict";

var Box = Class.extend({
  name: "undefined_box",
  color: "#000",
  x: 0,
  y: 0,
  w: 50,
  h: 50,

  updated: true,

  init: function(name, x, y, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
  },

  draw: function(ctx) {
    if (this.updated) {
      console.log("draw " + this.name);
      var oldStyle = ctx.fillStyle;
      ctx.setFillColor(this.color);
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.setFillColor(oldStyle);
      this.updated = false;
    }
  },

  update: function() {
    // noop
  }
});