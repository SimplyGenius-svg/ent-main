import React from 'react';
import './styles/styles.css';

import gyanImg from './gyan2.jpg';
import andrewImg from './andrew.png';
import aaruImg from './aaru.jpg';

const HomePage = () => {
  const scrollToTeamSection = () => {
    document.getElementById('our-team').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">EntreLink</div>
        <nav className="navbar">
          <a href="#about" className="nav-item">About Us</a>
          <a href="#features" className="nav-item">Features</a>
          <a href="#careers" className="nav-item">Careers</a>
          <a onClick={scrollToTeamSection} className="nav-item underline">Our Team</a> {/* Always underlined */}
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
          <a href="#our-team" className="btn secondary">Learn More</a>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title"><span className="icon">⚙️</span> Our Features</h2>
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
        <h2 className="section-title"><span className="icon">ℹ️</span> About Us</h2>
        <p className="about-text">EntreLink is redefining entrepreneurship by making it easier to connect, collaborate, and succeed. From investor matchmaking to real-time collaboration tools, we are empowering tomorrow’s leaders.</p>
      </section>

      <section id="careers" className="careers-section">
        <h2 className="section-title"><span className="icon">💼</span> Join Our Team</h2>
        <p className="careers-text">Passionate about entrepreneurship and tech? We’re looking for forward-thinking individuals to help shape the future.</p>
        <a href="https://gyanb.notion.site/Entrelink-Careers-40c96e2d9b8345dda94b55c713f18344?pvs=4" className="btn primary">Explore Careers</a>
      </section>

      {/* New Mission Section */}
      <section className="mission-section">
        <h2 className="mission-title">Our mission is to <span>bridge the gap</span> between <span>passion</span> and <span>possibility</span>.</h2>
      </section>

      {/* Co-founder Story Section */}
      <section className="cofounder-story">
        <h2 className="section-title">Two high school classmates, one big idea</h2>
        <p className="cofounder-text">
        EntreLink was born from a shared desire to solve a problem we experienced firsthand. As students, Gyan and Andrew struggled to find the right connections to bring their ideas to life. We wanted to create a platform that would eliminate that struggle—an ecosystem where entrepreneurs, mentors, and investors could easily find one another. What started as an idea between two friends has grown into a dynamic network that helps innovators turn their passions into thriving businesses that would change the world.
        </p>
      </section>

      {/* Our Team Section */}
      <section id="our-team" className="our-team-section">
        <h2 className="section-title"><span className="icon">👥</span> Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={gyanImg} alt="Gyan Bhambhani" className="team-photo" /> {/* Replaced placeholder */}
            <h3>Gyan Bhambhani</h3>
            <p>CEO & CoFounder</p>
          </div>
          <div className="team-member">
            <img src={andrewImg} alt="Andrew Xiao" className="team-photo" /> {/* Replaced placeholder */}
            <h3>Andrew Xiao</h3>
            <p>Co-Founder & CTO</p>
          </div>
          <div className="team-member">
          <img src={aaruImg} alt="Aarushi Thaker" className="team-photo" />
            <h3>Aarushi Thaker</h3>
            <p>Chief Marketing Officer</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 EntreLink. Building the future of connections.</p>
      </footer>
    </div>
  );
};

export default HomePage;
