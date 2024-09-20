import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authStyles.css';
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { auth } from './firebase'


const interestOptions = [
  { label: 'Animals', emoji: '🐾' },
  { label: 'Music', emoji: '🎶' },
  // Add more interests here
];

const CreateProfile = () => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name || !college || selectedInterests.length === 0 || !role) {
    setError('All fields are required!');
    return;
  }

  try {
    const user = auth.currentUser; // Get the current authenticated user
    if (user) {
      // Create or update the document with the user's UID in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        college,
        interests: selectedInterests,
        role,
      });

      console.log('Profile created successfully!');
      setError('');
      navigate('/dashboard'); // Redirect to the dashboard after profile creation
    } else {
      setError('No authenticated user');
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    setError('Error creating profile: ' + error.message);
  }
};


  const handleInterestChange = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box create-profile-box">
        <h2>Create Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">Select College:</label>
            <select
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            >
              <option value="">-- Select College --</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
              {/* Add more college options */}
            </select>
          </div>

          <div className="interests-container">
            <h3>Select your interests:</h3>
            <div className="interest-grid">
              {interestOptions.map((interest, index) => (
                <div
                  key={index}
                  className={`interest-item ${selectedInterests.includes(interest.label) ? 'selected' : ''}`}
                  onClick={() => handleInterestChange(interest.label)}
                >
                  {interest.emoji} {interest.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">What best describes you?</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="Founder">Founder</option>
              <option value="Mentor">Mentor</option>
              <option value="Enthusiast">Enthusiast</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
