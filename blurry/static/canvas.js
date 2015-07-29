'use strict';


function bound(obj, methodName) {
    return obj[methodName].bind(obj);
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function negativeMod(x, n) {
    return ((x % n) + n) % n;
}

function prerenderCircle (circleRadius, color) {
    var size = 2 * circleRadius;

    var buffer = document.createElement('canvas');
    buffer.width = size;
    buffer.height = size;

    var ctx = buffer.getContext('2d');

    var red = color[0], green = color[1], blue = color[2], alpha = color[3];
    var center = size / 2;
    var gradient = ctx.createRadialGradient(
        center, center, center, center, center, 0
    );

    var stops = [
        [0, 0],
        [0.1, 0.02612],
        [0.2, 0.05613],
        [0.3, 0.110],
        [0.4, 0.197],
        [0.5, 0.324],
        [0.6, 0.486],
        [0.7, 0.667],
        [0.8, 0.835],
        [0.9, 0.956],
        [1, 1],
    ];
    for (var i = 0; i < stops.length; ++i) {
        var stop = stops[i][0];
        var coeff = stops[i][1];

        var color = sprintf('rgba(%d, %d, %d, %f)',
            red, green, blue, alpha * coeff
        );
        gradient.addColorStop(stop, color);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return buffer;
}


function CanvasDemo(canvas) {
    if (!(this instanceof CanvasDemo))
        return new CanvasDemo();

    this.lastTimestamp = null;
    this.canvas = canvas;
    this.circles = this.generateCircles(this.circleCount);
}

CanvasDemo.prototype.circleCount = 20;

CanvasDemo.prototype.pixelsPerSecond = 40;

CanvasDemo.prototype.generateCircle = function () {
    var canvasWidth = this.canvas.width;
    var canvasHeight = this.canvas.height;

    var minDimension = Math.min(canvasWidth, canvasHeight);
    var minRadius = Math.floor(minDimension / 4);
    var maxRadius = Math.floor(minDimension / 1.5);
    var circleRadius = _.random(minRadius, maxRadius);

    var minRGB = 64;
    var maxRGB = 255;
    var red = _.random(minRGB, maxRGB);
    var green = _.random(minRGB, maxRGB);
    var blue = _.random(minRGB, maxRGB);
    var color = [red, green, blue, 0.7];

    var centerX = _.random(0, canvasWidth);
    var centerY = _.random(0, canvasHeight);

    var direction = randFloat(0, 2 * Math.PI);

    return {
        buffer: prerenderCircle(circleRadius, color, this.blurRadius),

        centerX: centerX,
        centerY: centerY,
        direction: direction
    };
};

CanvasDemo.prototype.generateCircles = function (count) {
    var circles = [];
    for (var i = 0; i < count; ++i)
        circles.push(this.generateCircle());
    return circles;
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

    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < this.circles.length; ++i) {
        var circle = this.circles[i];
        var leftX = circle.centerX - circle.buffer.width / 2;
        var topY = circle.centerY - circle.buffer.height / 2;
        ctx.drawImage(circle.buffer, leftX, topY);
    }
};

CanvasDemo.prototype.updateState = function (deltaMs) {
    for (var i = 0; i < this.circles.length; ++i) {
        var circle = this.circles[i];
        var step = this.pixelsPerSecond / 1000 * deltaMs;
        var newX = circle.centerX + step * Math.cos(circle.direction);
        var newY = circle.centerY + step * Math.sin(circle.direction);

        var hold = false;
        if (newX >= this.canvas.width || newX < 0) {
            circle.direction = Math.PI - circle.direction;
            hold = true;
        }
        if (newY >= this.canvas.height || newY < 0) {
            circle.direction = 2 * Math.PI - circle.direction;
            hold = true;
        }
        circle.direction = negativeMod(circle.direction, 2 * Math.PI);

        if (!hold) {
            circle.centerX = newX;
            circle.centerY = newY;
        }
    }
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
