import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
    window.location.reload(); 
    };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        👥 Econify - Anonymous Grading App
      </Link>
      <div style={styles.navLinks}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        ) : user.role === "professor" ? (
          <>
            <Link to="/professor-dashboard" style={styles.link}>
              Professor Dashboard
            </Link>
            <Link to="/professor/project-stats" style={styles.link}>
              Statistics
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : user.role === "student" ? (
          <>
            <Link to="/student-dashboard" style={styles.link}>
              Student Dashboard
            </Link>
            <Link to="/deliverables/assigned" style={styles.link}>
              See Deliverables to Grade
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#4a148c",
    color: "#fff",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Navbar;
