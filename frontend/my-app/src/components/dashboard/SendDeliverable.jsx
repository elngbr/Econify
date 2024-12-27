import React, { useState } from "react";
import api from "../../services/api";

const SendDeliverable = ({ projectId, refreshDashboard }) => {
  const [deliverable, setDeliverable] = useState("");
  const handleSendDeliverable = async () => {
    try {
      const response = await api.post("/deliverables/create", {
        projectId,
        content: deliverable,
      });
      alert(response.data.message || "Deliverable sent successfully.");
      refreshDashboard(); // Refresh the project list on success
    } catch (error) {
      console.error(
        "Error sending deliverable:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to send the deliverable. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <textarea
        placeholder="Enter deliverable content..."
        value={deliverable}
        onChange={(e) => setDeliverable(e.target.value)}
        style={styles.textarea}
      />
      <button style={styles.sendButton} onClick={handleSendDeliverable}>
        Send Deliverable
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  sendButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SendDeliverable;
