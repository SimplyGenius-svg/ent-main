import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

// Fetch current user's profile
export const getCurrentUserProfile = async () => {
  const currentUser = auth.currentUser;
  const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    console.error('No user profile found');
    return null;
  }
};

// Fetch all users except the current one
export const getAllUsers = async () => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const currentUser = auth.currentUser.uid;
  
    const users = snapshot.docs
      .filter((doc) => doc.id !== currentUser) // Exclude current user
      .map((doc) => ({ id: doc.id, ...doc.data() }));
  
    console.log('All users fetched from Firebase:', users); // Log all users
    return users;
  };
  