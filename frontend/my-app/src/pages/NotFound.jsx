// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h1>NOT FOUND</h1>
        <h2 style={styles.subtitle}>Oops! How did you end up here?</h2>
        <p style={styles.message}>
          The page you’re looking for doesn’t exist. Maybe it was an imaginary
          endpoint or you took a wrong turn on the internet.
        </p>
        <img
          src="https://cdn.vectorstock.com/i/preview-1x/34/60/unhappy-student-crying-not-wanting-to-go-vector-48433460.jpg" // Replace with your funny image URL
          alt="Confused character"
          style={styles.image}
        />
        <button style={styles.button} onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f3f2fc",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  content: {
    maxWidth: "600px",
  },
  title: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "24px",
    color: "#4a148c",
    marginBottom: "20px",
  },
  message: {
    fontSize: "16px",
    color: "#616161",
    marginBottom: "30px",
  },
  image: {
    width: "300px",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default NotFound;
