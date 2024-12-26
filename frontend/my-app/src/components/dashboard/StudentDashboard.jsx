import React, { useEffect, useState } from "react";
import api from "../../services/api";

const StudentDashboard = () => {
  const [myProjects, setMyProjects] = useState([]); // Projects where the student is a member
  const [otherProjects, setOtherProjects] = useState([]); // Other available projects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/users/student-dashboard");
        console.log("Projects fetched:", response.data);

        setMyProjects(response.data.projectsWithStudent || []);
        setOtherProjects(response.data.otherProjects || []);
      } catch (error) {
        console.error(
          "Error fetching student dashboard:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const joinProject = (projectId) => {
    alert(`Joining project with ID: ${projectId}`);
    // Add logic to join a project (e.g., API request to add student to a team)
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Dashboard</h1>
      {loading ? (
        <p style={styles.loading}>Loading projects...</p>
      ) : (
        <>
          <section>
            <h2 style={styles.sectionTitle}>Projects You're Part Of</h2>
            <div style={styles.projectList}>
              {myProjects.length === 0 ? (
                <p style={styles.noProjects}>
                  You are not part of any projects.
                </p>
              ) : (
                myProjects.map((project) => (
                  <div key={project.projectId} style={styles.projectCard}>
                    <h3 style={styles.projectTitle}>
                      {project.projectTitle || "Untitled Project"}
                    </h3>
                    <p style={styles.projectDescription}>
                      {project.projectDescription || "No description provided."}
                    </p>
                    <p style={styles.teamName}>
                      Team: {project.teamName || "No team name"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 style={styles.sectionTitle}>Available Projects</h2>
            <div style={styles.projectList}>
              {otherProjects.length === 0 ? (
                <p style={styles.noProjects}>No other projects available.</p>
              ) : (
                otherProjects.map((project) => (
                  <div key={project.projectId} style={styles.projectCard}>
                    <h3 style={styles.projectTitle}>
                      {project.projectTitle || "Untitled Project"}
                    </h3>
                    <p style={styles.projectDescription}>
                      {project.projectDescription || "No description provided."}
                    </p>
                    <button
                      style={styles.joinButton}
                      onClick={() => joinProject(project.projectId)}
                    >
                      Join Project
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
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
  sectionTitle: {
    color: "#4a148c",
    fontSize: "18px",
    marginBottom: "10px",
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
  teamName: {
    color: "#4a148c",
    fontSize: "14px",
    fontStyle: "italic",
    marginBottom: "10px",
  },
  joinButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default StudentDashboard;
