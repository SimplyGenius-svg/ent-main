import React, { useState, useEffect } from 'react';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import './styles/ConnectSwipe.css';
import { FaHeart, FaTimes, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ConnectSwipe = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const profilesSnapshot = await getDocs(collection(db, 'users'));
        const profilesData = profilesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setProfiles(profilesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleSwipe = async (action) => {
    if (action === 'connect') {
      try {
        await addDoc(collection(db, 'connections'), {
          userId: auth.currentUser.uid,
          connectedTo: profiles[currentProfileIndex].id,
        });
        console.log('Connection saved');
      } catch (error) {
        console.error('Error saving connection:', error);
      }
    }
    setCurrentProfileIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <div className="connect-swipe-container">Loading profiles...</div>;
  }

  if (currentProfileIndex >= profiles.length) {
    return <div className="connect-swipe-container">No more profiles to show!</div>;
  }

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="connect-swipe-container">
      <div className="profile-card">
        <video src={currentProfile.profileVideo} controls className="profile-video" />
        <div className="profile-details">
          <h2>{currentProfile.name}</h2>
          <p>{currentProfile.elevatorPitch}</p>
          <p><strong>Location:</strong> {currentProfile.location || 'Not provided'}</p>
          <p><strong>Interests:</strong> {currentProfile.interests || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="swipe-button dislike" onClick={() => handleSwipe('dislike')}>
          <FaTimes /> Dislike
        </button>
        <button className="swipe-button like" onClick={() => handleSwipe('connect')}>
          <FaHeart /> Connect
        </button>
        <button className="swipe-button view-profile" onClick={() => navigate(`/profile/${currentProfile.id}`)}>
          <FaUser /> View Profile
        </button>
        <button className="swipe-button info" onClick={() => alert('More Info about this person')}>
          <FaInfoCircle /> More Info
        </button>
      </div>
    </div>
  );
};

export default ConnectSwipe;
