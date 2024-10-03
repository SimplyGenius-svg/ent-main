import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeableCard = ({ profile, onSwipe }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe('Left'),
    onSwipedRight: () => onSwipe('Right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // This allows swiping with a mouse for testing
  });

  return (
    <div {...handlers} className="profile-card">
      <h3>{profile.name}</h3>
      <p>Industry: {profile.industry}</p>
      <p>Expertise: {Array.isArray(profile.expertise) ? profile.expertise.join(', ') : 'No expertise listed'}</p>
      <p>Goals: {profile.goals}</p>
    </div>
  );
};

export default SwipeableCard;
