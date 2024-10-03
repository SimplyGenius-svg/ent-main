import React from 'react';
import { Link } from 'react-router-dom';
import './styles/styles.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="header">
        <a href="/" className="logo-text">Entrelink</a>
        <nav className="navbar">
          <a href="#about">About Us</a>
          <a href="#careers">Careers</a>
          <a href="#features">Features</a>
        </nav>
        <div className="buttons">
          <Link to="/signup">
            <button className="cta-button">Get Started</button>
          </Link>
          <Link to="/signin">
            <button className="cta-button-outline">Log In</button>
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>Entrepreneurs, connect and grow!</h1>
          <p>Your platform to meet investors, collaborators, and mentors in one click.</p>
          <div className="hero-buttons">
            <Link to="/signup">
              <button className="cta-button">Join Now</button>
            </Link>
            <Link to="/learn-more">
              <button className="cta-button-outline">Learn More</button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-item glass-card">
              <h3>Tinder-Style Matchmaking</h3>
              <p>Swipe to connect with like-minded entrepreneurs.</p>
            </div>
            <div className="feature-item glass-card">
              <h3>Real-Time Chats</h3>
              <p>Stay connected and collaborate in real-time.</p>
            </div>
            <div className="feature-item glass-card">
              <h3>Video Pitches</h3>
              <p>Pitch your startup and attract attention from investors.</p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="about-section">
          <h2>About Us</h2>
          <p>We’re redefining how entrepreneurs connect. From innovative matchmaking to real-time collaboration, Entrelink provides the tools and network to make your vision a reality.</p>
        </section>

        {/* Careers Section */}
        <section id="careers" className="careers-section">
          <h2>Careers</h2>
          <p>Passionate about tech and entrepreneurship? Join us!</p>
          <a href="https://gyanb.notion.site/Entrelink-Careers-40c96e2d9b8345dda94b55c713f18344?pvs=4" className="cta-link">Explore Careers</a>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Entrelink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
