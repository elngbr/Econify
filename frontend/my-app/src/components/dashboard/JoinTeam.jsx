import React, { useEffect, useState } from "react";
import api from "../../services/api";

const JoinTeam = ({ projectId, onClose, onJoinSuccess }) => {
  const [teams, setTeams] = useState([]); // List of teams
  const [loading, setLoading] = useState(true); // Loading state
  const [expandedTeamId, setExpandedTeamId] = useState(null); // Track expanded team for member view

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

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      const updatedTeams = teams.map((team) =>
        team.id === teamId ? { ...team, members: response.data.members } : team
      );
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      if (!teamId) {
        console.error("Team ID is missing!");
        return;
      }

      const response = await api.post("/teams/join", { teamId });

      if (response.status === 200) {
        // Update UI with updated team data
        onJoinSuccess(response.data.team); // Pass updated team data to parent
        onClose(); // Close modal after join success
      } else {
        console.error("Failed to join the team:", response.data);
      }
    } catch (error) {
      console.error("Error joining team:", error);
      alert("Error joining team. Please try again.");
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
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
  },
};

export default JoinTeam;
