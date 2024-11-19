import React, { useState, useEffect } from 'react';
import { storage, db, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import './styles/ProfilePopup.css';

const ProfilePopup = ({ user, onClose }) => {
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState(user?.description || '');
  const [selectedIndustries, setSelectedIndustries] = useState(user?.industries || []);
  const [videoURL, setVideoURL] = useState(user?.video || '');

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Real Estate', 'Manufacturing', 'Media', 'Consulting', 'Other'
  ];

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);

    if (file) {
      setIsUploading(true);
      const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePic: photoURL });
      setIsUploading(false);
      onClose(); // Close popup after upload
    }
  };

  const handleIndustryToggle = (industry) => {
    setSelectedIndustries((prevIndustries) =>
      prevIndustries.includes(industry)
        ? prevIndustries.filter((i) => i !== industry)
        : [...prevIndustries, industry]
    );
  };

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'profiles', auth.currentUser.uid), {
      description,
      industries: selectedIndustries,
      video: videoURL,
    });
    onClose();
  };

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        
        <img
          src={user?.profilePic || 'default-profile.png'}
          alt="Profile"
          className="popup-profile-pic"
        />

        <label className="upload-button">
          {isUploading ? "Uploading..." : "Upload New Picture"}
          <input
            type="file"
            onChange={handleProfilePicChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </label>

        <div className="profile-details">
          <div className="profile-column">
            <h3>Interests & Description</h3>
            <textarea
              placeholder="Describe your interests"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h3>Industries</h3>
            <div className="industry-options">
              {industryOptions.map((industry) => (
                <div key={industry} className="industry-option">
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry)}
                    onChange={() => handleIndustryToggle(industry)}
                  />
                  <label>{industry}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-column">
            <h3>Elevator Pitch</h3>
            {videoURL ? (
              <video controls className="popup-elevator-pitch" src={videoURL}>
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No elevator pitch available.</p>
            )}
          </div>
        </div>

        <button className="save-button" onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
