import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./actions/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./styles/EditProfile.css";

const EditProfile = ({ user, onClose, onProfileUpdate }) => {
  const [displayName, setDisplayName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [expertise, setExpertise] = useState("");
  const [role, setRole] = useState("");
  const [major, setMajor] = useState(""); // Added Major field
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setLinkedin(user.linkedin || "");
      setInstagram(user.instagram || "");
      setExpertise(user.expertise || "");
      setRole(user.role || "");
      setMajor(user.major || ""); // Initialize Major
      setProfilePicUrl(user.profilePic || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName,
        linkedin,
        instagram,
        expertise,
        role,
        major, // Save Major to Firestore
        profilePic: profilePicUrl,
      });

      const updatedUser = {
        displayName,
        linkedin,
        instagram,
        expertise,
        role,
        major, // Include Major in updated profile
        profilePic: profilePicUrl,
      };
      onProfileUpdate(updatedUser); // Call the callback with updated user data
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleUploadProfilePic = () => {
    if (!profilePic) return;
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, profilePic);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading profile picture:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfilePicUrl(downloadURL);
          alert("Profile picture updated successfully");
        });
      }
    );
  };

  return (
    <div className="edit-profile-modal-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            X
          </button>
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
          <div className="form-group">
            <label>Expertise</label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="Investor">Investor</option>
              <option value="Advisor">Advisor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Major</label> {/* Major field added */}
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" onChange={handleProfilePicChange} />
            <button onClick={handleUploadProfilePic} className="upload-button">
              Upload Picture
            </button>
          </div>
          {profilePicUrl && (
            <div className="profile-pic-preview">
              <img src={profilePicUrl} alt="Profile Preview" />
            </div>
          )}
          <button className="save-button" onClick={handleUpdateProfile}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
