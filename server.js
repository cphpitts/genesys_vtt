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
    

    socket.on('dice', diceMsg);
    socket.on('roll', updateDice);



    function diceMsg(value) {
        socket.broadcast.emit('dice', value);
    }

    function updateDice(newValues) {
        socket.broadcast.emit('roll', newValues);
    }

})


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

