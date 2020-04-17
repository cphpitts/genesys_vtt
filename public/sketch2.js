var socket = io();

function setup() {
    // createCanvas(600, 400);
    // background(51);
    socket = io();
    // socket = io.connect('http://localhost:3000');
    // socket.on('mouse', newDrawing);
    socket.on('dice', recieveDie);
    socket.on('roll', updateDice);
}



function addDie(value) {
    socket.emit('dice', value);
    console.log("Sending: " + value);
    var dicePool = document.getElementById('diceTray');
    dicePool.innerHTML += "<div class='dice'>d" + value + "</div>";
}

function recieveDie(value) {
    var dicePool = document.getElementById('diceTray');
    dicePool.innerHTML += "<div class='dice'>d" + value + "</div>";
}

function rollDice() {
    var diceArray = document.getElementsByClassName('dice');
    var diceValue =[];
    for (i=0; i<diceArray.length; i++) {
        diceValue[i] = Math.floor(Math.random() * 10);
        diceArray[i].innerHTML = diceValue[i];
    }
    socket.emit('roll', diceValue);
}

function updateDice(newValues) {
    var diceArray = document.getElementsByClassName('dice');
    for (i=0; i<diceArray.length; i++) {
        diceArray[i].innerHTML = newValues[i];
    }
}



function draw() {
    
}