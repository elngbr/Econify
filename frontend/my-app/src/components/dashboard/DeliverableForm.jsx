import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const DeliverableForm = () => {
  const { state } = useLocation(); // Extract state from navigation
  const { teamId } = state || {}; // Get teamId from the state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submissionLink, setSubmissionLink] = useState(""); // New state for the link
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url); // Use the URL constructor for validation
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId) {
      alert("Team ID is missing. Cannot submit deliverable.");
      return;
    }

    if (submissionLink && !isValidUrl(submissionLink)) {
      alert("Please enter a valid URL for the submission link.");
      return;
    }

    console.log({
      teamId,
      title,
      description,
      dueDate,
      submissionLink, // Log the submission link being sent
    });

    try {
      const response = await api.post("/deliverables/create", {
        teamId, // Use teamId from state
        title,
        description,
        dueDate,
        submissionLink, // Include submission link
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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the deliverable title"
          style={styles.input}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your deliverable content here..."
          style={styles.textarea}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="url"
          value={submissionLink}
          onChange={(e) => setSubmissionLink(e.target.value)}
          placeholder="Enter a submission link"
          style={styles.input}
          required // This makes the submissionLink mandatory
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
