const COLOURS = {
  grass: '#789e5a'
};

let engine = new Worker('./engine/engine.js');
engine.onmessage = ({data}) => {
  console.log(data);
};

function replaceColours(tile, ...replaceColours) {
  let img = tile.image();
  dummyCanvas.width = img.width;
  dummyCanvas.height = img.height;
  xc.drawImage(img, 0, 0);
  let data = xc.getImageData(0, 0, img.width, img.height);
  for (let i = 0; i < data.data.length; i += 4) {
    for (let j = tile.replace.length; j--;) {
      if (data.data[i] === (tile.replace[j] >> 16) % 256
          && data.data[i + 1] === (tile.replace[j] >> 8) % 256
          && data.data[i + 2] === tile.replace[j] % 256) {
        data.data[i] = (replaceColours[j] >> 16) % 256;
        data.data[i + 1] = (replaceColours[j] >> 8) % 256;
        data.data[i + 2] = replaceColours[j] % 256;
      }
    }
  }
  return data;
}

let tileCanvas, tc;
let uiCanvas, uc;
let dialogCanvas, dc;
let dummyCanvas, xc;
let tileData;
function init([_, images]) {
  tileData = images;

  tileCanvas = createElement('canvas');
  document.body.appendChild(tileCanvas);
  tc = tileCanvas.getContext('2d');
  uiCanvas = createElement('canvas');
  document.body.appendChild(uiCanvas);
  uc = uiCanvas.getContext('2d');
  dialogCanvas = createElement('canvas');
  document.body.appendChild(dialogCanvas);
  dc = dialogCanvas.getContext('2d');
  dummyCanvas = createElement('canvas', { classes: 'hidden' });
  document.body.appendChild(dummyCanvas);
  xc = dummyCanvas.getContext('2d');
  prepCanvas();
  window.addEventListener('resize', prepCanvas);

  paint();
}
function prepCanvas() {
  [[tileCanvas, tc], [uiCanvas, uc], [dialogCanvas, dc]].forEach(([canvas, context]) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.oImageSmoothingEnabled = false;
  });
  paint(); // TEMP
}

function paint() {
  tc.fillStyle = COLOURS.grass;
  tc.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
  console.time();
  function randomColour() {
    return Math.floor(Math.random() * 0x1000000);
  }
  for (let i = 1000; i--;) {
    tc.putImageData(replaceColours(tileData.smallHouse, randomColour(), randomColour()), (i % 30) * 40, Math.floor(i / 30) * 40);
  }
  console.timeEnd();
}

function prepareImages() {
  let promises = [];
  function image(src) {
    let img = new Image();
    promises.push(new Promise(res => img.onload = res));
    img.src = src;
    return () => img;
  }
  let data = {
    smallHouse: {
      image: image('./images/house.png'),
      w: 1, h: 1,
      replace: [0x00FF00, 0xFF00FF]
    }
  };
  return Promise.all(promises).then(() => data);
}

Promise.all([
  new Promise(res => document.addEventListener('DOMContentLoaded', res, {once: true})),
  prepareImages()
]).then(init);
