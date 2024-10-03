import React, { useEffect, useState } from 'react';
import { getCurrentUserProfile } from './getMatches'; // Fetch the current user's profile
import './Connections.css';

const Connections = () => {
  const [receivedConnections, setReceivedConnections] = useState([]);
  const [sentConnections, setSentConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      const currentUserProfile = await getCurrentUserProfile();

      if (currentUserProfile) {
        setReceivedConnections(currentUserProfile.receivedConnections || []);
        setSentConnections(currentUserProfile.sentConnections || []);
      }
    };

    fetchConnections();
  }, []);

  return (
    <div className="connections-container">
      <h1>Your Connection Requests</h1>

      <div>
        <h2>Received Requests</h2>
        {receivedConnections.length > 0 ? (
          receivedConnections.map((connectionId) => (
            <div key={connectionId} className="connection-card">
              <p>Connection request from user: {connectionId}</p>
              {/* Option to accept or decline can be added here */}
            </div>
          ))
        ) : (
          <p>No received connection requests.</p>
        )}
      </div>

      <div>
        <h2>Sent Requests</h2>
        {sentConnections.length > 0 ? (
          sentConnections.map((connectionId) => (
            <div key={connectionId} className="connection-card">
              <p>Connection request sent to user: {connectionId}</p>
            </div>
          ))
        ) : (
          <p>No sent connection requests.</p>
        )}
      </div>
    </div>
  );
};

export default Connections;
