import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import MentorHub from './MentorHub';  // Import MentorHub component
import InvestorHub from './InvestorHub';  // Import InvestorHub component
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);  // Profile editing state
  const [currentView, setCurrentView] = useState('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    expertise: '',
    profilePic: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [tasks, setTasks] = useState([]);  // To-do list state
  const [newTask, setNewTask] = useState('');  // New task input
  const navigate = useNavigate();

  // Recommendation bank
  const recommendationBank = [
    "Investors interested in HealthTech startups",
    "Mentors in Web Development",
    "Networking events in your area",
    "Pitch competitions for startups",
    "Angel investors for early-stage companies",
    "Entrepreneurial workshops near you",
    "VCs focused on AI startups",
    "Mentors in Digital Marketing",
    "Opportunities for startup incubators",
    "Networking meetups for founders",
  ];

  // Select random recommendations
  const getRandomRecommendations = () => {
    const shuffled = [...recommendationBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

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
          setFormData({ ...userData, profilePic: profilePicUrl });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    setTopRecommendations(getRandomRecommendations());  // Set random recommendations
  }, [navigate]);

  const handleProfilePictureClick = () => {
    setIsEditProfileVisible(true);  // Open edit profile modal
  };

  // To-Do List Handlers
  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleNavClick = (view) => {
    setCurrentView(view);  // Switch to the respective view when clicking sidebar links
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={user?.profilePic || 'default-profile.png'}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfilePictureClick}
          />
          <h3>{user?.name}</h3>
          <p>{user?.college} | Expertise: {user?.expertise}</p>
        </div>
        <ul>
          <li><a onClick={() => handleNavClick('dashboard')}>Dashboard</a></li>
          <li><a onClick={() => handleNavClick('mentorHub')}>Mentor Hub</a></li>
          <li><a onClick={() => handleNavClick('investorHub')}>Investor Hub</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'dashboard' && (
          <section className="dashboard-view">
            <h1>Your Dashboard</h1>

            {/* Widget container to organize widgets */}
            <div className="widget-container">
              {/* Recent Activity */}
              <div className="widget">
                <h2>My Recent Activity</h2>
                <ul className="recent-activity-list">
                  <li>Connected with John Doe in Entrepreneurship</li>
                  <li>Posted in Mentor Hub: "Looking for co-founder!"</li>
                  <li>Updated profile picture</li>
                </ul>
              </div>

              {/* Top Recommendations */}
              <div className="widget">
                <h2>Top Recommendations</h2>
                <ul className="recommendations-list">
                  {topRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* To-Do List Widget */}
            <div className="widget">
              <h2>To-Do List</h2>
              <input
                type="text"
                value={newTask}
                onChange={handleTaskChange}
                placeholder="Add a new task..."
                className="task-input"
              />
              <button onClick={addTask} className="add-task-button">Add Task</button>
              <ul className="tasks-list">
                {tasks.map((task, index) => (
                  <li key={index} className="task-item">
                    {task}
                    <button onClick={() => deleteTask(index)} className="delete-task-button">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Mentor Hub view */}
        {currentView === 'mentorHub' && (
          <MentorHub />  // Render the Mentor Hub component
        )}

        {/* Investor Hub view */}
        {currentView === 'investorHub' && (
          <InvestorHub />  // Render the Investor Hub component
        )}
      </div>
    </div>
  );
};

export default Dashboard;
