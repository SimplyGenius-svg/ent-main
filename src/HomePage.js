import React from 'react';
import './styles/styles.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">EntreLink</div>
        <nav className="navbar">
          <a href="#about" className="nav-item">About Us</a>
          <a href="#features" className="nav-item">Features</a>
          <a href="#careers" className="nav-item">Careers</a>
        </nav>
        <div className="cta-buttons">
          <a href="/signup" className="btn primary">Get Started</a>
          <a href="/signin" className="btn secondary">Log In</a>
        </div>
      </header>

      <section className="hero-section">
        <h1 className="headline">Build Connections, Drive Growth</h1>
        <p className="subtext">Connecting entrepreneurs, investors, and collaborators for a better tomorrow.</p>
        <div className="hero-cta">
          <a href="/signup" className="btn primary">Join Us</a>
          <a href="/learn-more" className="btn secondary">Learn More</a>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title">Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Networking Simplified</h3>
            <p>Match with mentors, collaborators, and investors effortlessly.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Chats</h3>
            <p>Communicate instantly and keep your projects moving forward.</p>
          </div>
          <div className="feature-card">
            <h3>Pitch in Seconds</h3>
            <p>Upload quick video pitches to attract the right audience.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2 className="section-title">About Us</h2>
        <p className="about-text">EntreLink is redefining entrepreneurship by making it easier to connect, collaborate, and succeed. From investor matchmaking to real-time collaboration tools, we are empowering tomorrow’s leaders.</p>
      </section>

      <section id="careers" className="careers-section">
        <h2 className="section-title">Join Our Team</h2>
        <p className="careers-text">Passionate about entrepreneurship and tech? We’re looking for forward-thinking individuals to help shape the future.</p>
        <a href="https://gyanb.notion.site/Entrelink-Careers-40c96e2d9b8345dda94b55c713f18344?pvs=4" className="btn primary">Explore Careers</a>
      </section>

      <footer className="footer">
        <p>&copy; 2024 EntreLink. Building the future of connections.</p>
      </footer>
    </div>
  );
};

export default HomePage;
