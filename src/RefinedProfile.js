import React, { useState } from 'react';
import './styles/RefinedProfile.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const RefinedProfile = () => {
  const [formData, setFormData] = useState({
    industry: '',
    businessStage: '',
    expertise: '',
    goals: '',
    skills: '',
    collaborationPreference: '',
    fundingNeeds: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [saveMessage, setSaveMessage] = useState(''); // For displaying the save confirmation message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, formData);
      setSaveMessage('Your profile has been successfully updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('An error occurred while saving your profile. Please try again.');
    }
  };

  return (
    <div className="refine-profile-container">
      <h1>Refine Your Profile</h1>
      <p className="step-indicator">Step {currentStep} of 4</p>

      {currentStep === 1 && (
        <div className="step">
          <h2>Industry & Stage</h2>
          <p>Please select your industry and current business stage to help us refine your matches.</p>
          <label>Industry</label>
          <select name="industry" value={formData.industry} onChange={handleChange}>
            <option value="">Select Industry</option>
            <option value="Tech">Tech</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Marketing">Marketing</option>
          </select>

          <label>Business Stage</label>
          <select name="businessStage" value={formData.businessStage} onChange={handleChange}>
            <option value="">Select Business Stage</option>
            <option value="Ideation">Ideation</option>
            <option value="Seed">Seed</option>
            <option value="Growth">Growth</option>
            <option value="Scaling">Scaling</option>
          </select>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step">
          <h2>Skills & Expertise</h2>
          <p>List your skills and areas of expertise to connect you with the right people.</p>
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="E.g. Leadership, Web Development, Marketing"
          />

          <label>Expertise</label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            placeholder="E.g. Product Management, Fundraising"
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="step">
          <h2>Goals & Collaboration Preferences</h2>
          <p>What are your business goals, and how do you prefer to collaborate?</p>
          <label>Goals</label>
          <input
            type="text"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="E.g. Raising capital, expanding product"
          />

          <label>Collaboration Preference</label>
          <select name="collaborationPreference" value={formData.collaborationPreference} onChange={handleChange}>
            <option value="">Select Collaboration Style</option>
            <option value="Remote">Remote</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      )}

      {currentStep === 4 && (
        <div className="step">
          <h2>Funding Needs</h2>
          <p>Do you require any funding, and if so, what are your specific needs?</p>
          <label>Funding Needs</label>
          <input
            type="text"
            name="fundingNeeds"
            value={formData.fundingNeeds}
            onChange={handleChange}
            placeholder="E.g. Looking for $500k seed investment"
          />
        </div>
      )}

      <div className="buttons">
        {currentStep > 1 && <button className="prev-button" onClick={prevStep}>Previous</button>}
        {currentStep < 4 && <button className="next-button" onClick={nextStep}>Next</button>}
        {currentStep === 4 && <button onClick={handleSaveChanges}>Save Changes</button>}
      </div>

      {/* Confirmation message after saving changes */}
      {saveMessage && <p className="save-message">{saveMessage}</p>}
    </div>
  );
};

export default RefinedProfile;
