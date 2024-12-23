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
        console.log("Fetching professor projects...");
        const response = await api.get("/users/professor-dashboard");
        console.log("Projects fetched:", response.data.projects);
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const viewProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Professor Dashboard</h1>
      {loading ? (
        <p style={styles.loading}>Loading projects...</p>
      ) : (
        <div style={styles.projectList}>
          {projects.length === 0 ? (
            <p style={styles.noProjects}>No projects found.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <h2 style={styles.projectTitle}>{project.title}</h2>
                <p style={styles.projectDescription}>{project.description}</p>
                <button
                  style={styles.detailsButton}
                  onClick={() => viewProjectDetails(project.id)}
                >
                  View Details
                </button>
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
    backgroundColor: "#f3f2fc", // Light purple
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#4a148c", // Dark purple
    marginBottom: "20px",
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
    backgroundColor: "#fff", // White
    border: "1px solid #d1c4e9", // Light border
    borderRadius: "10px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  projectTitle: {
    color: "#4a148c", // Dark purple
    marginBottom: "10px",
  },
  projectDescription: {
    color: "#616161", // Gray
    marginBottom: "15px",
  },
  detailsButton: {
    backgroundColor: "#4a148c", // Dark purple
    color: "#fff", // White
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ProfessorDashboard;
