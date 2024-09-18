import React from 'react';
import { Link } from 'react-router-dom';
import './authStyles.css'; // The new CSS file

const SignIn = () => {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2>Sign In</h2>
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" />
        <label>Password:</label>
        <input type="password" placeholder="Enter your password" />
        <button type="submit">Sign In</button>

        {/* Add a link to Sign Up */}
        <p className="auth-text">
          Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
