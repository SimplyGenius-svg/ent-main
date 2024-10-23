import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./actions/firebase";

export const checkProfileCompletion = async () => {
  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    // Check if the required fields are filled in
    return !!(
      userData.industry &&
      userData.expertise.length > 0 &&
      userData.goals &&
      userData.businessStage
    );
  }
  return false;
};
