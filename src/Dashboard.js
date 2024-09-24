import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase'; // Firestore and auth from your config
import { arrayUnion } from 'firebase/firestore'; // For Firestore FieldValue.arrayUnion
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // For searching others
  const [searchResults, setSearchResults] = useState([]); // To hold search results
  const [connections, setConnections] = useState([]); // User's existing connections
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = db.collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            setUserData(doc.data());
            setConnections(doc.data().connections || []); // Load user's existing connections
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

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to perform search for users in Firestore
  const handleSearch = async () => {
    try {
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef
        .where('name', '>=', searchQuery) // Search for names starting with the search query
        .where('name', '<=', searchQuery + '\uf8ff') // Ensure it includes all variations
        .get();

      const results = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== auth.currentUser.uid) { // Exclude the current user
          results.push({ id: doc.id, ...doc.data() });
        }
      });
      setSearchResults(results); // Set search results
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Function to send connection request
  const handleConnect = async (userId) => {
    try {
      const userRef = db.collection('users').doc(auth.currentUser.uid);
      await userRef.update({
        connectionRequests: arrayUnion(userId), // Use Firestore arrayUnion to send a request
      });
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li>Home</li>
          <li>Connections</li>
          <li>Mentors</li>
          <li>Investors</li>
          <li>Messages</li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content">
        <div className="welcome-section">
          {userData && (
            <>
              <h1>Welcome, {userData.name}!</h1>
              <p>You're from the {userData.college} college.</p>
            </>
          )}
        </div>

        {/* Search for Others Section */}
        <div className="search-section">
          <h3>Find Others to Connect With</h3>
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearch}>Search</button>
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="search-result-item">
                  <p>{result.name}</p>
                  <button onClick={() => handleConnect(result.id)}>Connect</button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>

        {/* Existing Connections Section */}
        <div className="connections-section">
          <h3>Your Connections</h3>
          {connections.length > 0 ? (
            connections.map((connection) => (
              <div key={connection.id} className="connection-item">
                <p>{connection.name}</p>
              </div>
            ))
          ) : (
            <p>You have no connections yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
