import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./actions/firebase";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/signin" />; // Redirect to sign-in if no user is authenticated
  }

  return children;
};

export default ProtectedRoute;
