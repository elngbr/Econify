import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ProfessorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/users/professor-dashboard");
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleViewTeams = (projectId) => {
    navigate(`/projects/${projectId}/teams`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/edit`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Professor Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.createButton}
          onClick={() => navigate("/create-project")}
        >
          Create Project
        </button>
      </div>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.projectList}>
          {projects.map((project) => (
            <div key={project.projectId} style={styles.projectCard}>
              <h2 style={styles.projectTitle}>{project.projectTitle}</h2>
              <p style={styles.projectDescription}>
                {project.projectDescription}
              </p>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.cardButton}
                  onClick={() => handleEditProject(project.projectId)}
                >
                  Edit
                </button>
                <button
                  style={styles.cardButton}
                  onClick={() => handleViewTeams(project.projectId)}
                >
                  View Teams
                </button>
              </div>
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
