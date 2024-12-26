import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/users/professor-dashboard");
        console.log("Projects fetched:", response.data);
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error(
          "Error fetching professor dashboard:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleViewTeams = (projectId) => {
    navigate(`/projects/${projectId}/teams`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Professor Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.createButton}
          onClick={() => navigate("/create-project")}
        >
          Create New Project
        </button>
      </div>
      {loading ? (
        <p style={styles.loading}>Loading projects...</p>
      ) : (
        <div style={styles.projectList}>
          {projects.length === 0 ? (
            <p style={styles.noProjects}>No projects available.</p>
          ) : (
            projects.map((project) => (
              <div key={project.projectId} style={styles.projectCard}>
                <h3 style={styles.projectTitle}>
                  {project.projectTitle || "Untitled Project"}
                </h3>
                <p style={styles.projectDescription}>
                  {project.projectDescription || "No description provided."}
                </p>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cardButton}
                    onClick={() => handleEditProject(project.projectId)}
                  >
                    Edit Project
                  </button>
                  <button
                    style={styles.cardButton}
                    onClick={() => handleViewTeams(project.projectId)}
                  >
                    View Teams
                  </button>
                </div>
              </div>
            ))
          )}
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
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  createButton: {
    padding: "10px 20px",
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#4a148c",
  },
  projectList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  noProjects: {
    textAlign: "center",
    color: "#4a148c",
  },
  projectCard: {
    backgroundColor: "#fff",
    border: "1px solid #d1c4e9",
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  projectTitle: {
    color: "#4a148c",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  projectDescription: {
    color: "#616161",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
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
};

export default ProfessorDashboard;
