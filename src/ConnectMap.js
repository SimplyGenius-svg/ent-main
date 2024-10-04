import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './styles/ConnectMap.css';

const ConnectMap = () => {
  const mountRef = useRef(null);
  const [users, setUsers] = useState([]);

  // Manually assigned lat/lon values for each user
  const manuallyAssignedUsers = [
    { name: "gyan", lat: 37.7749, lon: -122.4194 }, // San Francisco, CA
    { name: "Final Test", lat: 51.5074, lon: -0.1278 }, // London, UK
    { name: "Gyan", lat: 40.7128, lon: -74.0060 }, // New York, NY
    { name: "Aarushi Thaker", lat: 19.0760, lon: 72.8777 }, // Mumbai, India
    { name: "Gyan Bhambhani", lat: 28.7041, lon: 77.1025 }, // Delhi, India
    { name: "aaru", lat: 35.6762, lon: 139.6503 }, // Tokyo, Japan
    { name: "Andrew Xiao", lat: -33.8688, lon: 151.2093 }, // Sydney, Australia
    { name: "Jason Voorhees", lat: 48.8566, lon: 2.3522 }, // Paris, France
    { name: "test", lat: -23.5505, lon: -46.6333 } // São Paulo, Brazil
  ];

  useEffect(() => {
    // Simulate fetching users by using the manually assigned user data
    setUsers(manuallyAssignedUsers);
  }, []);

  useEffect(() => {
    let scene, camera, renderer, globeMesh;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    // Initialize scene, camera, renderer
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.set(0, 0, 400);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Controls for globe interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableDamping = true;

    // Create the globe
    const globeGeometry = new THREE.SphereGeometry(150, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffdd,
      wireframe: true,
    });
    globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);

    // Helper function to convert lat/lon to 3D position on globe
    const latLonToVector3 = (lat, lon) => {
      const radius = 150; // Same as the radius of the globe
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Load a circular gradient texture
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('/path-to-gradient-circle.png'); // Ensure the path is correct

    // Add users as gradient circle sprites on the globe
    const userSprites = [];
    users.forEach((user) => {
      const { lat, lon, name } = user;

      const userPosition = latLonToVector3(lat, lon);
      console.log(`Rendering user: ${name}, position:`, userPosition);

      // Create a sprite with the gradient circle texture
      const spriteMaterial = new THREE.SpriteMaterial({ map: gradientTexture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(25, 25, 1); // Adjust size of circle
      sprite.position.copy(userPosition);

      // Add click event listener to show user name
      sprite.userData = { name };
      sprite.onClick = () => {
        alert(`User: ${name}`);
      };

      scene.add(sprite);
      userSprites.push(sprite); // Store sprites for interaction
    });

    // Handle clicking on sprites
    const handleUserClick = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(userSprites);

      if (intersects.length > 0) {
        const clickedUser = intersects[0].object;
        alert(`User: ${clickedUser.userData.name}`);
      }
    };

    // Add event listener for clicks
    renderer.domElement.addEventListener('click', handleUserClick);

    // Animation loop to rotate the globe
    const animate = () => {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.002;
      renderer.render(scene, camera);
      controls.update();
    };
    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current && renderer) {
        if (renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [users]); // Depend on users to re-render when user data is fetched

  return <div className="connect-map-container" ref={mountRef}></div>;
};

export default ConnectMap;
