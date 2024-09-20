import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // For redirection
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase"; // Import Firebase authentication and database
import './Sign.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User created successfully, now redirect to the profile creation page
      navigate('/create-profile');
    } catch (err) {
      setError(err.message); // Show error on the UI if something goes wrong
      console.error("Error signing up:", err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
