import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ViewMembers from "./ViewMembers"; // Import the ViewMembers component

const ViewTeams = ({ userRole }) => {
  const { projectId } = useParams(); // Use projectId from URL params
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Error fetching teams:", err.response?.data || err.message);
        setError("Failed to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleDeleteTeam = async (teamId) => {
    try {
      await api.delete(`/teams/${teamId}`);
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      alert("Team deleted successfully.");
    } catch (err) {
      console.error("Error deleting team:", err.response?.data || err.message);
      alert("Failed to delete team. Please try again.");
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
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  Delete Team
                </button>
              )}
            </div>
          ))}
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
};

export default ViewTeams;
