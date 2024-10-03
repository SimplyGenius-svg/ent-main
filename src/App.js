import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CreateProfile from './CreateProfile';
import Dashboard from './Dashboard';
import BuildProfile from './BuildProfile'; // Profile building component
import Matches from './Matches'; // Matches component
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/build-profile"
          element={
            <ProtectedRoute>
              <BuildProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route path="/create-profile" element={<CreateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
