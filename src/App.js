import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import CreateProfile from './CreateProfile';
import Dashboard from './Dashboard';
import BuildProfile from './BuildProfile'; // Profile building component
import Matches from './Matches'; // Matches component
import ConnectSwipe from './ConnectSwipe'; // Importing ConnectSwipe component
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
        <Route
          path="/connectswipe" // Adding the /connectswipe route
          element={
            <ProtectedRoute>
              <ConnectSwipe />  {/* Adding the ConnectSwipe component here */}
            </ProtectedRoute>
          }
        />
        <Route path="/create-profile" element={<CreateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
