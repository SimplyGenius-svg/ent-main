import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './styles/wipeGuide.css'; // Add custom styles

const exampleProfiles = [
  { name: 'John Doe', industry: 'Tech', expertise: ['Web Development'], goals: 'Build an MVP' },
  { name: 'Jane Smith', industry: 'Healthcare', expertise: ['Marketing'], goals: 'Raise Funding' },
  { name: 'Alex Johnson', industry: 'Finance', expertise: ['Finance'], goals: 'Scaling' }
];

const SwipeGuide = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = () => {
    if (currentIndex < exampleProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(); // Finish swipe guide
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipe,
    onSwipedRight: handleSwipe,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="swipe-guide">
      <h2>Practice Swiping</h2>
      <p>Swipe left to reject or right to connect.</p>
      <div {...handlers} className="profile-card">
        <h3>{exampleProfiles[currentIndex].name}</h3>
        <p>Industry: {exampleProfiles[currentIndex].industry}</p>
        <p>Expertise: {exampleProfiles[currentIndex].expertise.join(', ')}</p>
        <p>Goals: {exampleProfiles[currentIndex].goals}</p>
      </div>
    </div>
  );
};

export default SwipeGuide;
