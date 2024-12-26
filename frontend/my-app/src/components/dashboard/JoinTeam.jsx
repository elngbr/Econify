import React, { useEffect, useState } from "react";
import api from "../../services/api";

const JoinTeam = ({ projectId, onClose }) => {
  const [teams, setTeams] = useState([]); // List of teams
  const [loading, setLoading] = useState(true); // Loading state
  const [expandedTeamId, setExpandedTeamId] = useState(null); // Track expanded team for member view
  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    type: "", // "error" or "success"
  }); // State for error/success modal
  const [isPartOfTeam, setIsPartOfTeam] = useState(false); // If user is part of a team
  const [currentTeamName, setCurrentTeamName] = useState(""); // Name of the team user belongs to

  useEffect(() => {
    const fetchTeamsAndUserStatus = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        setTeams(response.data.teams || []);

        // Check if the user is already in a team for this project
        const userResponse = await api.get(`/users/current-team/${projectId}`);
        if (userResponse.data.team) {
          setIsPartOfTeam(true);
          setCurrentTeamName(userResponse.data.team.name);
        }
      } catch (error) {
        openModal("Error fetching data. Please try again.", "error");
        console.error("Error fetching teams or user status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndUserStatus();
  }, [projectId]);

  // Fetch members for a specific team
  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      const updatedTeams = teams.map((team) =>
        team.id === teamId ? { ...team, members: response.data.members } : team
      );
      setTeams(updatedTeams);
    } catch (error) {
      openModal("Error fetching team members. Please try again.", "error");
      console.error("Error fetching team members:", error);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const response = await api.post("/teams/join", { teamId });
      openModal(response.data.message, "success");
      onClose(); // Close the modal after successfully joining
    } catch (error) {
      openModal(
        error.response?.data?.error ||
          "Failed to join the team. Please try again.",
        "error"
      );
      console.error("Error joining team:", error);
    }
  };

  const toggleExpandTeam = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null); // Collapse if already expanded
    } else {
      setExpandedTeamId(teamId);
      fetchTeamMembers(teamId); // Fetch members when expanding
    }
  };

  // Open modal for error/success messages
  const openModal = (message, type) => {
    setModalData({
      isVisible: true,
      message,
      type,
    });
  };

  // Close modal
  const closeModal = () => {
    setModalData({
      isVisible: false,
      message: "",
      type: "",
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>
          {isPartOfTeam ? `Your Team: ${currentTeamName}` : "Join a Team"}
        </h2>
        {loading ? (
          <p>Loading teams...</p>
        ) : isPartOfTeam ? (
          <div style={styles.teamActions}>
            <button
              style={styles.actionButton}
              onClick={() => alert("Send Deliverables functionality")}
            >
              Send Deliverables
            </button>
            <button
              style={styles.actionButton}
              onClick={() => alert("View Deliverables functionality")}
            >
              View Deliverables
            </button>
          </div>
        ) : teams.length === 0 ? (
          <p>No teams available for this project.</p>
        ) : (
          <ul style={styles.teamList}>
            {teams.map((team) => (
              <li key={team.id} style={styles.teamItem}>
                <div>
                  <strong>{team.name}</strong>
                  <button
                    style={styles.expandButton}
                    onClick={() => toggleExpandTeam(team.id)}
                  >
                    {expandedTeamId === team.id
                      ? "Hide Members"
                      : "View Members"}
                  </button>
                </div>
                {expandedTeamId === team.id && (
                  <div style={styles.membersContainer}>
                    <h4>Members</h4>
                    {team.members && team.members.length > 0 ? (
                      <ul style={styles.memberList}>
                        {team.members.map((member) => (
                          <li key={member.id} style={styles.memberItem}>
                            {member.name} ({member.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No members in this team.</p>
                    )}
                  </div>
                )}
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

      {/* Error/Success Modal */}
      {modalData.isVisible && (
        <div style={styles.errorModal}>
          <div style={styles.errorModalContent}>
            <p
              style={
                modalData.type === "error"
                  ? styles.errorText
                  : styles.successText
              }
            >
              {modalData.message}
            </p>
            <button onClick={closeModal} style={styles.modalCloseButton}>
              Close
            </button>
          </div>
        </div>
      )}
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
    flexDirection: "column",
    marginBottom: "10px",
    border: "1px solid #d1c4e9",
    borderRadius: "8px",
    padding: "10px",
  },
  expandButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px 0",
  },
  membersContainer: {
    marginTop: "10px",
    backgroundColor: "#f3f2fc",
    padding: "10px",
    borderRadius: "5px",
  },
  memberList: {
    listStyleType: "none",
    padding: 0,
  },
  memberItem: {
    marginBottom: "5px",
    color: "#616161",
  },
  joinButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
  closeButton: {
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "15px",
  },
  teamActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  actionButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  errorModal: {
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
  errorModalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  },
  errorText: {
    color: "#f44336",
    marginBottom: "10px",
  },
  successText: {
    color: "#4caf50",
    marginBottom: "10px",
  },
  modalCloseButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default JoinTeam;
