import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

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
      <button className="sign-up-button">SIGN UP!</button>
    </Link>
    <Link to="/signin">
      <button className="sign-in-button">SIGN IN</button>
    </Link>
  </div>
</header>


      <main>
        <section className="hero">
          <h1>Say hello <span className="wave-emoji">👋</span> to</h1>
          <h2 className="main-heading">
            your ultimate entrepreneur engine<br />
            to <span className="highlight make">make</span>, 
            <span className="highlight connect"> connect</span>, and 
            <span className="highlight create"> create</span>.
          </h2>
          <p>Empowering entrepreneurs to make their dreams a reality.</p>
        </section>

        <section id="features" className="features-grid">
          <div className="feature-square">
            <div className="feature-content">
              <div className="feature-front">
                <h3>Tinder-Style Matchmaking</h3>
              </div>
              <div className="feature-back">
                <p>Swipe to connect with entrepreneurs, professionals, and investors. Our intuitive interface helps you find the right people quickly.</p>
              </div>
            </div>
          </div>
          <div className="feature-square">
            <div className="feature-content">
              <div className="feature-front">
                <h3>Twitter-Style Chats</h3>
              </div>
              <div className="feature-back">
                <p>Engage in conversations and attend virtual events that bring the startup community together effortlessly.</p>
              </div>
            </div>
          </div>
          <div className="feature-square">
            <div className="feature-content">
              <div className="feature-front">
                <h3>TikTok-Style Pitches</h3>
              </div>
              <div className="feature-back">
                <p>Promote your startup in 60-second video pitches to attract attention from investors and new markets.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="about-us">
  <h2>About Us</h2>
  <p>
    Entrelink was born with a mission to bridge the gap for entrepreneurs across the world. Our goal is to provide an innovative, fast, and seamless way to connect founders with investors, mentors, and resources.
    <br/><br/>
    We believe in a world where opportunities are equally distributed, no matter the location or background. At Entrelink, our platform brings together talent from diverse industries to collaborate, innovate, and disrupt the status quo.
    <br/><br/>
    Join us as we continue to empower college founders, and aspiring entrepreneurs by helping them connect with people who will propel their vision forward.
  </p>
</section>



<section id="careers" className="careers">
  <h2>Careers</h2>
  <p>Are you passionate about entrepreneurship and innovation? Explore exciting opportunities at Entrelink.</p>
  <a href="https://gyanb.notion.site/Entrelink-Careers-40c96e2d9b8345dda94b55c713f18344?pvs=4" className="careers-link">
    Explore Careers
  </a>
</section>

      </main>

      <footer className="footer">
        <p>&copy; 2024 Entrelink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
