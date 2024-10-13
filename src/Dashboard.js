import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import './styles/Dashboard.css';
import MentorHub from './MentorHub';
import InvestorHub from './InvestorHub';
import ConnectProfile from './ConnectProfile';
import ConnectSwipe from './ConnectSwipe';
import InstantMessaging from './InstantMessaging';
import ArticlesAndBlogs from './ArticlesAndBlogs';
import ProfileSearch from './ProfileSearch'; // Import ProfileSearch component
import { FaHome, Faedit, FaChalkboardTeacher, FaHandHoldingUsd, FaHandshake, FaComments, FaBook, FaSearch } from 'react-icons/fa'; // Remove FaEdit if not used
import RefinedProfile from './RefinedProfile';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const profilePicUrl = await getDownloadURL(storageRef(storage, `profilePictures/${auth.currentUser.uid}`));
          setUser({ ...userData, profilePic: profilePicUrl });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={user?.profilePic || 'default-profile.png'}
            alt="Profile"
            className="profile-pic"
            onClick={() => window.open('https://linkedin.com')} // Option for LinkedIn
          />
          <button onClick={() => window.open('https://instagram.com')}>Connect Instagram</button>
        </div>
        <ul className="nav-links">
          <li onClick={() => setCurrentView('home')}><FaHome /> Home</li>
          <li onClick={() => setCurrentView('mentorHub')}><FaChalkboardTeacher /> Mentor Hub</li>
          <li onClick={() => setCurrentView('investorHub')}><FaHandHoldingUsd /> Investor Hub</li>
          <li onClick={() => setCurrentView('connect')}><FaHandshake /> Connect</li>
          <li onClick={() => setCurrentView('instantMessaging')}><FaComments /> Instant Messaging</li>
          <li onClick={() => setCurrentView('articlesAndBlogs')}><FaBook /> Articles & Blogs</li>
          <li onClick={() => setCurrentView('refineProfile')}><FaSearch /> Refine Profile</li>
          <li onClick={() => setCurrentView('profileSearch')}><FaSearch /> Profile Search</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'home' && (
          <section className="dashboard-view">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Your random advice of the day: "Embrace the challenges!"</p>
            <div className="widget-container">
              <div className="widget">
                <h2>Recent Activity</h2>
                <p>Connected with a new investor</p>
                <p>Joined a mentorship program</p>
              </div>
              <div className="widget">
                <h2>Recommendations</h2>
                <p>Join the upcoming founder's event</p>
                <p>Apply for the seed funding opportunity</p>
              </div>
            </div>
          </section>
        )}

        {currentView === 'mentorHub' && <MentorHub />}
        {currentView === 'investorHub' && <InvestorHub />}
        {currentView === 'connect' && <ConnectProfile />}
        {currentView === 'instantMessaging' && <InstantMessaging />}
        {currentView === 'articlesAndBlogs' && <ArticlesAndBlogs />}
        {currentView === 'refineProfile' && <RefinedProfile />}
        {currentView === 'profileSearch' && <ProfileSearch />}
      </div>
    </div>
  );
};

export default Dashboard;
