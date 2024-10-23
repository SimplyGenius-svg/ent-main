import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./actions/firebase"; // Firebase setup
import "./styles/BuildProfile.css"; // Import any custom styles

const BuildProfile = () => {
  const [formData, setFormData] = useState({
    industry: "",
    expertise: [],
    goals: "",
    businessStage: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfProfileExists = async () => {
      if (!auth.currentUser) {
        navigate("/signin");
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          // If profile exists, set userExists to true and navigate to the matches page
          setUserExists(true);
          navigate("/matches"); // Redirect to matches directly if profile exists
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    checkIfProfileExists();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setFormData({ ...formData, expertise: selected });
  };

  const handleSaveProfile = async () => {
    // Add basic validation
    if (
      !formData.industry ||
      formData.expertise.length === 0 ||
      !formData.goals ||
      !formData.businessStage
    ) {
      alert("Please fill in all fields before saving your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      await setDoc(userDocRef, formData, { merge: true });
      console.log("Profile saved successfully!");
      setIsSaving(false);

      // Once the profile is saved, redirect to the matches page
      navigate("/matches");
    } catch (error) {
      console.error("Error saving profile: ", error);
      setIsSaving(false);
    }
  };

  if (userExists) {
    return null; // Early return if user already has a profile
  }

  return (
    <div className="build-profile-container">
      <h1>Build Your Profile</h1>
      <form className="build-profile-form">
        <label>
          Industry:
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Expertise (Select multiple):
          <select
            name="expertise"
            multiple
            value={formData.expertise}
            onChange={handleSelectChange}
            required
          >
            <option value="Web Development">Web Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Product Management">Product Management</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Goals:
          <input
            type="text"
            name="goals"
            value={formData.goals}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Business Stage:
          <input
            type="text"
            name="businessStage"
            value={formData.businessStage}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="button" onClick={handleSaveProfile} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default BuildProfile;
