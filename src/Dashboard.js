import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import './Dashboard.css';
import EditProfile from './EditProfile'; // Import the profile edit component

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false); // For controlling modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = db.collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('User data not found');
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleProfileClick = () => {
    setShowEditProfile(true);
  };

  const closeProfileModal = () => {
    setShowEditProfile(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li>Home</li>
          <li>Connections</li>
          <li>Mentors</li>
          <li>Investors</li>
          <li>Messages</li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <div className="welcome-section">
          {userData && (
            <>
              <h1>Welcome, {userData.name}!</h1>
              <p>You're from the {userData.college} college.</p>
            </>
          )}
        </div>

        <div className="profile-section">
          <button className="profile-button" onClick={handleProfileClick}>
            Profile
          </button>
        </div>

        <div className="dashboard-content">
          <h2>Your Dashboard</h2>
          <p>Explore features, connect with others, and more.</p>

          {/* In-App Tokens */}
          <div className="tokens-section">
            <h3>Your In-App Tokens</h3>
            <p>{userData ? userData.tokens : 0} tokens available</p>
            <button className="store-button" onClick={() => navigate('/store')}>
              Go to Store
            </button>
          </div>

          {/* Connections, Profile Visits, Impressions */}
          <div className="stats-section">
            <h3>Your Stats</h3>
            <p>Connections: {userData ? userData.connections : 0}</p>
            <p>Profile Visits: {userData ? userData.profileVisits : 0}</p>
            <p>Impressions: {userData ? userData.impressions : 0}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeProfileModal}>
              &times;
            </span>
            <EditProfile userData={userData} closeProfileModal={closeProfileModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

