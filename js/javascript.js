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
    

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    const controls = new OrbitControls(camera, renderer.domElement);

    // Add plane to body 
    $('body').append(renderer.domElement);

    // Adding plane to the scene 
    const geometry = new THREE.PlaneGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0xFDB713});
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 5;
    camera.position.set(0, 0, 5);
    controls.update();

    // Animate function
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
        console.log(camera.position);
        // Rotation
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
    }

    // Start animating
    animate();


}); // end document ready
