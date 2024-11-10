import React, { useState } from "react";
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "./firebase";
import './styles/authStyles.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      // Set persistence to remember session
      await setPersistence(auth, browserLocalPersistence);

      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to dashboard after successful sign-in
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error("Error signing in:", err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignIn}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don’t have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
