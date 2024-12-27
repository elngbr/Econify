import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const DeliverableForm = () => {
  const { state } = useLocation(); // Extract state from navigation
  const { teamId } = state || {}; // Get teamId from the state
  const [title, setTitle] = useState(""); // State for the deliverable title
  const [description, setDescription] = useState(""); // State for the deliverable description
  const [dueDate, setDueDate] = useState(""); // State for the due date
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId) {
      alert("Team ID is missing. Cannot submit deliverable.");
      return;
    }
    try {
      const response = await api.post("/deliverables/create", {
        teamId, // Use teamId from state
        title, // Use the title from input
        description, // Use the description from input
        dueDate, // Use the due date from input
      });
      alert(response.data.message || "Deliverable submitted successfully.");
      navigate("/student-dashboard");
    } catch (error) {
      console.error(
        "Error submitting deliverable:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to submit the deliverable. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Submit Deliverable</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Input for Deliverable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the deliverable title"
          style={styles.input}
          required
        />
        {/* Textarea for Deliverable Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your deliverable content here..."
          style={styles.textarea}
          required
        />
        {/* Input for Due Date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f3f2fc",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#4a148c",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  submitButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "10px",
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
};

export default DeliverableForm;
