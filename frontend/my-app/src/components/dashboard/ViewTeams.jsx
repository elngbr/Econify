import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ViewMembers from "./ViewMembers"; // Import the ViewMembers component

const ViewTeams = ({ userRole }) => {
  const { id: projectId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    actionType: "", // "deleteTeam"
    id: null,
    name: "",
  });

  useEffect(() => {
    const fetchTeams = async () => {
      if (!projectId) {
        setError("Invalid project ID.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        setTeams(response.data.teams || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleDeleteTeam = (teamId, teamName) => {
    setModalData({
      isVisible: true,
      message: `Are you sure you want to delete the team "${teamName}"?`,
      actionType: "deleteTeam",
      id: teamId,
      name: teamName,
    });
  };

  const closeModal = () => {
    setModalData({
      isVisible: false,
      message: "",
      actionType: "",
      id: null,
      name: "",
    });
  };

  const executeAction = async () => {
    try {
      if (modalData.actionType === "deleteTeam") {
        await api.delete(`/teams/${modalData.id}`);
        setTeams(teams.filter((team) => team.id !== modalData.id));
        alert(`Team "${modalData.name}" deleted successfully.`);
      }
    } catch (error) {
      console.error("Error executing action:", error);
      alert("Failed to execute action. Please try again.");
    } finally {
      closeModal();
    }
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
              <ViewMembers teamId={team.id} userRole={userRole} />
              {userRole === "professor" && (
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteTeam(team.id, team.name)}
                >
                  Delete Team
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Confirmation Modal */}
      {modalData.isVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>{modalData.message}</p>
            <div style={styles.modalActions}>
              <button style={styles.confirmButton} onClick={executeAction}>
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
