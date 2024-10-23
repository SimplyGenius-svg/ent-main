// src/firebaseHelpers/levelHelpers.js

import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./actions/firebase";

// Increment the user's level when a quest is completed
export const levelUpUser = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {
    level: increment(1), // Increase level by 1
  });

  console.log("User leveled up.");
};
