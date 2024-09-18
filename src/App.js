import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
