$(document).ready(function () {

    // Game board
    const xLimit = 10;
    const yLimit = 10;
    const zLimit = 7;
    let gameBoard = new Array(xLimit).fill(new Array(yLimit).fill(new Array(zLimit)));

    // Ships points  
    var ships = [[[7, 7, 6], [7, 6, 6], [7, 5, 6], [6, 7, 6], [6, 6, 6], [6, 5, 6]], [[2, 1, 4], [3, 1, 4], [4, 1, 4]], [[9, 9, 1], [8, 9, 1], [7, 9, 1], [6, 9, 1], [5, 9, 1]], [[5, 3, 3], [5, 4, 3]], [[1, 9, 5], [1, 8, 5]]];

    var checkedPoints = [];

    // ship I: 0 - 5 (6)
    // ship II: 6 - 8 (3)
    // ship III: 9 - 13 (5)
    // ship IV: 14 - 15 (2)
    // ship V: 16 - 17 (2)

    var player1 = {
        score: 0,
        name: "James",
        choice: [null, null, null]
    }

    var player2 = {
        score: 0,
        name: "Olaf",
        choice: [null, null, null]
    }

    var currentPlayer = player1;


    // $('#submit').click((e) => {
    //     // alert($('#xCor').val() + ", " + $('#yCor').val() + ", " + $('#depthCor').val());
    //     // setPlayerValues();
    //     player1.choice = [$('#xCor').val(), $('#yCor').val(), $('#depthCor').val()];
    //     checkCoordinates(currentPlayer);
    // });


    function submitChoice() {
        let xChoice = $('#xCor').val();
        let yChoice = $('#yCor').val();
        let zChoice = $('#depthCor').val();
        if (
            (xChoice >= 0 && xChoice <= xLimit)
            && (yChoice >= 0 && yChoice <= yLimit)
            && (zChoice >= 0 && zChoice <= zLimit)
        ) {
            currentPlayer.choice = [xChoice, yChoice, zChoice];
            checkCoordinates(currentPlayer);
            return false;
        } else {
            alert("Provided input is outside specified boundaries!");
        }
    }

    $("#theForm").submit(function (e) {
        e.preventDefault(); // <==stop page refresh==>
        submitChoice();
    });

    function updateScore() {
        $('#player1Score').text(player1.score);
        $('#player2Score').text(player2.score);
        $('#whosMoving').text("Moving now: " + currentPlayer.name);
    }

    function compareCoordinates(co1, co2) {
        if (co1[0] == co2[0]
            && co1[1] == co2[1]
            && co1[2] == co2[2]
        ) {
            return true;
        } else {
            return false;
        }
    }

    function checkCoordinates(player) {
        console.log("Player's choice: " + JSON.stringify(player.choice));
        if (checkCoordinatessHelper(player.choice, true)) {
            alert('Congratulations, you hit a ship');
            player.score += 10;
            updateScore();
        } else {
            if (currentPlayer == player1) {
                currentPlayer = player2;
            } else if (currentPlayer == player2) {
                currentPlayer = player1;
            }
            updateScore();
            alert('You missed, ' + currentPlayer.name + ' is next');
        }
    } // end of outer Check coordinates function

    function checkCoordinatessHelper(coordinates, returnShip) {
        let shipHit = false;
        let shipIndex = null;
        let theWholeShip = null;


        if (checkedPoints.length > 0) {
            for (let i = 0; i < checkedPoints.length; i++) {
                if (compareCoordinates(checkedPoints[i], coordinates)) {
                    console.log("Double!!! " + checkedPoints[i]);
                    return false;
                }
            }
        }

        checkedPoints.push(coordinates);
        for (var ship = 0; ship < ships.length; ship++) {
            for (let i = 0; i < ships[ship].length; i++) {
                let co = ships[ship][i];
                if (compareCoordinates(coordinates, co)
                ) {
                    console.log("Jackpot!");

                    shipHit = true;
                    shipIndex = ship;
                    theWholeShip = ships[ship];
                }
            } // end of level 3 for loop
        }
        console.log(checkedPoints);

        if (!shipHit) { // ship not hit
            return false;
        } else {
            if (returnShip) { // ship hit, returnship == true
                let output = [shipIndex, theWholeShip];
                // console.log(output);
                return output;

            } else { // ship hit, returnship == false
                return true;
            }
        }
    } // end of helper function

});