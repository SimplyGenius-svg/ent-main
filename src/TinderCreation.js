import React, { useState } from 'react';
import { db, storage, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import './styles/TinderCreation.css';

const TinderCreation = ({ onComplete }) => {
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const industryOptions = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Real Estate', 'Manufacturing', 'Media', 'Consulting', 'Other'
  ];

  const handleVideoUpload = async () => {
    if (!video) return null;
    const videoRef = ref(storage, `elevatorPitches/${auth.currentUser.uid}`);
    await uploadBytes(videoRef, video);
    return getDownloadURL(videoRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const videoURL = await handleVideoUpload();

      const userProfile = {
        uid: auth.currentUser.uid,
        description,
        industries: selectedIndustries,
        video: videoURL,
      };

      await setDoc(doc(db, 'profiles', auth.currentUser.uid), userProfile);

      // Trigger animation and then call onComplete callback to redirect to Connect
      setAnimationTrigger(true);
      setTimeout(onComplete, 1500);
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIndustry = (industry) => {
    setSelectedIndustries((prevIndustries) =>
      prevIndustries.includes(industry)
        ? prevIndustries.filter((i) => i !== industry)
        : [...prevIndustries, industry]
    );
  };

  return (
    <div className={`tinder-creation-container ${animationTrigger ? 'animate-fold-up' : ''}`}>
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Description</label>
        <textarea
          placeholder="A short bio about yourself"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Elevator Pitch (Video)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />

        <label>Industries You Want to Connect With</label>
        <div className="industry-options">
          {industryOptions.map((industry) => (
            <div key={industry} className="industry-option">
              <input
                type="checkbox"
                id={industry}
                checked={selectedIndustries.includes(industry)}
                onChange={() => toggleIndustry(industry)}
              />
              <label htmlFor={industry}>{industry}</label>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Profile..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TinderCreation;
