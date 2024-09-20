import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; // Import your home page
import SignIn from './SignIn'; // Import your sign-in component
import SignUp from './SignUp'; // Import your sign-up component
import CreateProfile from './CreateProfile'; // Import your create profile component
import Dashboard from './Dashboard'; // Import your dashboard component
import ProtectedRoute from './ProtectedRoute'; // Import your protected route component

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />

        {/* Sign-in route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Sign-up route */}
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        

        {/* Create profile route */}
        <Route path="/create-profile" element={<CreateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
