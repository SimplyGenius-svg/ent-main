// EmailTemplatesPage.js
import React from 'react';

import './styles/EmailTemplates.css';

const emailTemplates = [
  { title: 'Follow-Up Email', preview: 'A concise follow-up for investors...', link: '/email-template-1' },
  { title: 'Introduction Email', preview: 'Introduce yourself to potential investors...', link: '/email-template-2' },
  // Add more templates as needed
];

function EmailTemplates() {
  return (
    <div className="email-templates-page">
      <h2>Email Templates</h2>
      <div className="email-templates-grid">
        {emailTemplates.map((template, index) => (
          <div key={index} className="email-template-tile">
            <h3>{template.title}</h3>
            <p>{template.preview}</p>
            <button onClick={() => window.open(template.link, '_blank')}>Preview</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailTemplates;