import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // Make sure this is correctly pointing to firebase.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner here if needed
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
