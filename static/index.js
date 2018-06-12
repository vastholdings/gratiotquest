/* global io */


let can = document.getElementById('canvas1');
var ctx = can.getContext('2d');

// player's position
var playerX = 100;
var playerY = 100;
var playerid;
var allPlayers = {};

// how far offset the canvas is
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
        gameInitialized = true;
    }
    
    Object.keys(allPlayers).forEach((player) => {
        ctx.drawImage(bird[frame], allPlayers[player].x, allPlayers[player].y, 100, 100);
    });
}

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
            imageObj.onload = function() {
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
        let offsetX = allPlayers[playerid].x;
        let offsetY = allPlayers[playerid].y;
        ctx.translate(-offsetX+100, -offsetY+100);
        ctx.clearRect(0, 0, can.width, can.height);
        var renderedCount = 0;
        for(let y = 0; y < arrayWidth; y++){
            for(let x = 0; x < arrayHeight; x++){
                let pos = x + y * arrayWidth;
                if(imageArray[pos] && imageArray[pos].complete){
                    ctx.drawImage(imageArray[pos],(pos%arrayWidth)*imageWidth, Math.floor(pos/arrayWidth)*imageHeight);
                }
            }
        }
        draw();
        if(movement.left||movement.right||movement.up||movement.down) {
            frame = Math.floor(((counter++) % 8)/4);
        }
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

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
};
document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
    case 37:
        movement.left = true;
        break;
    case 38:
        movement.up = true;
        break;
    case 39:
        movement.right = true;
        break;
    case 40:
        movement.down = true;
        break;
    case 32:
        gameStarted = true;
        break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
    case 37:
        movement.left = false;
        break;
    case 38:
        movement.up = false;
        break;
    case 39:
        movement.right = false;
        break;
    case 40:
        movement.down = false;
        break;
    }
});

// function whatKey() {
//     let oldOffsetX = offsetX;
//     let oldOffsetY = offsetY;
//     let speed = 5;
//     let check = false;
//     if(keys[37]||keys['left']) {
//         offsetX = Math.min(0, offsetX + speed);
//         frame = Math.floor(((counter++) % 8)/4);
//         check = true;
//     }
//     if(keys[39]||keys['right']) {
//         offsetX = Math.max(-imageWidth*arrayWidth, offsetX - speed);
//         frame = Math.floor(((counter++) % 8)/4);
//         check = true;
//     }
//     if(keys[40]||keys['down']) {
//         offsetY = Math.max(-imageHeight*arrayHeight, offsetY - speed);
//         frame = Math.floor(((counter++) % 8)/4);
//         check = true;
//     }
//     if(keys[38]||keys['up']) {
//         offsetY = Math.min(0, offsetY + speed);
//         frame = Math.floor(((counter++) % 8)/4);
//         check = true;
//     }
//     if(keys[32]) {
//         gameStarted = true;
//     }
//     if(check) {
//         let coord = hitmapContext.getImageData(Math.floor(-offsetX/10+17), Math.floor(-offsetY/10+17), 1, 1);
//         if(coord.data[2] == 221) {
//             offsetX = oldOffsetX;
//             offsetY = oldOffsetY;
//         }
//         console.log('here');
//         socket.emit('chat message', [offsetX,offsetY]);
//     }
// }

setup();


socket.emit('new player');

setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

socket.on('initstate', function(data) {
    playerid = data[0];
    offsetX = data[1];
    offsetY = data[2];
});



socket.on('state', function(players) {
    allPlayers = players;
});

