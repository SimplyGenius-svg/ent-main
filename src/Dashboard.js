import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc, query, collection, where, getDocs, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import './styles/Dashboard.css';
import MentorHub from './MentorHub';
import InvestorHub from './InvestorHub';
import FounderResources from './FounderResources';
import BusinessHealthDashboard from './BusinessHealthDashboard';
import AIChatbot from './AIChatbot';
import ApolloConnections from './ApolloConnections';
import ThinkTank from './ThinkTank';
import NotificationsCenter from './NotificationsCenter';
import { FaHome, FaChalkboardTeacher, FaHandHoldingUsd, FaSearch, FaRobot, FaChartLine, FaTools, FaBell, FaComments } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newMajor, setNewMajor] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newReceivedRequests, setNewReceivedRequests] = useState(0);
  const [connections, setConnections] = useState([]); // State to hold connections with user names
  const navigate = useNavigate();

  // Fetch user data and received connection requests
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          let profilePicUrl;
          try {
            profilePicUrl = await getDownloadURL(storageRef(storage, `profilePictures/${auth.currentUser.uid}`));
          } catch (error) {
            profilePicUrl = 'path/to/default-profile.png'; // Default profile image path
          }
          setUser({ ...userData, profilePic: profilePicUrl });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNewReceivedRequests = async () => {
      try {
        const q = query(
          collection(db, 'connections'),
          where('to', '==', auth.currentUser.uid),
          where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(q);
        setNewReceivedRequests(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching new received requests:', error);
      }
    };

    // Real-time listener for accepted connections
    const subscribeToConnections = () => {
      const q = query(
        collection(db, 'connections'),
        where('status', '==', 'accepted'),
        where('to', '==', auth.currentUser.uid)  // Filter by the current user
      );
    
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const connectionList = await Promise.all(snapshot.docs.map(async (connectionDoc) => {
          const connectionData = connectionDoc.data();
    
          // Fetch the name of the user using the UID
          const userDocRef = doc(db, 'users', connectionData.from); // Correct usage of doc
          const userSnapshot = await getDoc(userDocRef);
          const fromUserName = userSnapshot.exists() ? userSnapshot.data().displayName : connectionData.from; // Fallback to UID if name is unavailable
    
          return {
            id: connectionDoc.id,
            ...connectionData,
            fromUserName, // Attach the display name instead of just the UID
          };
        }));
        setConnections(connectionList);
      });
    
      return unsubscribe; // Clean up the listener on unmount
    };
    

    fetchUserData();
    fetchNewReceivedRequests();
    const unsubscribeConnections = subscribeToConnections(); // Subscribe to connections

    // Cleanup on component unmount
    return () => {
      unsubscribeConnections();
    };
  }, [navigate]);

  // Toggle profile view
  const toggleProfileView = () => setShowProfile(!showProfile);

  // Toggle edit profile modal
  const toggleEditProfileModal = () => setIsEditProfileOpen(!isEditProfileOpen);

  // Handle profile changes
  const handleMajorChange = (e) => setNewMajor(e.target.value);
  const handleProfilePicChange = (e) => setNewProfilePic(e.target.files[0]);

  // Save profile data
  const handleProfileSave = async () => {
    if (newProfilePic) {
      const storageReference = storageRef(storage, `profilePictures/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageReference, newProfilePic);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error("Error uploading profile picture:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageReference);
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            major: newMajor,
            profilePic: downloadURL
          });
          setUser((prevUser) => ({ ...prevUser, major: newMajor, profilePic: downloadURL }));
          toggleEditProfileModal();
        }
      );
    } else {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { major: newMajor });
      setUser((prevUser) => ({ ...prevUser, major: newMajor }));
      toggleEditProfileModal();
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="new-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container" onClick={toggleProfileView}>
          <img
            src={user?.profilePic || 'path/to/default-profile.png'}
            alt="Profile"
            className="profile-pic"
          />
        </div>
        <ul className="nav-links">
          <li className={currentView === 'home' ? 'active' : ''} onClick={() => setCurrentView('home')}>
            <FaHome /> Home
          </li>
          <li className={currentView === 'mentorHub' ? 'active' : ''} onClick={() => setCurrentView('mentorHub')}>
            <FaChalkboardTeacher /> Mentor Hub
          </li>
          <li className={currentView === 'investorHub' ? 'active' : ''} onClick={() => setCurrentView('investorHub')}>
            <FaHandHoldingUsd /> Investor Hub
          </li>
          <li className={currentView === 'resources' ? 'active' : ''} onClick={() => setCurrentView('resources')}>
            <FaTools /> Founder Resources
          </li>
          <li className={currentView === 'healthDashboard' ? 'active' : ''} onClick={() => setCurrentView('healthDashboard')}>
            <FaChartLine /> Business Health
          </li>
          <li className={currentView === 'aiChatbot' ? 'active' : ''} onClick={() => setCurrentView('aiChatbot')}>
            <FaRobot /> AI Chatbot
          </li>
          <li className={currentView === 'apolloConnections' ? 'active' : ''} onClick={() => setCurrentView('apolloConnections')}>
            <FaSearch /> Apollo Connections
          </li>
          <li className={currentView === 'thinkTank' ? 'active' : ''} onClick={() => setCurrentView('thinkTank')}>
            <FaComments /> ThinkTank
          </li>
          <li className={currentView === 'notifications' ? 'active' : ''} onClick={() => setCurrentView('notifications')}>
            <FaBell /> Notifications
            {newReceivedRequests > 0 && <span className="badge">{newReceivedRequests}</span>}
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
        {showProfile ? (
          <section className="profile-view">
            <div className="profile-header">
              <img
                src={user?.profilePic || 'path/to/default-profile.png'}
                alt="Profile"
                className="large-profile-pic"
              />
              <h1>{user?.name}</h1>
              <p>Major: {user?.major || 'N/A'}</p>
              <button className="edit-profile-btn" onClick={toggleEditProfileModal}>Edit Profile</button>
            </div>
          </section>
        ) : (
          <>
            {currentView === 'home' && (
              <section className="dashboard-view">
                <h1>Welcome, {user?.name}!</h1>
                <div className="widget-container">
                  <div className="widget">
                    <h2>Recent Activity</h2>
                    <p>Connected with new investors</p>
                    <p>Explored new mentorship opportunities</p>
                  </div>
                  <div className="widget">
                    <h2>Your Connections</h2>
                    <ul>
                      {connections.map((connection) => (
                        <li key={connection.id}>Connected with {connection.fromUserName}</li> 
                      ))}
                    </ul>
                  </div>
                  <div className="widget">
                    <h2>Recommended Actions</h2>
                    <p>Apply for venture capital funding</p>
                    <p>Pitch at the upcoming founders' event</p>
                  </div>
                </div>
              </section>
            )}
            {currentView === 'mentorHub' && <MentorHub />}
            {currentView === 'investorHub' && <InvestorHub />}
            {currentView === 'resources' && <FounderResources />}
            {currentView === 'healthDashboard' && <BusinessHealthDashboard />}
            {currentView === 'aiChatbot' && <AIChatbot />}
            {currentView === 'apolloConnections' && <ApolloConnections />}
            {currentView === 'thinkTank' && <ThinkTank />}
            {currentView === 'notifications' && <NotificationsCenter />}
          </>
        )}
      </div>

      {/* Edit profile modal */}
      {isEditProfileOpen && (
        <div className="edit-profile-modal">
          <div className="modal-header">
            <h2>Edit Profile</h2>
            <button className="close-button" onClick={toggleEditProfileModal}>X</button>
          </div>
          <div className="edit-profile-container">
            <label htmlFor="major">Major</label>
            <input type="text" id="major" value={newMajor} onChange={handleMajorChange} />

            <label htmlFor="profilePic">Upload Profile Picture</label>
            <input type="file" id="profilePic" onChange={handleProfilePicChange} />

            <button className="save-button" onClick={handleProfileSave}>Save Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
