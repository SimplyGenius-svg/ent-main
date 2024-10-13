import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './styles/ProfileSearch.css';

const ProfileSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    industry: '',
    businessStage: ''
  });
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('industry', '==', searchCriteria.industry),
      where('businessStage', '==', searchCriteria.businessStage)
    );

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setResults(users);
  };

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-search-container">
      <h2>Search Profiles</h2>
      <label>Industry</label>
      <select name="industry" onChange={handleChange}>
        <option value="">Select Industry</option>
        <option value="Tech">Tech</option>
        <option value="Finance">Finance</option>
        <option value="Healthcare">Healthcare</option>
      </select>
      <label>Business Stage</label>
      <select name="businessStage" onChange={handleChange}>
        <option value="">Select Stage</option>
        <option value="Ideation">Ideation</option>
        <option value="Seed">Seed</option>
        <option value="Growth">Growth</option>
      </select>
      <button onClick={handleSearch}>Search</button>
      <div className="search-results">
        {results.length > 0 ? (
          results.map((user, index) => (
            <div key={index} className="user-card">
              <h3>{user.name}</h3>
              <p>Industry: {user.industry}</p>
              <p>Business Stage: {user.businessStage}</p>
            </div>
          ))
        ) : (
          <p>No matching profiles found</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSearch;
