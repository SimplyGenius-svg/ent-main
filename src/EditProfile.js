import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import './styles/EditProfile.css';

const EditProfile = ({ user, onClose }) => {
  const [displayName, setDisplayName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setLinkedin(user.linkedin || "");
      setInstagram(user.instagram || "");
    }
  }, [user]);

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
    <div className="edit-profile-modal-overlay" onClick={onClose}>
      <div className="edit-profile-modal slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="edit-profile-container">
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Instagram Handle</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handleUpdateProfile}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;