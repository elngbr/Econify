import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("PrivateRoute - User:", user, "Role:", role);

  if (loading) return <p>Loading...</p>;
  if (!user) {
    console.log("User not authenticated. Redirecting to login.");
    return <Navigate to="/login" />;
  }
  if (role && user.role !== role) {
    console.log("Role mismatch. Redirecting to home.");
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
