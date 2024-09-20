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
      {/* Welcome Message */}
      <div className="welcome-section">
        {userData && (
          <>
            <h1>Welcome, {userData.name}!</h1>
            <p>You're from the {userData.college} college.</p>
          </>
        )}
      </div>

      {/* Profile Button in Top-Right */}
      <div className="profile-section">
        <button className="profile-button" onClick={handleProfileClick}>
          Profile
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <h2>Your Dashboard</h2>
        <p>Here you can explore features, connect with others, and more.</p>
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
