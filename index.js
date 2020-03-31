const convert = require("color-convert");
const Canvas = require("canvas").Canvas;
const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

function createCanvas(width, height) {
  if (isBrowser) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    return canvas;
  } else {
    return new Canvas(width, height);
  }
}

class Heat {
  constructor(width, height, opts) {
    if (!opts) opts = {};

    this.width = width;
    this.height = height;

    this.canvas = createCanvas(this.width, this.height);

    this.radius = opts.radius || 20;
    this.threshold = opts.threshold || 0;
    this.scalar = { x: 1, y: 1 };
  }

  scale(x, y) {
    if (y === undefined) y = x;

    this.scalar.x = x;
    this.scalar.y = y;

    this.width = this.width * x;
    this.height = this.height * y;

    this.canvas.getContext("2d").scale(x, y);

    return this.scalar;
  }

  addPoint(x, y, radius = this.radius, weight = 1 / 10) {
    const ctx = this.canvas.getContext("2d");

    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);

    g.addColorStop(0, "rgba(255,255,255," + weight + ")");
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

    return this;
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.canvas.getContext("2d");

    const values = ctx.getImageData(0, 0, this.width, this.height);
    const heat = ctx.createImageData(width, height);

    for (var hy = 0; hy < height; hy++) {
      var vy = Math.floor(hy / this.scalar.y);

      for (var hx = 0; hx < width; hx++) {
        var vx = Math.floor(hx / this.scalar.x);
        var vi = 4 * (vy * this.width + vx);
        var hi = 4 * (hy * width + hx);

        var v = values.data[vi + 3];
        if (v > this.threshold) {
          var theta = (1 - v / 255) * 270;
          var rgb = convert.hsl.rgb(theta, 100, 50);
          heat.data[hi] = rgb[0];
          heat.data[hi + 1] = rgb[1];
          heat.data[hi + 2] = rgb[2];
          heat.data[hi + 3] = v;
        }
      }
    }

    this.canvas.getContext("2d").putImageData(heat, 0, 0);

    return this;
  }
}

module.exports = Heat;
