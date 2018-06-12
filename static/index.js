let can = document.getElementById('canvas1');
var ctx = can.getContext('2d');

var thingsOnMap = [
    [50,50],
    [55,70],
    [15,22],
    [150,20],
    [120,80],
    [100,10],
    [170,40],
    [130,70],
    [230,10],
    [330,45],
    [250,65]
];

// player's position
var playerX = 100;
var playerY = 100;

// how far offset the canvas is
var offsetX = 0;
var offsetY = 0;
let keys = [];
let frame = 0;
let counter = 0;
let arrayWidth = 5;
let arrayHeight = 5;
let imageWidth = 2000;
let imageHeight = 1600;
let imageArray = [];
let bird = [];
let gratiot;
let gameStarted;
let gameInitialized;
let timer;
let hitmapContext;

 
var socket = io();
socket.on('message', function(data) {
    console.log(data);
});


function draw() {
    if(!gameStarted) {
        ctx.drawImage(gratiot, 0, 0, 800, 600);
        if(!timer) {
            timer = setInterval(function() {
                frame = (frame+1)%2;
            }, 400);
        }
    }
    else if(!gameInitialized) {
        clearInterval(timer);
        ['left', 'right', 'up', 'down'].forEach(function (elt) {
            let node = document.getElementById(elt);
            ['mousedown', 'touchstart'].forEach(evt =>
                node.addEventListener(evt, () => { keys[elt] = true; }, false)
            );
            ['mouseup', 'touchend', 'touchcancel'].forEach(evt =>
                node.addEventListener(evt, () => { keys[elt] = false; }, false)
            );
        });
        gameInitialized = true;
    }
    ctx.drawImage(bird[frame], playerX - offsetX, playerY - offsetY, 100, 100);
}



window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
});


//stackoverflow
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}



async function setup(){
    let imagesLoading = [];
    let images = [];
    for(let i = 0; i < 25; i++) {
        images[i] = `tiles/tile${pad(i,3)}.png`;
    }
    images.push('img/bird0.png');
    images.push('img/bird1.png');
    images.push('img/gratiot.png');
    images.push('img/hitmap.png');

    for(var i = 0; i < images.length; i++) {
        var imageObj = new Image();
        imagesLoading[i] = new Promise((resolve) => {
            imageObj.onload = function(pos) {
                resolve(this);
            };
            imageObj.src = images[i];
        });
    }

    console.log('images loading');
    imageArray = await Promise.all(imagesLoading);
    bird[0] = imageArray[25];
    bird[1] = imageArray[26];
    gratiot = imageArray[27];

    var canvas = document.createElement('canvas');
    hitmapContext = canvas.getContext('2d');
    var img = imageArray[28];
    canvas.width = img.width;
    canvas.height = img.height;
    hitmapContext.drawImage(img, 0, 0 );
    console.log('done loading');
    window.requestAnimationFrame(myRenderTileSetup);
}


function myRenderTileSetup() {
    if(gameStarted) {
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.clearRect(0, 0, can.width, can.height);
        var renderedCount = 0;
        for(let y = 0; y < arrayWidth; y++){
            for(let x = 0; x < arrayHeight; x++){
                let pos = x + y * arrayWidth;
                if(imageArray[pos] && imageArray[pos].complete){
                    ctx.drawImage(imageArray[pos],(pos%arrayWidth)*imageWidth, Math.floor(pos/arrayWidth)*imageHeight);
                    //imageArray[pos] = undefined;
                } else {
                    renderedCount += 1;
                }
            }
        }
        whatKey();
        draw();
        ctx.restore();
    }
    else {
        if(keys[32]) {
            gameStarted = true;
        }
        draw();
    }
    window.requestAnimationFrame(myRenderTileSetup);
}
function whatKey() {
    let oldOffsetX = offsetX;
    let oldOffsetY = offsetY;
    let speed = 5;
    let check = false;
    if(keys[37]||keys['left']) {
        offsetX = Math.min(0, offsetX + speed);
        frame = Math.floor(((counter++) % 8)/4);
        check = true;
    }
    if(keys[39]||keys['right']) {
        offsetX = Math.max(-imageWidth*arrayWidth, offsetX - speed);
        frame = Math.floor(((counter++) % 8)/4);
        check = true;
    }
    if(keys[40]||keys['down']) {
        offsetY = Math.max(-imageHeight*arrayHeight, offsetY - speed);
        frame = Math.floor(((counter++) % 8)/4);
        check = true;
    }
    if(keys[38]||keys['up']) {
        offsetY = Math.min(0, offsetY + speed);
        frame = Math.floor(((counter++) % 8)/4);
        check = true;
    }
    if(keys[32]) {
        gameStarted = true;
    }
    if(check) {
        let coord = hitmapContext.getImageData(Math.floor(-offsetX/10+17), Math.floor(-offsetY/10+17), 1, 1);
        if(coord.data[2] == 221) {
            offsetX = oldOffsetX;
            offsetY = oldOffsetY;
        }
        console.log('here');
        socket.emit('chat message', [offsetX,offsetY]);
    }
}

setup();

document.getElementById('start').addEventListener('click', function() {
    gameStarted=true;
});

