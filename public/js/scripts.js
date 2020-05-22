//NODE
var socket = io();
function setup() {
    socket.on('addDie', recieveDie);
    socket.on('resetDice', resetDicePool);
    socket.on('rollDice', rollDice);
    socket.on('updateDice', updateDice);
    socket.on('newChar', newChar);
    socket.on('clearCharList', clearCharList);
    socket.on('removeCharacter', removeCharacter);
}

// SET GENESYS DICE
// [SUCCESS/FAILURE, ADV/DISADV, TRIUMPH, DESPAIR]
const GENESYS = {
    'boost': [[0,0,0,0],[0,0,0,0],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,0,0]],
    'ability': [[0,0,0,0],[1,0,0,0],[1,0,0,0],[2,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,2,0,0]],
    'proficiency': [[0,0,0,0],[1,0,0,0],[1,0,0,0],[2,0,0,0],[2,0,0,0],[0,1,0,0],[1,1,0,0],[1,1,0,0],[1,1,0,0],[0,2,0,0],[0,2,0,0],[0,0,1,0]],
    'setback': [[0,0,0,0],[0,0,0,0],[-1,0,0,0],[-1,0,0,0],[0,-1,0,0],[0,-1,0,0]],
    'difficulty':[[0,0,0,0],[-1,0,0,0],[-2,0,0,0],[0,-1,0,0],[0,-1,0,0],[0,-1,0,0],[0,-2,0,0],[-1,-1,0,0]],
    'challenge': [[0,0,0,0],[-1,0,0,0],[-1,0,0,0],[-2,0,0,0],[-2,0,0,0],[0,-1,0,0],[0,-1,0,0],[-1,-1,0,0],[-1,-1,0,0],[0,-2,0,0],[0,-2,0,0],[0,0,0,1]]
};


// const BOOST = [[0,0,0],[0,0,0],[1,0,0],[1,1,0],[0,2,0],[0,1,0]];
// const ABILITY = [[0,0,0],[1,0,0],[1,0,0],[2,0,0],[0,1,0],[0,1,0],[1,1,0],[0,2,0]];
// const PROFICIENCY = [[0,0,0],[1,0,0],[1,0,0],[2,0,0],[2,0,0],[0,1,0],[1,1,0],[1,1,0],[1,1,0],[0,2,0],[0,2,0],[0,0,1]];
// const SETBACK = [[0,0,0],[0,0,0],[-1,0,0],[-1,0,0],[0,-1,0],[0,-1,0]];
// const DIFFICULTY = [[0,0,0],[-1,0,0],[-2,0,0],[0,-1,0],[0,-1,0],[0,-1,0],[0,-2,0],[-1,-1,0]];
// const CHALLENGE = [[0,0,0],[-1,0,0],[-1,0,0],[-2,0,0],[-2,0,0],[0,-1,0],[0,-1,0],[-1,-1,0],[-1,-1,0],[0,-2,0],[0,-2,0],[0,0,-1]];


//HTML CONTAINERS
const DICETRAY = document.getElementById('diceTray');
const DICELOG = document.getElementById("diceLog");

//GENERATE DICE STRUCTURE
function generateDie(size, type, value = type) {
    // return "<div class='die " + type + "' data-size='" + size + "' data-type='" + type + "'>" + value + "</div>";
    return "<div class='die " + type + "' data-size='" + size + "' data-type='" + type + "'></div>";
}

//ADD DICE 
//- LOCAL
$('.dieBar button').click(function() {
    var dieSize = $(this).data('size');
    var dieType = $(this).data('type');
    DICETRAY.innerHTML += generateDie(dieSize, dieType);
    //SEND NEW DIE
    socket.emit('addDie', dieSize, dieType);
});
//-REMOTE
function recieveDie(dieSize, dieType) {
    DICETRAY.innerHTML += generateDie(dieSize, dieType);
}

//ROLL DICE
//-LOCAL
$('#controls #rollDice').click(function() {
    var dieArray = document.getElementsByClassName('die');
    var success = 0;
    var advantage = 0;
    var triumph = 0;
    var despair = 0;
    var total = 0;
    var poly = false;
    var genesys = false;
    var dieValues = [];
    for (i=0; i<dieArray.length; i++) {
        var maxValue = parseInt(dieArray[i].dataset.size);
        var dieResult = Math.floor(Math.random() * maxValue);
        if (dieArray[i].classList.contains('poly')) {
            poly = true;
            dieResult++;
            total += dieResult;
            dieArray[i].innerHTML = dieResult;
        } else {
            genesys = true;
            var genType = dieArray[i].classList[1];
            //ADD SUCCESS/FAILURE/DESPAIR AND TRIUMPH TO SUCCESS VALUE
            success += GENESYS[genType][dieResult][0];
            success += GENESYS[genType][dieResult][2];
            success -= GENESYS[genType][dieResult][3]; 
            //ADD ADVANTAGE/DISADVANTAGE TO ADVANTAGE VALUE
            advantage += GENESYS[genType][dieResult][1];
            //ADD TRIUMPH TO TRIUMPH VALUE
            triumph += GENESYS[genType][dieResult][2];
            //ADD DESPAIR TO DESPAIR VALUE
            despair += GENESYS[genType][dieResult][3];
        }
        dieArray[i].dataset.value = dieResult;
        dieValues.push(dieResult);
    }

    var results = "";
    if (document.getElementById('rollLabel').value != "") {
        results += document.getElementById('rollLabel').value + ":</br>"
    }
    if (genesys) {
        if (success > 0 ) {
            results += "Success: " + success + "<br />";
        } else {
            results += "Failure: " + Math.abs(success) + "<br />";
        };
        if (advantage > 0) {
            results += "Advantage: " + advantage + "<br />";
        } else if (advantage < 0) {
            results += "Disadvantage: " + Math.abs(advantage) + "<br />";
        }; 
        if (triumph > 0) {
            results += "Triumph: " + triumph + "<br />";
        };
        if (despair > 0) {
            results += "Despair: " + despair + "<br />";
        };
    }
    if (poly) {
        results += "Total: " + total + "<br />";
    }
    results += "<br /><hr /><br />";
    DICELOG.innerHTML += results;
    //SEND INFORMATION
    socket.emit('rollDice', dieValues, results);
});

//-REMOTE
function rollDice(dieValues, results) {
    DICELOG.innerHTML += results;
    var dieArray = document.getElementsByClassName('die');
    for (i=0; i<dieArray.length; i++) {
        dieArray[i].dataset.value = dieValues[i];
        if (dieArray[i].classList.contains('poly')) {
            dieArray[i].innerHTML = dieValues[i]
        }
    }
}

// RESET DICE
$('#resetDice').click(function() {
    resetDicePool();
    socket.emit('resetDice');
});

function resetDicePool() {
    DICETRAY.innerHTML = "";
}

//REMOVE DICE
$(document).on('click', '.die', function() {
    $(this).remove();
    var updatedDice = DICETRAY.innerHTML;
    socket.emit('updateDice', updatedDice);
});

function updateDice(updatedDice) {
    DICETRAY.innerHTML = updatedDice;
}

// ADD CHARACTER INFORMATION
$('#addCharForm').click( function() {
    charInfo = {}
    charInfo.name = document.getElementById('inputName').value;
    charInfo.type = document.getElementById('inputType').value;
    if (document.getElementById('groupSize')) {
        charInfo.size = document.getElementById('groupSize').value;
    }
    console.log(charInfo)
    socket.emit('addCharacter', charInfo);
    $('#charInput').modal('hide')
});

$('#clearChars').click( function() {
    console.log('step one')
    socket.emit('clearCharList');
});

function clearCharList() {
    var characterList = document.getElementById('characterList');
    characterList.innerHTML = "";
}

function newChar(charInfo, charID) {
    charContainer = '<div class="card" id=' + charID + '><div class="card-body"><h5 class="card-title">' + charInfo.name + '  |  <span class="card-subtitle mb-2 ' + charInfo.type.toLowerCase() + '">' + charInfo.type + '</span></h5>'
    if (charInfo.type == "Minion") {
       charContainer += '<p class="card-text">Minion Group Size: ' + charInfo.size + '</p>'
    }
    charContainer += '</div></div>'
    var characterList = document.getElementById('characterList');
    characterList.innerHTML += charContainer;
}

//REMOVE CHARACTER
$(document).on('click', '.card', function() {
    cardID = $(this).attr("id");
    console.log(cardID);
    socket.emit('removeCharacter', cardID);
});

function removeCharacter(cardID) {
    console.log("step 2: " + cardID);
    var characterContainer = document.querySelector('.card#' + cardID);
    characterContainer.parentNode.removeChild(characterContainer);
}

//ADD GROUP SIZE TO MINION ADDITION
$('#typeSelector').change(function() {
    if (document.getElementById('inputType').value == "Minion") {
        document.getElementById('minionSize').innerHTML = '<label for="inputName">Minion Group Size</label><input type="text" class="form-control" id="minionSize">'
    } else {
        document.getElementById('minionSize').innerHTML = ""
    }
});