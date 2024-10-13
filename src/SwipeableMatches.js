import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable'; // Assuming this is the library you're using for swiping
import { getCurrentUserProfile, getAllUsers } from './getMatches'; // Fetching user profiles
import { calculateMatchScore } from './calculateMatchScore'; // Matching algorithm
import './styles/SwipeableMatches.css'; // Styles for this component

const SwipeableMatches = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUserProfile = await getCurrentUserProfile();
      const allUsers = await getAllUsers();

      if (currentUserProfile && allUsers) {
        const scoredMatches = allUsers.map((user) => ({
          ...user,
          score: calculateMatchScore(currentUserProfile, user),
        }));

        // Sort by highest score
        const sortedMatches = scoredMatches.sort((a, b) => b.score - a.score);
        setMatches(sortedMatches);
        setCurrentIndex(sortedMatches.length - 1);
      }
    };

    fetchMatches();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
  });

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      console.log('Connected with:', matches[currentIndex].id);
      // Add logic for right swipe (connect)
    } else {
      console.log('Passed:', matches[currentIndex].id);
    }
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="swipeable-matches-container">
      <h1>Find Your Match</h1>
      <div className="card-container" {...handlers}>
        {matches.length > 0 && currentIndex >= 0 ? (
          <div className="card">
            <h2>{matches[currentIndex].name}</h2>
            <p>Industry: {matches[currentIndex].industry}</p>
            <p>Expertise: {matches[currentIndex].expertise.join(', ')}</p>
            <p>Goals: {matches[currentIndex].goals}</p>
            <p>Business Stage: {matches[currentIndex].businessStage}</p>
            <p>Match Score: {matches[currentIndex].score}</p>
          </div>
        ) : (
          <p>No more matches or data unavailable.</p>
        )}
      </div>
    </div>
  );
};

export default SwipeableMatches;
