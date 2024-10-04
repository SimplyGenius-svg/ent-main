import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import InvestorHub from './InvestorHub';
import MentorHub from './MentorHub';
import ConnectMap from './ConnectMap';  // Import the ConnectMap component
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    expertise: '',
    profilePic: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

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

  const handleNavClick = (view) => {
    setCurrentView(view);  // Switch between dashboard, mentor hub, investor hub, etc.
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSaveProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

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
          }
        );
      } else {
        await updateDoc(userDocRef, formData);
        setUser(formData);
        setIsEditProfileVisible(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={user?.profilePic || 'default-profile.png'}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfilePictureClick}
          />
          <h3>{user?.name}</h3>
          <p>{user?.college} | Expertise: {user?.expertise}</p>
        </div>
        <ul>
          <li><a onClick={() => handleNavClick('dashboard')}>Dashboard</a></li>
          <li><a onClick={() => handleNavClick('mentorHub')}>Mentor Hub</a></li>
          <li><a onClick={() => handleNavClick('investorHub')}>Investor Hub</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'dashboard' && (
          <section className="dashboard-view">
            <h1>Your Dashboard</h1>
            {/* Add the ConnectMap here */}
            <div className="map-container">
              <ConnectMap />
            </div>
          </section>
        )}

        {currentView === 'mentorHub' && <MentorHub />}
        {currentView === 'investorHub' && <InvestorHub />}

        {isEditProfileVisible && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content non-intrusive-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Profile</h2>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label>College:</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleInputChange}
              >
                <option value="">Select College</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
                <option value="Law">Law</option>
                <option value="Medicine">Medicine</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Education">Education</option>
              </select>
              <label>Expertise:</label>
              <select
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
              >
                <option value="">Select Expertise</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Law">Law</option>
                <option value="Consulting">Consulting</option>
                <option value="Sales">Sales</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
              </select>
              <label>Profile Picture:</label>
              <input type="file" onChange={handleFileChange} />
              {uploadProgress > 0 && <progress value={uploadProgress} max="100">{uploadProgress}%</progress>}
              <button onClick={handleSaveProfile} className="save-button">
                Save Changes
              </button>
              <button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
