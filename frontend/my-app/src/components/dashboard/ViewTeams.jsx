import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ViewMembers from "./ViewMembers"; // Import the ViewMembers component

const ViewTeams = ({ userRole }) => {
  const { projectId } = useParams(); // Use projectId from URL params
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({
    isVisible: false,
    teamId: null,
    teamName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        if (response.data && response.data.teams) {
          setTeams(response.data.teams);
        } else {
          setError("No teams found for this project.");
        }
      } catch (err) {
        console.error(
          "Error fetching teams:",
          err.response?.data || err.message
        );
        setError("Failed to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleDeleteTeam = async () => {
    try {
      await api.delete(`/teams/${modalData.teamId}`);
      setTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== modalData.teamId)
      );
      closeModal();
      alert(`Team "${modalData.teamName}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting team:", err.response?.data || err.message);
      alert("Failed to delete team. Please try again.");
    }
  };

  const openModal = (teamId, teamName) => {
    setModalData({
      isVisible: true,
      teamId,
      teamName,
    });
  };

  const closeModal = () => {
    setModalData({
      isVisible: false,
      teamId: null,
      teamName: "",
    });
  };

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Teams for Project {projectId}</h1>
      {teams.length === 0 ? (
        <p style={styles.noTeams}>No teams available for this project.</p>
      ) : (
        <div style={styles.teamsContainer}>
          {teams.map((team) => (
            <div key={team.id} style={styles.teamCard}>
              <h2 style={styles.teamName}>{team.name}</h2>
              {/* View Members Section */}
              <ViewMembers teamId={team.id} userRole={userRole} />
              {userRole === "professor" && (
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cardButton}
                    onClick={() => navigate(`/teams/${team.id}/deliverables`)}
                  >
                    View Deliverables
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => openModal(team.id, team.name)}
                  >
                    Delete Team
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalData.isVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>
              Are you sure you want to delete the team "{modalData.teamName}"?
            </p>
            <div style={styles.modalActions}>
              <button style={styles.confirmButton} onClick={handleDeleteTeam}>
                Confirm
              </button>
              <button style={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f3f2fc",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#4a148c",
    marginBottom: "20px",
  },
  noTeams: {
    textAlign: "center",
    color: "#616161",
    fontStyle: "italic",
  },
  teamsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  teamCard: {
    backgroundColor: "#fff",
    border: "1px solid #d1c4e9",
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    textAlign: "center",
  },
  teamName: {
    color: "#4a148c",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  buttonGroup: {
    marginTop: "10px",
  },
  cardButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
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
    textAlign: "center",
    width: "300px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ViewTeams;