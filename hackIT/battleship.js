$(document).ready(function () {

    // Game board
    const x = 10;
    const y = 10;
    const z = 7;
    let gameBoard = new Array(x).fill(new Array(y).fill(new Array(z)));

    // Ships points  
    var ships = [[[7, 7, 6], [7, 6, 6], [7, 5, 6], [6, 7, 6], [6, 6, 6], [6, 5, 6]], [[2, 1, 4], [3, 1, 4], [4, 1, 4]], [[9, 9, 1], [8, 9, 1], [7, 9, 1], [6, 9, 1], [5, 9, 1]], [[5, 3, 3], [5, 4, 3]], [[1, 9, 5], [1, 8, 5]]];


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
        currentPlayer.choice = [$('#xCor').val(), $('#yCor').val(), $('#depthCor').val()];
        checkCoordinates(currentPlayer);
        return false;

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
            // console.log('Yor choice: ' + playersInput);
        }
        console.log("P1 score: " + player1.score);
        console.log("P2 score: " + player2.score);
        console.log("current player: " + currentPlayer.name);
    } // end of outer Check coordinates function

    function checkCoordinatessHelper(coordinates, returnShip) {
        let shipHit = false;
        let shipIndex = null;
        let theWholeShip = null;
        for (var ship = 0; ship < ships.length; ship++) {
            // console.log("ship length: " + ships[ship].length);
            for (let i = 0; i < ships[ship].length; i++) {

                // console.log("ship:" + ship + ", index: " + i);
                let co = ships[ship][i];
                // console.log("CO: " + co);
                // console.log("**Comparison: " + coordinates + " vs " + co + "**");
                if (coordinates[0] == co[0]
                    && coordinates[1] == co[1]
                    && coordinates[2] == co[2]
                ) {
                    console.log("Jackpot!");
                    shipHit = true;
                    shipIndex = ship;
                    theWholeShip = ships[ship];
                    // console.log("Ship index: " + shipIndex);
                    // console.log("The whole ship: " + theWholeShip);
                }
            }
        }

        if (!shipHit) { // ship not hit
            return false;
        } else {
            if (returnShip) { // ship hit, returnship == true
                let output = [shipIndex, theWholeShip];
                console.log(output);
                return output;

            } else { // ship hit, returnship == false
                return true;
            }
        }
    } // end of helper function

});