import React from "react";
import { useNavigate } from "react-router-dom";

const SendDeliverable = ({ projectId, teamId }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button
        style={styles.sendButton}
        onClick={() => {
          if (!teamId || !projectId) {
            alert("Team ID or Project ID is missing.");
            return;
          }
          navigate(`/deliverables/submit/${projectId}`, {
            state: { teamId, projectId },
          });
        }}
      >
        Submit Deliverable
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "10px",
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
