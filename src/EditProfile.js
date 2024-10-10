import React, { useState } from "react";
import { auth, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import './styles/Dashboard.css'; // Assuming the new dashboard CSS

const EditProfile = ({ user }) => {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [instagram, setInstagram] = useState(user.instagram || "");

  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName,
        linkedin,
        instagram,
      });
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <label>Display Name</label>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <label>LinkedIn URL</label>
      <input
        type="text"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
      />
      <label>Instagram Handle</label>
      <input
        type="text"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />
      <button onClick={handleUpdateProfile}>Save Changes</button>
    </div>
  );
};

export default EditProfile;
