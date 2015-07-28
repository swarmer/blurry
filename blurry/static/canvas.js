'use strict';


function bound(obj, methodName) {
    return obj[methodName].bind(obj);
}

function fillCircle(ctx, centerX, centerY, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.translate(centerX, centerY);
    ctx.scale(radius, radius);

    ctx.arc(0, 0, 1, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
}


function CanvasDemo(canvas) {
    if (!(this instanceof CanvasDemo))
        return new CanvasDemo();

    this.lastTimestamp = null;
    this.canvas = canvas;
    this.x = 200;

    this.resize();
}

CanvasDemo.prototype.resize = function () {
    var canvas = this.canvas;
    canvas.width = $(canvas).width();
    canvas.height = $(canvas).height();
};

CanvasDemo.prototype.draw = function () {
    var ctx = this.canvas.getContext('2d');
    var width = this.canvas.width;
    var height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'red';
    fillCircle(ctx, this.x, 200, 100);
};

CanvasDemo.prototype.updateState = function (deltaMs) {
    this.x += (40 / 1000) * deltaMs;
};

CanvasDemo.prototype.tick = function (timestamp) {
    var deltaMs = (this.lastTimestamp === null) ?
        0 : (timestamp - this.lastTimestamp);

    this.updateState(deltaMs);
    this.lastTimestamp = timestamp;

    this.resize();
    this.draw();

    window.requestAnimationFrame(bound(this, 'tick'));
};

CanvasDemo.prototype.run = function () {
    window.requestAnimationFrame(bound(this, 'tick'));
};


$(document).ready(function () {
    var canvas = $('#canvas')[0];
    var canvasDemo = new CanvasDemo(canvas);
    canvasDemo.run();
});
