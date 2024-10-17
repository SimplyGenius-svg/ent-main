import React, { useState, useEffect } from 'react';
import './FounderResources.css'; // Add a new CSS file for the modern design

const FounderResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Fetch data from Firebase or local JSON
    fetch('/resources.json')
      .then((response) => response.json())
      .then((data) => setResources(data));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return resource.title.toLowerCase().includes(searchTerm) && matchesCategory;
  });

  return (
    <div className="founder-resources-container">
      <h2>Founder Resources Library</h2>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {['All', 'Pitch Decks', 'Financial Models', 'Growth Playbooks'].map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="resource-card-container">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <div className="resource-card" key={index}>
              <div className="resource-card-header">
                <img src={resource.icon} alt={resource.title} className="resource-icon" />
                <h3>{resource.title}</h3>
              </div>
              <div className="resource-card-body">
                <p>{resource.description}</p>
                <button
                  onClick={() => window.open(resource.downloadLink, '_blank')}
                  className="download-btn"
                >
                  {resource.buttonText}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No resources found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
};

export default FounderResources;
