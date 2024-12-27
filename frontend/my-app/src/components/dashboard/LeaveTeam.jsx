import React from "react";
import api from "../../services/api";

const LeaveTeam = ({ projectId, refreshDashboard }) => {
  const handleLeaveTeam = async () => {
    try {
      const response = await api.post("/teams/leave", { projectId });
      alert(response.data.message || "You have left the team.");
      refreshDashboard(); // Refresh the project list on success
    } catch (error) {
      console.error(
        "Error leaving team:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to leave the team. Please try again."
      );
    }
  };

  return (
    <button style={styles.cardButton} onClick={handleLeaveTeam}>
      Leave Team
    </button>
  );
};

const styles = {
  cardButton: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default LeaveTeam;
