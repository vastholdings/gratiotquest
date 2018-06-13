// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);


var chats = [];


app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));




app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'static/index.html'));
});


// Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});


var players = {};

//Add the WebSocket handlers
io.on('connection', function(socket){
    console.log('a user connected', socket.id);
    socket.on('new player', function() {
        let x = Math.floor(Math.random()*1000);
        let y = Math.floor(Math.random()*800);
        players[socket.id] = {
            x: x,
            y: y 
        };
        socket.emit('initstate', socket.id);
        socket.emit('chats', chats);
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });

    socket.on('startmove', function() {
        var player = players[socket.id] || {};
        player.moving = true;
    });
    socket.on('endmove', function() {
        var player = players[socket.id] || {};
        player.moving = false;
    });

    socket.on('disconnect', function(){
        delete players[socket.id];
        console.log('user disconnected', socket.id);
    });
    socket.on('chat message', function(msg){
        var obj = {msg: msg, timestamp: new Date()};
        chats.push(obj);
        io.emit('chat message', obj);
    });
});
    

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 20);


