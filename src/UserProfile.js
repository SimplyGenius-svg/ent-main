// src/UserProfile.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./actions/firebase";
import "./styles/UserProfile.css"; // Create this CSS file for styling

const UserProfile = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!userData) {
    return <div>User not found.</div>;
  }

  return (
    <div className="user-profile-container">
      <img
        src={userData.profilePic || "default-profile.png"}
        alt="Profile"
        className="profile-pic"
      />
      <h1>{userData.displayName}</h1>
      <p>Major: {userData.major || "Not provided"}</p>
      {/* Add more user details here as needed */}
    </div>
  );
};

export default UserProfile;
