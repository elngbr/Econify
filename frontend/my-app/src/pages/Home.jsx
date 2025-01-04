// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to Econify</h1>
        <p style={styles.subtitle}>
          A modern platform for anonymous grading and academic collaboration.
        </p>
      </div>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/register")}>
          Register
        </button>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>About Econify</h2>
          <p style={styles.cardText}>
            Econify is an innovative platform developed by two students from the
            Bucharest University of Economic Studies. It enables anonymous
            grading for projects, ensuring fairness and transparency in academic
            evaluation.
          </p>

          <p style={styles.cardText}>
            Professors can create projects and enable anonymous juries to grade
            deliverables, while students can collaborate and showcase their work
            seamlessly.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Why Econify?</h2>
          <p style={styles.cardText}>
            Econify: Revolutionizing the grading process with anonymity and
            fairness. Professors assign juries instead of grading directly,
            ensuring no one - students or jurors - knows who is grading or being
            graded. It’s a seamless, unbiased, and anonymous system that fosters
            trust and humility in education.
          </p>
          <h2 style={styles.cardTitle}>How It Works</h2>
          <ul style={styles.steps}>
            <li>
              <strong>1.</strong> Professors create projects and assign anonzmus
              jurors for the deliverables of each team in a project.
            </li>
            <li>
              <strong>2.</strong> Students submit deliverables for evaluation.
            </li>
            <li>
              <strong>3.</strong> Anonymous juries grade the deliverables.
            </li>
            <li>
              <strong>4.</strong> Final grades are released transparently.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f3f2fc",
    height: "80vh", // Occupy 80% of the viewport height
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center items horizontally
    justifyContent: "space-between", // Distribute items vertically
    textAlign: "center", // Align text in the center
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "10px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#616161",
    maxWidth: "600px",
    margin: "0 auto", // Center subtitle text
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    justifyContent: "center", // Ensure buttons are centered
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
  content: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center", // Center the cards horizontally
    alignItems: "center", // Align cards vertically within their container
    width: "100%",
    maxWidth: "800px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    flex: "1 1 300px", // Flexibly size cards
    maxWidth: "350px",
    textAlign: "left", // Align text inside cards to the left
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: "10px",
  },
  cardText: {
    fontSize: "16px",
    color: "#616161",
    marginBottom: "10px",
  },
  steps: {
    listStyleType: "none",
    padding: 0,
    fontSize: "16px",
    color: "#616161",
  },
};

export default Home;
