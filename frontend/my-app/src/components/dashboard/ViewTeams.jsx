import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const ViewTeams = ({ userRole }) => {
  const { id: projectId } = useParams(); // Get projectId from route
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get user from context

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

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Teams for Project {projectId}</h1>
      {teams.length === 0 ? (
        <p style={styles.noTeams}>No teams available for this project.</p>
      ) : (
        teams.map((team) => (
          <div key={team.id} style={styles.teamCard}>
            <h2 style={styles.teamName}>{team.name}</h2>
            <ul style={styles.memberList}>
              {team.members?.map((member) => (
                <li key={member.id} style={styles.memberItem}>
                  {member.name} ({member.email})
                  {userRole === "professor" && (
                    <button
                      style={styles.removeButton}
                      onClick={() => alert(`Remove user: ${member.id}`)}
                    >
                      Remove User
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {userRole === "professor" && (
              <button
                style={styles.deleteButton}
                onClick={() => alert(`Delete team: ${team.id}`)}
              >
                Delete Team
              </button>
            )}
          </div>
        ))
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
  teamCard: {
    backgroundColor: "#fff",
    border: "1px solid #d1c4e9",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "10px",
    textAlign: "center",
  },
  teamName: {
    color: "#4a148c",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  memberList: {
    listStyleType: "none",
    padding: 0,
  },
  memberItem: {
    color: "#616161",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "10px",
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
};

export default ViewTeams;
