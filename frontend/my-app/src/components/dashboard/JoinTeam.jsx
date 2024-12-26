import React, { useEffect, useState } from "react";
import api from "../../services/api";

const JoinTeam = ({ projectId, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleJoinTeam = async (teamId) => {
    try {
      const response = await api.post("/teams/join", { teamId });
      alert(response.data.message);
      onClose();
    } catch (error) {
      console.error("Error joining team:", error);
      alert(
        error.response?.data?.error ||
          "Failed to join the team. Please try again."
      );
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Join a Team</h2>
        {loading ? (
          <p>Loading teams...</p>
        ) : teams.length === 0 ? (
          <p>No teams available for this project.</p>
        ) : (
          <ul style={styles.teamList}>
            {teams.map((team) => (
              <li key={team.id} style={styles.teamItem}>
                <div>
                  <strong>{team.name}</strong>
                  <p>Members: {team.membersCount}</p>
                </div>
                <button
                  style={styles.joinButton}
                  onClick={() => handleJoinTeam(team.id)}
                >
                  Join Team
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
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
  teamList: {
    listStyleType: "none",
    padding: 0,
  },
  teamItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  joinButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  closeButton: {
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default JoinTeam;
