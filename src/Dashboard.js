import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase'; // Firebase configuration
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore methods
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  // Fetch user data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Assuming you have a users collection and each document represents a user
          const userRef = collection(db, 'users'); 
          const docSnap = await getDocs(query(userRef, where('uid', '==', user.uid)));
          if (!docSnap.empty) {
            const userDoc = docSnap.docs[0].data();
            setUserData(userDoc);
          } else {
            console.log('User data not found');
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Modular Firestore query for searching users
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      console.log('Search query is empty');
      return;
    }

    try {
      console.log('Executing search for:', searchQuery);
      const usersRef = collection(db, 'users'); // Reference to the 'users' collection
      const q = query(usersRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== auth.currentUser.uid) { // Exclude current user
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li>Home</li>
          <li>Connections</li>
          <li>Mentors</li>
          <li>Investors</li>
          <li>Messages</li>
        </ul>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div className="main-content">
        <div className="welcome-section">
          <h1>Welcome, {userData?.name}!</h1>
          <p>You're from {userData?.college}.</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <h3>Find Others to Connect With</h3>
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearch}>Search</button>

          {/* Display Search Results */}
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="search-result-item">
                  <p>{result.name}</p>
                  <button onClick={() => console.log('Connect with', result.name)}>
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
