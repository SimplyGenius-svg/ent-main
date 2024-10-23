import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods
import { db } from "."./actions/firebase""; // Import your firebase configuration
import "./styles/ConnectMap.css";

const ConnectMap = () => {
  const mountRef = useRef(null);
  const [users, setUsers] = useState([]);

  // Fetch user data from Firestore and assign random lat/lon values
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users"); // Assume 'users' is your Firestore collection
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          // Assign random lat/lon for each user
          const randomLat = Math.random() * 180 - 90; // Random latitude between -90 and 90
          const randomLon = Math.random() * 360 - 180; // Random longitude between -180 and 180
          return { ...userData, lat: randomLat, lon: randomLon }; // Add random lat/lon
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let scene, camera, renderer, globeMesh;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    // Initialize scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Initialize camera
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.set(0, 0, 400);

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Globe geometry
    const globeGeometry = new THREE.SphereGeometry(150, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0080ff,
      wireframe: true,
    });
    globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
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

    // Load gradient texture
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(
      "/path-to-gradient-placeholder.png"
    ); // Placeholder gradient image

    // Add user markers to the globe with random lat/lon
    users.forEach((user) => {
      const { lat, lon, name } = user; // lat and lon now randomly assigned

      const userPosition = latLonToVector3(lat, lon);

      // Create a sprite with the gradient texture
      const spriteMaterial = new THREE.SpriteMaterial({ map: gradientTexture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 20, 1); // Adjust size of the gradient circle
      sprite.position.copy(userPosition);

      // Add click event listener to show user name
      sprite.userData = { name };
      sprite.onClick = () => {
        alert(`User: ${name}`);
      };

      scene.add(sprite);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.001; // Slowly rotate the globe
      renderer.render(scene, camera);
      controls.update();
    };
    animate();

    // Clean up on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [users]); // Depend on users to re-render when user data is fetched

  return (
    <div
      className="connect-map-container"
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default ConnectMap;
