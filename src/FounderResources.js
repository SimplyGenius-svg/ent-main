import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FounderResources.css';

const FounderResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [emailTemplates, setEmailTemplates] = useState(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/resources.json')
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error("Error Fetching Resources:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase().trim());
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setEmailTemplates(null);
  };

  const handleViewEmailTemplates = () => {
    setEmailTemplates([
      {
        title: "Template 1",
        preview: "Initial Investor Outreach Template",
        fullContent: "Full content of Template 1 email goes here.",
      },
      {
        title: "Template 2",
        preview: "Preview of Template 2 content...",
        fullContent: "Full content of Template 2 email goes here.",
      },
      {
        title: "Template 3",
        preview: "Preview of Template 2 content...",
        fullContent: "Full content of Template 2 email goes here.",
      },
      {
        title: "Template 4",
        preview: "Preview of Template 2 content...",
        fullContent: "Full content of Template 2 email goes here.",
      },
    ]);
  };

  const toggleCardExpansion = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearchTerm = resource.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className="founder-resources-container">
      <h2>Founder Resources Library</h2>

      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="filter-buttons">
          {['All', 'Pitch Decks', 'Financial Models', 'Growth Playbooks', 'Email Templates'].map((category) => (
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

      <div className="resource-card-container">
        {emailTemplates ? (
          emailTemplates.map((template, index) => (
            <div
              className="email-template-card"
              key={index}
              onClick={() => toggleCardExpansion(index)}
            >
              <h3>{template.title}</h3>
              <p>
                {expandedCardIndex === index ? template.fullContent : template.preview}
              </p>
            </div>
          ))
        ) : (
          filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <div className="resource-card" key={index}>
                <div className="resource-card-header">
                  <img src={resource.icon} alt={resource.title} className="resource-icon" />
                  <h3>{resource.title}</h3>
                </div>
                <div className="resource-card-body">
                  <p>{resource.description}</p>
                  <button
                    onClick={() => {
                      if (resource.category === 'Email Templates') {
                        handleViewEmailTemplates();
                      } else {
                        window.open(resource.downloadLink, '_blank');
                      }
                    }}
                    className="download-btn"
                  >
                    {resource.buttonText}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No resources found. Try searching for something else.</p>
          )
        )}
      </div>
    </div>
  );
};

export default FounderResources;