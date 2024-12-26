import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ViewTeams = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        console.log("Teams fetched:", response.data);
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error.response?.data || error.message);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleRemoveUser = async (userId) => {
    try {
      await api.post("/teams/remove-user", { userId });
      alert("User removed successfully!");
      setTeams((prevTeams) =>
        prevTeams.map((team) => ({
          ...team,
          students: team.students.filter((student) => student.id !== userId),
        }))
      );
    } catch (error) {
      console.error("Error removing user:", error.response?.data || error.message);
      alert("Failed to remove user.");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await api.delete(`/teams/${teamId}`);
      alert("Team deleted successfully!");
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Error deleting team:", error.response?.data || error.message);
      alert("Failed to delete team.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Teams for Project</h1>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        Back to Dashboard
      </button>
      <div style={styles.teamList}>
        {teams.length === 0 ? (
          <p style={styles.noTeams}>No teams found for this project.</p>
        ) : (
          teams.map((team) => (
            <div key={team.id} style={styles.teamCard}>
              <h3 style={styles.teamName}>{team.name}</h3>
              <h4 style={styles.teamSubtitle}>Members:</h4>
              {team.students.length === 0 ? (
                <p>No members in this team.</p>
              ) : (
                team.students.map((student) => (
                  <p key={student.id}>
                    {student.name}{" "}
                    <button
                      style={styles.removeButton}
                      onClick={() => handleRemoveUser(student.id)}
                    >
                      Remove
                    </button>
                  </p>
                ))
              )}
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteTeam(team.id)}
              >
                Delete Team
              </button>
            </div>
          ))
        )}
      </div>
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
  backButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  teamList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  noTeams: {
    textAlign: "center",
    color: "#4a148c",
  },
  teamCard: {
    backgroundColor: "#fff",
    border: "1px solid #d1c4e9",
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  teamName: {
    color: "#4a148c",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  teamSubtitle: {
    color: "#4a148c",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "10px",
  },
  deleteButton: {
    backgroundColor: "#e53935",
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
