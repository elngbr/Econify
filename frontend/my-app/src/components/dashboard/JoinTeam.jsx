import React, { useEffect, useState } from "react";
import api from "../../services/api";

const JoinTeam = ({ projectId, onClose, onJoinSuccess }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        const fetchedTeams = response.data.teams.map((team) => ({
          ...team,
          isJoined: false,
        }));
        setTeams(fetchedTeams || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleJoinTeam = async (teamId, teamName) => {
    try {
      if (!teamId) {
        console.error("Team ID is missing!");
        return;
      }

      const response = await api.post("/teams/join", { teamId });

      if (response.status === 200) {
        const updatedTeams = teams.map((team) =>
          team.id === teamId ? { ...team, isJoined: true } : team
        );
        setTeams(updatedTeams);

        alert(`Successfully joined the team: ${teamName || "Unnamed Team"}`);

        if (onJoinSuccess) {
          onJoinSuccess({
            id: teamId,
            name: response.data.team.name,
          });
        }
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
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
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
                  style={{
                    ...styles.joinButton,
                    ...(team.isJoined && styles.disabledButton),
                  }}
                  onClick={() => handleJoinTeam(team.id, team.name)}
                  disabled={team.isJoined}
                >
                  {team.isJoined ? "Joined" : "Join Team"}
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
  disabledButton: {
    backgroundColor: "#d3d3d3",
    color: "#808080",
    cursor: "not-allowed",
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
