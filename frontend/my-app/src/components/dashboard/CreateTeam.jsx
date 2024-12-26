import React, { useState } from "react";
import api from "../../services/api";

const CreateTeam = ({ projectId, onClose }) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/teams/create", {
        name: teamName,
        projectId,
      });
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      alert(
        error.response?.data?.error ||
          "Failed to create the team. Please try again."
      );
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Create Team</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Create
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
  },
  submitButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  cancelButton: {
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
};

export default CreateTeam;
