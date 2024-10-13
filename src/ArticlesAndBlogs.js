import React from 'react';
import './styles/ArticlesAndBlogs.css';

const articles = [
  { title: 'The Rise of Tech Startups', description: 'Learn how tech startups are shaping the future of entrepreneurship.', link: '/article1' },
  { title: 'Mastering Seed Funding', description: 'A complete guide on securing seed funding for your startup.', link: '/article2' },
  { title: 'Networking for Entrepreneurs', description: 'Tips and strategies on building a powerful network as an entrepreneur.', link: '/article3' }
];

const ArticlesAndBlogs = () => {
  return (
    <div className="articles-container">
      <h2>Articles & Blogs</h2>
      <div className="articles-grid">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.link} className="read-more">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesAndBlogs;
