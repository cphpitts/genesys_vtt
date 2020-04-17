var express = require('express');
var PORT = process.env.PORT || 3000; 

var app = express();
var server = app.listen(PORT);

app.use(express.static('public'));

console.log('My Socket Server is Running');

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection: " + socket.id);

    socket.on('mouse', mouseMsg);
    socket.on('dice', diceMsg);
    socket.on('roll', updateDice);

    function mouseMsg(data) {
        socket.broadcast.emit('mouse', data); //SEND TO ALL BUT SENDING CLIENT
        //io.sockets.emit('mouse', data);  |SEND TO ALL CLIENTS
        console.log(data);
    }

    function diceMsg(value) {
        socket.broadcast.emit('dice', value);
    }

    function updateDice(newValues) {
        socket.broadcast.emit('roll', newValues);
    }
}

