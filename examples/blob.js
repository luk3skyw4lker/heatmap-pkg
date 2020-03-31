const Heatmap = require("../index");
const fs = require("fs");
const heat = new Heatmap(500, 500, { radius: 30 });

for (let i = 0; i < 5000; i += 1) {
  let rho = Math.random() * 3 * Math.PI;
  var z = Math.pow(Math.random(), 2) * 200;

  var x = 250 + Math.cos(rho) * z;
  var y = 250 + Math.sin(rho) * z;

  heat.addPoint(x, y);
}

heat.draw();

fs.writeFileSync("blob.png", heat.canvas.toBuffer());
