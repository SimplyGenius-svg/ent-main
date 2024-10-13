import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import './styles/Dashboard.css';
import MentorHub from './MentorHub';
import InvestorHub from './InvestorHub';
import ConnectProfile from './ConnectProfile';
import ConnectSwipe from './ConnectSwipe';
import { FaHome, FaUserEdit, FaChalkboardTeacher, FaHandHoldingUsd, FaHandshake } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    expertise: '',
    profilePic: null,
    linkedIn: '',
    instagram: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [currentView, setCurrentView] = useState('home');
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

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    try {
      if (profilePicFile) {
        const storageRefInstance = storageRef(storage, `profilePictures/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRefInstance, profilePicFile);

        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, (error) => {
          console.error('Profile picture upload error:', error);
        }, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({ ...prevData, profilePic: downloadURL }));
        });
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, formData);
      setUser(formData);
      setIsEditProfileVisible(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={user?.profilePic || 'default-profile.png'}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfilePictureClick}
          />
        </div>
        <ul className="nav-links">
          <li onClick={() => setCurrentView('home')}><FaHome /> Home</li>
          <li onClick={() => setCurrentView('mentorHub')}><FaChalkboardTeacher /> Mentor Hub</li>
          <li onClick={() => setCurrentView('investorHub')}><FaHandHoldingUsd /> Investor Hub</li>
          <li onClick={() => setCurrentView('connect')}><FaHandshake /> Connect</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {isEditProfileVisible && (
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-button" onClick={() => setIsEditProfileVisible(false)}>&times;</button>
            </div>
            <div className="edit-profile-container">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              <label>College</label>
              <select name="college" value={formData.college} onChange={handleChange}>
                <option value="">Select College</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
              </select>
              <label>Expertise</label>
              <select name="expertise" value={formData.expertise} onChange={handleChange}>
                <option value="">Select Expertise</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Web Development">Web Development</option>
              </select>
              <label>LinkedIn URL</label>
              <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} />
              <label>Instagram Handle</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} />
              <label>Profile Picture</label>
              <input type="file" onChange={handleProfilePicChange} />
              <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>
        )}

        {currentView === 'home' && (
          <section className="dashboard-view">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Your random advice of the day: "Embrace the challenges!"</p>
            <div className="widget-container">
              <div className="widget">
                <h2>Recent Activity</h2>
                <p>Connected with a new investor</p>
                <p>Joined a mentorship program</p>
              </div>
              <div className="widget">
                <h2>Recommendations</h2>
                <p>Join the upcoming founder's event</p>
                <p>Apply for the seed funding opportunity</p>
              </div>
            </div>
          </section>
        )}

        {currentView === 'mentorHub' && <MentorHub />}
        {currentView === 'investorHub' && <InvestorHub />}
        {currentView === 'connect' && <ConnectProfile />}
      </div>
    </div>
  );
};

export default Dashboard;
