import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

$(document).ready(function() {
    
    // Game board
    let x = 10;
    let y = 10;
    let z = 7;
    let gameBoard = new Array(x).fill(new Array(y).fill(new Array(z)));
        
    // Ships points  
    let shipI = [[7, 7, 6], [7, 6, 6], [7, 5, 6], [6, 7, 6], [6, 6, 6], [6, 5, 6]];
    let shipII = [[2, 1, 4], [3, 1, 4], [4, 1, 4]];
    let shipIII = [[9, 9, 1], [8, 9, 1], [7, 9, 1], [6, 9, 1], [5, 9, 1]];
    let shipIV = [[5, 3, 3], [5, 4, 3]];
    let shipV = [[1, 9, 5], [1, 8, 5]];

    // ----- Three JS ----- 
    // Setup scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    const controls = new OrbitControls(camera, renderer.domElement);

    // Add plane to body 
    $('body').append(renderer.domElement);

    // Creating the plane 
    const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: 0xFDB713, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);

    // Visualize segments
    const gridHelper = new THREE.GridHelper(10, 10);
    const gridHelperII = new THREE.GridHelper(10, 10);
    const gridHelperIII = new THREE.GridHelper(10, 10);
    scene.add(plane);

    // Set grid rotations
    gridHelper.position.set(0, 5, 5);
    gridHelperII.position.set(-5, 0, 5);
    gridHelperIII.rotation.x = Math.PI / 2;
    gridHelperII.rotation.set(0, 0, 1.58);
    
    // gridHelper.rotation.set();
    scene.add(gridHelper);
    scene.add(gridHelperII);
    scene.add(gridHelperIII);

    // Set camera positions
    camera.position.set(0, -20, 40);
    controls.update();

    function addBox(coordinates) {
        // Create the box and its lines
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(boxGeo);
        const boxLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x5B1F0F}));
        const boxMaterial = new THREE.MeshBasicMaterial({color: 0x2692FF});
        const box = new THREE.Mesh(boxGeo, boxMaterial);

        let x = -4.5 + (coordinates[0] - 1);
        let y = -4.5 + (coordinates[1] - 1);
        let z = 0.5 + (coordinates[2] - 1);
        // Set box and lines position 
        box.position.set(x, y, z);
        boxLine.position.set(x, y, z);

        // Add the box and its line to the plane
        scene.add(box);
        scene.add(boxLine);
    }

    // Creating a couple of test boxes by passing the coordinates (X, Y, Z) into the function
    addBox([1, 1, 1]);
    addBox([9, 4, 5]);
    addBox([3, 7, 9]);
    addBox([4, 7, 9]);
    addBox([1, 1, 2]);
    

    // Animate function
    function animate() {
        requestAnimationFrame(animate);

        controls.update();
        
        renderer.render(scene, camera);
      
    }

    // Start animating
    animate();


}); // end document ready
