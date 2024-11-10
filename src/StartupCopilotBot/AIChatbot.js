import React, { useState } from 'react';

function AIChatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission to send prompt to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(''); // Clear previous response

    try {
      const res = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message}. Please check your server connection.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Ask the Startup Copilot</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>Ask</button>
      </form>
      <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f0f4f8', color: '#333', fontSize: '18px' }}>
        <h3>Response:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{response}</p>
        )}
      </div>
    </div>
  );
}

export default AIChatbot;
