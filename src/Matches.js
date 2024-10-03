import React, { useState, useEffect } from 'react';
import { getAllUsers } from './firebaseHelpers'; // Import function for fetching users
import './Matches.css';

const Matches = () => {
  const [profiles, setProfiles] = useState([]); // Initialize profiles as an empty array
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      const allProfiles = await getAllUsers();
      console.log('Fetched profiles:', allProfiles); // Add this to log the fetched profiles
      setProfiles(allProfiles);
    };
  
    fetchProfiles();
  }, []);
  

  const handleSwipe = (direction, profile) => {
    if (direction === 'Right') {
      // Handle right swipe
      console.log(`You swiped right on ${profile.name}`);
    } else {
      // Handle left swipe
      console.log(`You swiped left on ${profile.name}`);
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="matches-container">
      <h1>Swipe Through Profiles</h1>
      {profiles && profiles.length > 0 && currentIndex < profiles.length ? (
        <div className="profile-card">
          {/* Render current profile */}
          <h2>{profiles[currentIndex].name}</h2>
          <p>{profiles[currentIndex].description}</p>
          {/* Add swipe functionality */}
          <button onClick={() => handleSwipe('Left', profiles[currentIndex])}>Swipe Left</button>
          <button onClick={() => handleSwipe('Right', profiles[currentIndex])}>Swipe Right</button>
        </div>
      ) : (
        <p>No more profiles available.</p>
      )}
    </div>
  );
};

export default Matches;
