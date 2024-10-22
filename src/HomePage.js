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
        <h1 className="headline">Fuel Growth with Data-Driven Connections</h1>
        <p className="subtext">The ultimate platform for entrepreneurs, investors, and mentors powered by real-time data and insights.</p>
        <div className="hero-cta">
          <a href="/signup" className="btn primary">Join Us</a>
          <a href="#our-team" className="btn secondary">Learn More</a>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="section-title"><span className="icon">⚙️</span> Our Data-Driven Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI-Powered Networking</h3>
            <p>Leverage data-driven matchmaking to find the right mentors, collaborators, and investors.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Data Insights</h3>
            <p>Track entrepreneurial trends, investment behaviors, and mentorship patterns to stay ahead.</p>
          </div>
          <div className="feature-card">
            <h3>Personalized Recommendations</h3>
            <p>Get matched with opportunities and resources based on your data profile and goals.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2 className="section-title"><span className="icon">ℹ️</span> About Us</h2>
        <p className="about-text">EntreLink is the future of entrepreneurship platforms—combining powerful data analytics with a network of innovators, mentors, and investors. By harnessing the power of data, we help you find the right opportunities to thrive.</p>
      </section>

      <section id="careers" className="careers-section">
        <h2 className="section-title"><span className="icon">💼</span> Join Our Team</h2>
        <p className="careers-text">Want to be at the forefront of a data revolution in entrepreneurship? Join us and be a part of building the future of business innovation.</p>
        <a href="https://gyanb.notion.site/Entrelink-Careers-40c96e2d9b8345dda94b55c713f18344?pvs=4" className="btn primary">Explore Careers</a>
      </section>

      {/* New Data Mission Section */}
      <section className="mission-section">
        <h2 className="mission-title">Our mission is to empower entrepreneurs with <span>data-driven insights</span> and <span>real-time connections</span>.</h2>
      </section>

      {/* Data-Driven Entrepreneurship Section */}
      <section className="data-driven-section">
        <h2 className="section-title">Entrepreneurship Meets Data</h2>
        <p className="data-driven-text">
          EntreLink is more than just a networking platform. We use cutting-edge data analytics to provide insights that fuel entrepreneurial success. Whether you're looking for your next investment, mentor, or collaboration, our data-driven engine makes sure you're always one step ahead.
        </p>
      </section>

      {/* Our Team Section */}
      <section id="our-team" className="our-team-section">
        <h2 className="section-title"><span className="icon">👥</span> Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={gyanImg} alt="Gyan Bhambhani" className="team-photo" /> {/* Replaced placeholder */}
            <h3>Gyan Bhambhani</h3>
            <p>Founder & Chief Executive Officer</p>
          </div>
          <div className="team-member">
            <img src={andrewImg} alt="Andrew Xiao" className="team-photo" /> {/* Replaced placeholder */}
            <h3>Andrew Xiao</h3>
            <p>Chief Technology Officer</p>
          </div>
          <div className="team-member">
          <img src={aaruImg} alt="Aarushi Thaker" className="team-photo" />
            <h3>Aarushi Thaker</h3>
            <p>Chief Marketing Officer</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 EntreLink. Data-Driven Connections for a Brighter Future.</p>
      </footer>
    </div>
  );
};

export default HomePage;
