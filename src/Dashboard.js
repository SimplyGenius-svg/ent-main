import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import './styles/Dashboard.css';
import TinderCreation from './TinderCreation';
import FounderResources from './FounderResources';
import NotificationsCenter from './NotificationsCenter';
import Connect from './Connect';
import ProfilePopup from './ProfilePopup';
import { FaHome, FaTools, FaBell, FaHandshake, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      const profileDocRef = doc(db, 'profiles', auth.currentUser.uid);
      const profileSnapshot = await getDoc(profileDocRef);

      if (userSnapshot.exists() && profileSnapshot.exists()) {
        const userData = {
          ...userSnapshot.data(),
          ...profileSnapshot.data(),
        };
        setUser(userData);
        setIsProfileComplete(true);
        setCurrentView('connect');
      } else {
        setIsProfileComplete(false);
        setCurrentView('tinderCreation');
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container" onClick={() => setShowPopup(true)} style={{ cursor: 'pointer' }}>
          <img src={user?.profilePic || 'default-profile.png'} alt="Profile" className="profile-pic" />
          <h2>{user?.name}</h2>
        </div>
        <ul className="nav-links">
          <li onClick={() => setCurrentView('home')}>
            <FaHome /> Home
          </li>
          <li onClick={() => setCurrentView('resources')}>
            <FaTools /> Founder Resources
          </li>
          <li onClick={() => setCurrentView('notifications')}>
            <FaBell /> Notifications
          </li>
          {!isProfileComplete && (
            <li onClick={() => setCurrentView('tinderCreation')}>
              <FaUserPlus /> Create Profile
            </li>
          )}
          <li onClick={() => setCurrentView('connect')}>
            <FaHandshake /> Connect
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showPopup && <ProfilePopup user={user} onClose={() => setShowPopup(false)} />}
        {currentView === 'tinderCreation' && <TinderCreation onComplete={() => setCurrentView('connect')} />}
        {currentView === 'connect' && <Connect />}
        {currentView === 'home' && <FounderResources />}
        {currentView === 'resources' && <FounderResources />}
        {currentView === 'notifications' && <NotificationsCenter />}
      </div>
    </div>
  );
};

export default Dashboard;
