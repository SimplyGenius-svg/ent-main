import React, { useState } from 'react';
import './EditProfile.css'; // Create a new CSS file for the modal

const EditProfile = ({ userData, closeProfileModal }) => {
  const [name, setName] = useState(userData?.name || '');
  const [college, setCollege] = useState(userData?.college || '');
  const [role, setRole] = useState(userData?.role || '');

  const handleSave = () => {
    // Save logic for profile
    console.log('Profile saved');
    closeProfileModal();
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>College:</label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
