import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from './firebase'; // Import your Firebase setup

// Function to fetch all user profiles from Firestore
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users'); // Fetch the 'users' collection
    const usersSnapshot = await getDocs(usersCollection); // Get all the documents in the 'users' collection

    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // All other user data
    }));

    console.log('Fetched users:', usersList);

    return usersList; // Return array of user profiles
  } catch (error) {
    console.error("Error fetching users: ", error);
    return []; // Return an empty array on error
  }
};

// Function to send a connection request to another user
export const sendConnectionRequest = async (receiverId) => {
  try {
    const currentUserId = auth.currentUser.uid; // Get the current user's ID
    const receiverDocRef = doc(db, 'users', receiverId); // Reference to the receiver's document

    // Update the receiver's document to add the current user's ID to their received connection requests
    await updateDoc(receiverDocRef, {
      receivedConnections: arrayUnion(currentUserId), // Adds the current user's ID to the array
    });

    console.log('Connection request sent to:', receiverId);
  } catch (error) {
    console.error('Error sending connection request:', error);
  }
};
