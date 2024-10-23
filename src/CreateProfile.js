import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/authStyles.css";
import { db } from "./actions/firebase";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { auth } from "./actions/firebase";

const interestOptions = [
  { label: "Animals", emoji: "🐾" },
  { label: "Music", emoji: "🎶" },
  { label: "Sports", emoji: "⚽" },
  { label: "Outdoor activities", emoji: "🥾" },
  { label: "Dancing", emoji: "💃" },
  { label: "Healthy life", emoji: "🥗" },
  { label: "Gym & Fitness", emoji: "🏋️" },
  { label: "Foreign culture", emoji: "🌍" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Art", emoji: "🎨" },
  { label: "Writing", emoji: "✍️" },
  { label: "Ceramics", emoji: "🏺" },
  { label: "Cosmos", emoji: "🌌" },
  { label: "Architecture", emoji: "🏛️" },
  { label: "Food", emoji: "🍽️" },
  { label: "Planting", emoji: "🌱" },
  { label: "Movie", emoji: "🎬" },
  { label: "Science", emoji: "🔬" },
  { label: "Camping", emoji: "🏕️" },
  { label: "History", emoji: "🏺" },
  { label: "Design", emoji: "📐" },
  { label: "Photography", emoji: "📷" },
  { label: "Spirituality", emoji: "🔮" },
  { label: "Yoga", emoji: "🧘" },
  { label: "Book", emoji: "📚" },
  { label: "Cooking", emoji: "🍳" },
  // Add more interests here
];

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !college || selectedInterests.length === 0 || !role) {
      setError("All fields are required!");
      return;
    }

    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        // Create or update the document with the user's UID in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          college,
          interests: selectedInterests,
          role,
        });

        console.log("Profile created successfully!");
        setError("");
        navigate("/dashboard"); // Redirect to the dashboard after profile creation
      } else {
        setError("No authenticated user");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Error creating profile: " + error.message);
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
              <option value="Chemistry">Chemistry</option>
              <option value="Computing, Data Science & Society">
                Computing, Data Science & Society
              </option>
              <option value="Education">Education</option>
              <option value="Environmental Design">Environmental Design</option>
              <option value="Information">Information</option>
              <option value="Journalism">Journalism</option>
              <option value="Law">Law</option>
              <option value="Letters & Science">Letters & Science</option>
              <option value="Natural Resources">Natural Resources</option>
              <option value="Optometry">Optometry</option>
              <option value="Public Health">Public Health</option>
              <option value="Public Policy">Public Policy</option>
              <option value="Social Welfare">Social Welfare</option>
              {/* Add more college options */}
            </select>
          </div>

          <div className="interests-container">
            <h3>Select your interests:</h3>
            <div className="interest-grid">
              {interestOptions.map((interest, index) => (
                <div
                  key={index}
                  className={`interest-item ${
                    selectedInterests.includes(interest.label) ? "selected" : ""
                  }`}
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

          <button type="submit" className="submit-button">
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
