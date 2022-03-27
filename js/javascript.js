import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

$(document).ready(function() {
    
    // Game board
    let x = 10;
    let y = 10;
    let z = 7;
    let gameBoard = new Array(x).fill(new Array(y).fill(new Array(z)));
        
    // Ships points  
    let ships = [
        [[7, 7, 6], [7, 6, 6], [7, 5, 6], [6, 7, 6], [6, 6, 6], [6, 5, 6]],
        [[2, 1, 4], [3, 1, 4], [4, 1, 4]],
        [[9, 9, 1], [8, 9, 1], [7, 9, 1], [6, 9, 1], [5, 9, 1]],
        [[5, 3, 3], [5, 4, 3]],
        [[1, 9, 5], [1, 8, 5]]
    ];

    let boxes = [[]];

    // ----- Three JS ----- 
    // Setup scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    const controls = new OrbitControls(camera, renderer.domElement);

    // Test camera
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
    
    // gridHelper.rotation.set();
    scene.add(gridHelper);
    scene.add(gridHelperII);
    scene.add(gridHelperIII);

    // Set camera positions
    camera.position.set(20, -40, 20); // 0, -20, 40
    controls.update();

    // Add box to plane
    function addBox(coordinates) {
        // Create the box and its lines
        let boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(boxGeo);
        const boxLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x5B1F0F}));
        
        const box = new THREE.Mesh(boxGeo);
        
        // Push box into array 
        boxes[0].push(box);

        // Choose box colors depending on hit, miss, or completed
        let boxMaterial;
        console.log(coordinates);
        if (coordinates[4] == true) {
            // If completed

            // Test arr point and index -- REPLACE WITH FUNCTION
            let arrPoint = [[1, 1, 1], [1, 1, 2], [1, 1, 3]];
            let index = 0;
            
            // Cycle through boxes and change all colors
            console.log(arrPoint.length);
            for (let x = 0; x < arrPoint.length; x++) {
                boxes[index][x].material.color.setHex('0xFF4E1F');
            }            
        } else if (coordinates[3] == true) {
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

    // Creating a couple of test boxes by passing the coordinates (X, Y, Z) into the function
    // X, Y, Z, hit, completed
    addBox([1, 1, 1, true, false])
    addBox([1, 1, 2, true, false]);;
    addBox([1, 1, 3, true, true]);
    addBox([5, 5, 4, true, false]);
    addBox([10, 5, 1, false, false]);

    // Animate function
    function animate() {
        requestAnimationFrame(animate);

        controls.update();
        renderer.render(scene, camera);
    }

    // Start animating
    animate();


}); // end document ready
