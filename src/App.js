import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CreateProfile from './CreateProfile';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import FounderResources from './FounderResources';
import EmailTemplates from './EmailTemplates';
import BusinessHealthDashboard from './BusinessHealthDashboard';
import AIChatbot from './StartupCopilotBot/AIChatbot';
import ApolloConnections from './ApolloConnections';
import TinderCreation from './TinderCreation';
import Connect from './Connect';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        navigate('/dashboard'); // Redirect to dashboard if authenticated
      } else {
        setIsAuthenticated(false);
        navigate('/signin'); // Redirect to sign-in if not authenticated
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, [navigate]);

  return (
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
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/founder-resources"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FounderResources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-templates"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EmailTemplates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-health"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BusinessHealthDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chatbot"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AIChatbot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apollo-connections"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ApolloConnections />
          </ProtectedRoute>
        }
      />

      {/* New Routes for Tinder-style features */}
      <Route
        path="/tinder-creation"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TinderCreation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connect"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Connect />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
