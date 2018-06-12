/* global io */


let can = document.getElementById('canvas1');
var ctx = can.getContext('2d');

// player's position
var playerX = 100;
var playerY = 100;
var playerid;
var allPlayers = {};

// how far offset the canvas is
let frame = 0;
let counter = 0;
let arrayWidth = 5;
let arrayHeight = 5;
let imageWidth = 2000;
let imageHeight = 1600;
let imageArray = [];
let bird = [];
let gratiot;
let gameStarted = false;
let timer;

 
var socket = io();

function draw() {
    Object.keys(allPlayers).forEach((player) => {
        if(allPlayers[player].moving) {
            allPlayers[player].frame = Math.floor(((counter++) % 8) / 4);
        }
        ctx.drawImage(bird[allPlayers[player].frame||0], allPlayers[player].x, allPlayers[player].y, 100, 100);
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

    console.log('done loading');
    window.requestAnimationFrame(myRenderTileSetup);
}


function myRenderTileSetup() {
    if(gameStarted) {
        clearInterval(timer);
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
        
        ctx.restore();
    } else {
        ctx.drawImage(gratiot, 0, 0, 800, 600);
        if(!timer) {
            timer = setInterval(function() {
                frame = (frame+1)%2;
            }, 400);
        }
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
    if(movement.left||movement.up||movement.right||movement.down) {
        socket.emit('startmove');
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
    if(!movement.left&&!movement.up&&!movement.right&&!movement.down) {
        socket.emit('endmove');
    }
});

setup();

socket.emit('new player');

setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

socket.on('initstate', function(data) {
    playerid = data[0];
});



socket.on('state', function(players) {
    allPlayers = players;
});

