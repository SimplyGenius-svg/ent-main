// src/Connect.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import './styles/Connect.css';



const Connect = () => {
  const { uid } = useParams();
  const [status, setStatus] = useState('');

  const handleSendConnectionRequest = async () => {
    if (uid === auth.currentUser.uid) {
      alert("You can't connect with yourself.");
      return;
    }

    try {
      // Check if a connection request already exists
      const q = query(
        collection(db, 'connections'),
        where('from', '==', auth.currentUser.uid),
        where('to', '==', uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert('Connection request already sent.');
        return;
      }

      const connectionData = {
        from: auth.currentUser.uid,
        to: uid,
        status: 'pending',
        timestamp: new Date(),
      };

      // Store the request in connections
      await addDoc(collection(db, 'connections'), connectionData);

      setStatus('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      setStatus('Failed to send connection request.');
    }
  };

  return (
    <div className="connect-container">
      <h1>Connect with User</h1>
      <p>Are you sure you want to connect with this user?</p>
      <button onClick={handleSendConnectionRequest}>Send Request</button>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default Connect;
