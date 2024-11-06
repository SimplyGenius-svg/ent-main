import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import CreateProfile from './CreateProfile';
import Dashboard from './Dashboard.js';
import ProtectedRoute from './ProtectedRoute';
import FounderResources from './FounderResources'; // Founder Resources component
import EmailTemplates from './EmailTemplates'; //Founder resources - email templates - testing
import BusinessHealthDashboard from './BusinessHealthDashboard'; // Business Health Dashboard component
import AIChatbot from './AIChatbot'; // AI Chatbot component
import ApolloConnections from './ApolloConnections'; // Apollo Connections component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-profile" element={<CreateProfile />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* New Routes for additional features */}
        <Route
          path="/founder-resources"
          element={
            <ProtectedRoute>
              <FounderResources />
            </ProtectedRoute>
          }
        />

        {/* New Routes for additional features */}
        <Route
          path="/email-templates"
          element={
            <ProtectedRoute>
              <EmailTemplates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-health"
          element={
            <ProtectedRoute>
              <BusinessHealthDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chatbot"
          element={
            <ProtectedRoute>
              <AIChatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apollo-connections"
          element={
            <ProtectedRoute>
              <ApolloConnections />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
