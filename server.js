var express = require('express');
const PORT = process.env.PORT || 3000; 
var app = express();

var http = require('http');
server = http.Server(app);

app.use(express.static('public'));

server.listen(PORT, function() {
    console.log('Server is running');
});

var io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log("new connection: " + socket.id);
    var newID = Math.floor(Math.random() * 999 + 1);
    console.log("Player ID: " + newID);
    socket.broadcast.emit('newPlayer', newID);
    

    socket.on('dice', diceMsg);
    socket.on('roll', updateDice);



    function diceMsg(value) {
        console.log("newDie: " + value);
        socket.broadcast.emit('dice', value);
    }

    function updateDice(newValues) {
        socket.broadcast.emit('roll', newValues);
    }

})


function newConnection(socket) {
    console.log("new connection: " + socket.id);

    socket.on('dice', diceMsg);
    socket.on('roll', updateDice);


    function diceMsg(value) {
        socket.broadcast.emit('dice', value);
    }

    function updateDice(newValues) {
        socket.broadcast.emit('roll', newValues);
    }
}

