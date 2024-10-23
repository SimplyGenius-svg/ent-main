import React, { useContext, useState, useEffect } from "react";
import { auth } from "./actions/firebase"; // Import from your firebase config
import { onAuthStateChanged } from "firebase/auth";

// Create Auth context
const AuthContext = React.createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading screen while auth state is being fetched
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
