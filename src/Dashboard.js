import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    expertise: '',
    profilePic: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  // Apply theme on component mount
  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  // Define the toggleTheme function to switch between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const profilePicUrl = await getDownloadURL(storageRef(storage, `profilePictures/${auth.currentUser.uid}`));
          setUser({ ...userData, profilePic: profilePicUrl });
          setFormData({ ...userData, profilePic: profilePicUrl });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfilePictureClick = () => {
    setIsEditProfileVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditProfileVisible(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  // Save profile changes to Firestore and Firebase Storage
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Upload profile picture if changed
      if (formData.profilePic && typeof formData.profilePic !== 'string') {
        const imageRef = storageRef(storage, `profilePictures/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(imageRef, formData.profilePic);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error uploading image:', error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(userDocRef, { ...formData, profilePic: downloadURL });
            setUser({ ...formData, profilePic: downloadURL });
            setIsEditProfileVisible(false);
            setIsSaving(false);
          }
        );
      } else {
        await updateDoc(userDocRef, formData);
        setUser(formData);
        setIsEditProfileVisible(false);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={user?.profilePic || 'default-profile.png'}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfilePictureClick}
          />
        </div>
        <ul>
          <li>Home</li>
          <li>Connections</li>
          <li>Mentors</li>
          <li>Investors</li>
          <li>Messages</li>
        </ul>
      </div>
      <div className="main-content">
        <h1>Welcome, {user?.name}!</h1>
        <p>College: {user?.college}</p>
        <p>Expertise: {user?.expertise}</p>
      </div>

      {/* Dark/Light Mode Toggle */}
      <div className="toggle-container" onClick={toggleTheme}>
        <span className="toggle-label">Dark Mode</span>
        <div className="toggle-switch">
          <div className="switch-ball"></div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileVisible && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              College:
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Expertise:
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Profile Picture:
              <input type="file" onChange={handleFileChange} />
            </label>
            {uploadProgress > 0 && (
              <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
            )}
            <button onClick={handleCloseModal} className="close-btn">Close</button>
            <button onClick={handleSaveProfile} className="edit-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
