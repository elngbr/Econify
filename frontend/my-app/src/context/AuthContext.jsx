import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap your application and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  useEffect(() => {
    // Check if a user is stored in localStorage on initial load
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Stop loading once the user is fetched
  }, []);

  // Login function to store user in state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data
    localStorage.setItem("token", userData.token); // Save token separately
  };

  // Logout function to clear user from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children} {/* Render children only after loading */}
    </AuthContext.Provider>
  );
};
