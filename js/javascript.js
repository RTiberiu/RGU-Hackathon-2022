import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

$(document).ready(function() {
    
    // Game board
    const xLimit = 10;
    const yLimit = 10;
    const zLimit = 7;
        
    // Ships points  
    let ships = [
        [[7, 7, 6], [7, 6, 6], [7, 5, 6], [6, 7, 6], [6, 6, 6], [6, 5, 6]],
        [[2, 1, 4], [3, 1, 4], [4, 1, 4]],
        [[9, 9, 1], [8, 9, 1], [7, 9, 1], [6, 9, 1], [5, 9, 1]],
        [[5, 3, 3], [5, 4, 3]],
        [[1, 9, 5], [1, 8, 5]]
    ];

    var checkedPoints = [];
    let shipBoxes = [[],[],[],[],[]];
    let otherBoxes = [];
    let otherPoints = [];

    var shipObjects = [{
        index: 0,
        fields: 6,
        hit: 0
    }, {
        index: 1,
        fields: 3,
        hit: 0
    }, {
        index: 2,
        fields: 5,
        hit: 0
    }, {
        index: 3,
        fields: 2,
        hit: 0
    }, {
        index: 4,
        fields: 2,
        hit: 0
    }];

    // Players
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

    function submitChoice() { // takes the player input (coordinates) from the html form
        let xChoice = $('#xCor').val();
        let yChoice = $('#yCor').val();
        let zChoice = $('#depthCor').val();
        if (    // checks if the input values (coordinates) are within the specified ranges
            (xChoice !== "" && xChoice > 0 && xChoice <= xLimit)
            && (yChoice !== "" && yChoice > 0 && yChoice <= yLimit)
            && (zChoice !== "" && zChoice > 0 && zChoice <= zLimit)
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

    function updateScore() {  // updates the HTML page
        $('#player1Score').text(player1.score);
        $('#player2Score').text(player2.score);
        $('#whosMoving').text("Moving now: " + currentPlayer.name);
    }

    function compareCoordinates(co1, co2) { // updates the HTML page
        if (co1[0] == co2[0]
            && co1[1] == co2[1]
            && co1[2] == co2[2]
        ) {
            return true;
        } else {
            return false;
        }
    }

    function checkGameOver() { // checks if all the ships have been sunk
        let gameOver = true;
        for (let i = 0; i < shipObjects.length; i++) {
            if (shipObjects[i].hit !== shipObjects[i].fields) {
                gameOver = false;
                console.log("GameOver: " + gameOver + "snr: " + i);
                console.log(shipObjects[i].hit + " / " + shipObjects[i].fields);
                break;
            }
            console.log("GameOver: " + gameOver + "snr: " + i);
            console.log(shipObjects[i].hit + " / " + shipObjects[i].fields);
        }
        if (gameOver == true) {
            // Remove missed hits
            otherBoxes.forEach(box => {
                console.log(box);
                scene.remove(box);
            });
            addGameOverDetails();
        }
        return gameOver;
    }

    function checkCoordinates(player) { // check the coordinates stored in the 'choice' field of 'player' object
        console.log("Player's choice: " + JSON.stringify(player.choice));
        var theResult = checkCoordinatessHelper(player.choice);
        if (theResult[0] !== false) { // If the coordinates haven't been already checked

            console.log("The result: ");
            console.log(theResult);
            addBox(theResult[0], theResult[1], theResult[2], theResult[3]);
            if (theResult[2] !== false) { // if a ship was just sunk
                checkGameOver();
            }
            if (theResult[1] == true) { // if a ship was just hit
                player.score += 10;
                updateScore();
            } else {    // players change turns
                if (currentPlayer == player1) {
                    currentPlayer = player2;
                } else if (currentPlayer == player2) {
                    currentPlayer = player1;
                }
                updateScore();
            }
        } else {
            return;
        }
    } // end of outer Check coordinates function

    function checkCoordinatessHelper(coordinates) {
        let shipHit = false;
        let shipSunk = false;
        let shipIndex = null;   // the index of the shhip 0-4
        let theWholeShip = null;    // full coordinates of the whole ship


        if (checkedPoints.length > 0) {
            for (let i = 0; i < checkedPoints.length; i++) {
                if (compareCoordinates(checkedPoints[i], coordinates)) {
                    alert("That field has already been checked");
                    return [false, null, false, -1];
                }
            }
        }

        checkedPoints.push(coordinates); // arrays with coordinates checked already
        for (var ship = 0; ship < ships.length; ship++) {
            for (let i = 0; i < ships[ship].length; i++) {
                let co = ships[ship][i];
                if (compareCoordinates(coordinates, co)) {
                    console.log("You hit a ship");

                    shipHit = true;
                    shipIndex = ship;
                    theWholeShip = ships[ship];

                    shipObjects[shipIndex].hit++;
                    if (shipObjects[shipIndex].hit == shipObjects[shipIndex].fields) {
                        shipSunk = true;
                    }

                }
            } // end of level 3 for loop
        }
        console.log(checkedPoints);

        if (!shipHit) { // ship not hit
            console.log("No ship hit");
            return [coordinates, false, false, -1]; // values returned by this function are analysed by the mother function (CheckCoordinates)
        } else {

            if (shipSunk == false) { // ship hit, not sunken
                console.log("Ship hit, not sunken");
                console.log(coordinates, true, false, shipIndex);
                return [coordinates, true, false, shipIndex];

            } else { // ship hit, returnship == false
                console.log("Ship sunken");
                return [coordinates, true, theWholeShip, shipIndex];
            }
        }

    } // end of helper function

    // ----- Three JS ----- 
    // Setup scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    const controls = new OrbitControls(camera, renderer.domElement);

    // More camera settings
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Add plane to body 
    $('#board').append(renderer.domElement);

    // Creating the plane 
    const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xFDB713, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = 1.571;

    // Visualize segments
    const gridHelper = new THREE.GridHelper(10, 10);
    const gridHelperII = new THREE.GridHelper(10, 10);
    const gridHelperIII = new THREE.GridHelper(10, 10);
    scene.add(plane);

    // Set grid rotations
    gridHelper.position.set(0, 0, 0);
    gridHelperII.position.set(-5, 5, 0);
    gridHelperIII.position.set(0, 5, -5);
    gridHelperIII.rotation.x = Math.PI / 2;
    gridHelperII.rotation.set(0, 0, 1.58);
    
    // Add grids to scene
    scene.add(gridHelper);
    scene.add(gridHelperII);
    scene.add(gridHelperIII);

    // Set camera positions
    camera.position.set(20, -40, 20); 
    controls.update();

    // Add axis details
    const fontLoader = new THREE.FontLoader();

    fontLoader.load('fonts/Altona Sans_Regular.json', function (font) {
        // Insert text for each square in axis
        for (let i = 1; i < 11; i++) {
            let text = i.toString();
            let textGeo = new THREE.TextGeometry(text, {
                font: font,
                size: 0.5,
                height: 0.1
            });
            let textMaterial = new THREE.MeshBasicMaterial({color: 0xFF7D02});

            // Insert Z axis
            let textMesh = new THREE.Mesh(textGeo, textMaterial);
            scene.add(textMesh);
            textMesh.position.set(-5, i - 1, 6);
            textMesh.rotation.y = 1.5;

            // Insert X axis
            let textMeshI = new THREE.Mesh(textGeo, textMaterial);
            scene.add(textMeshI);
            textMeshI.position.set(-5 + i, 0, 6);
            textMeshI.rotation.y = 1.5;
            textMeshI.rotateX(-1.6);

            // Insert Y axis
            let textMeshII = new THREE.Mesh(textGeo, textMaterial);
            scene.add(textMeshII);
            textMeshII.position.set(6, 0, 5.8 + (-1 * i));
            textMeshII.rotation.y = 1.5;
            textMeshII.rotateX(-1.6);
        }     
    });

    
    
    // Add box to plane
    function addBox(coordinates, hit, completed, shipIndex) {
        // Create the box and its lines
        let boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(boxGeo);
        const boxLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x5B1F0F}));
        
        const box = new THREE.Mesh(boxGeo);
        
        // Push box into array
        if (hit) {
            shipBoxes[shipIndex].push(box);
        } else {
            // If not part of ship, insert in generic boxes array
            otherBoxes.push(box);
            otherPoints.push(coordinates);
        }

        
        // Choose box colors depending on hit, miss, or completed        
        if (completed != false) {
            // If completed
            // Cycle through boxes and change all colors
            for (let x = 0; x < completed.length; x++) {
                shipBoxes[shipIndex][x].material.color.setHex('0xFF4E1F');
            }            
        } else if (hit == true) {
            // If hit
            box.material.color.setHex('0x22A113');
        } else {
            // If miss
            box.material.color.setHex('0x2692FF');
        }

        // Calculate position from parameter
        let x = -4.5 + (coordinates[0] - 1);  
        let y = 0.5 + (coordinates[2] - 1); // z -- because plane is rotated
        let z = 4.5 - (coordinates[1] - 1); // y -- because plane is rotated
        
        
        // Set box and lines position 
        box.position.set(x, y, z);
        boxLine.position.set(x, y, z);

        // Add the box and its line to the plane
        scene.add(box);
        scene.add(boxLine);
    }
    
    // Finish the game function
    $('#finish').click(function() {
        // Wait for ending the game before displaying game over
        endGame().then(checkGameOver);
    });

    async function endGame() {
        let time = 500;
        ships.forEach(ship => {
            ship.forEach(points => {
                let result = checkCoordinatessHelper(points);
                if (result != false) {
                    // Delay 500ms on each iteration for visualization purposes
                    setTimeout(function() {
                        addBox(result[0], result[1], result[2], result[3]);
                    }, time);
                    time += 500;
                }
            })
        }); 

        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(true);
            }, time);
        });
    }

    // Add game over details
    function addGameOverDetails() {
        // Add ship table 
        for (let x = 0; x < ships.length; x++) {
            for (let y = 0; y < ships[x].length; y++) {
                $('#shipGameOver').append('<tr>');
                $('#shipGameOver').children(y).append('<td> Ship' + (x + 1) + '</td>')
                $('#shipGameOver').children(y).append('<td> X' + ships[x][y][0] + ' Y' + ships[x][y][1] + ' Z' + ships[x][y][2] + '</td>');
            }
        }

        // Add points data
        for (let x = 0; x < otherPoints.length; x++) {
            $('#pointsGameOver').append('<tr>');
            $('#pointsGameOver').children(x).append('<td> Point' + (x + 1) + '</td>')
            $('#pointsGameOver').children(x).append('<td> X' + otherPoints[x][0] + ' Y' + otherPoints[x][1] + ' Z' + otherPoints[x][2] + '</td>');
        }

        $('#gameOver').css('display', 'block');
    }

    // Animate function
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    // Start animating
    animate();


}); // end document ready
