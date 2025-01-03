import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const DeliverableForm = () => {
  const { state } = useLocation(); // Extract state from navigation
  const { teamId, projectId, lastDeliverablePassed } = state || {}; // Get teamId and projectId from the state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [isLastDeliverable, setIsLastDeliverable] = useState(false); // Checkbox for last deliverable
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId || !projectId) {
      alert("Team ID or Project ID is missing. Cannot submit deliverable.");
      return;
    }

    if (!submissionLink || !isValidUrl(submissionLink)) {
      alert("Please enter a valid URL for the submission link.");
      return;
    }

    try {
      const response = await api.post("/deliverables/create", {
        teamId, // Send teamId to backend
        projectId, // Send projectId to backend
        title,
        description,
        dueDate, // Use dueDate as editing deadline
        submissionLink,
        isLastDeliverable, // Indicate if this is the last deliverable
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
      <p style={styles.info}>
        Provide the details for the deliverable below. <br />
        <strong>Note:</strong> The <strong>Due Date</strong> determines the last
        day you can submit, edit, or delete the deliverable. Ensure you set it
        carefully!
      </p>
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the deliverable title"
              style={styles.input}
              required
              disabled={lastDeliverablePassed} // Disable input if time has passed
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a detailed description..."
              style={styles.textarea}
              required
              disabled={lastDeliverablePassed} // Disable input if time has passed
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
              required
              disabled={lastDeliverablePassed} // Disable input if time has passed
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Submission Link</label>
            <input
              type="url"
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
              placeholder="Enter a valid URL"
              style={styles.input}
              required
              disabled={lastDeliverablePassed} // Disable input if time has passed
            />
          </div>
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isLastDeliverable}
                onChange={() => setIsLastDeliverable(!isLastDeliverable)}
                disabled={lastDeliverablePassed} // Disable checkbox if time has passed
              />
              This is the last deliverable
            </label>
          </div>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={lastDeliverablePassed}
          >
            Submit Deliverable
          </button>
        </form>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "25px", // Added padding for proper spacing
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#4a148c",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  info: {
    textAlign: "center",
    color: "#616161",
    marginBottom: "20px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Added gap for spacing between inputs
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "10px", // Spacing between label and input
  },
  label: {
    fontWeight: "bold",
    color: "#4a148c",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  dueDateInfo: {
    color: "#616161",
    fontSize: "12px",
    marginTop: "4px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#4a148c",
  },
  submitButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  backButton: {
    marginTop: "20px",
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    width: "100%",
  },
};

export default DeliverableForm;
