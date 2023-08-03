// Wait for the document to load
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Set up Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Append the renderer to the animation container div
    const animationContainer = document.getElementById('animation-container');
    animationContainer.appendChild(renderer.domElement);

    // Create cubes and add them to the scene
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubes = [];
    for (let i = 0; i < 100; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100);
        cubes.push(cube);
        scene.add(cube);
    }

    // Set up the camera position
    camera.position.z = 5;

    // Create an animation loop
    function animate() {
        requestAnimationFrame(animate);
        // Rotate the cubes
        cubes.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });
        renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
}
