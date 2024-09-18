// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // This is needed for authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQA26SuEcpIAOExnqCjFlo6Yl6lWEF71c",
  authDomain: "entrelink-v2.firebaseapp.com",
  projectId: "entrelink-v2",
  storageBucket: "entrelink-v2.appspot.com",
  messagingSenderId: "481200191894",
  appId: "1:481200191894:web:5aca7d9c7002ae0b4e45b7",
  measurementId: "G-HL29HP02ED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Ensure you're using this in your auth logic

export { auth };
