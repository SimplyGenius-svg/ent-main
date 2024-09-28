import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


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
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Authentication
const storage = getStorage(app); // Storage for profile images

export { db, auth, storage };