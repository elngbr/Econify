import React, { useEffect, useState } from "react";
import api from "../../services/api";
import CreateTeam from "./CreateTeam";
import JoinTeam from "./JoinTeam";

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]); // All projects
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for modal
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false); // Modal for creating a team
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false); // Modal for joining a team

  // Fetch projects on component load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/users/student-dashboard");
        setProjects(response.data.projects || []);
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

  // Open "Create Team" modal
  const handleOpenCreateTeamForm = (projectId) => {
    setSelectedProject(projectId);
    setIsCreateTeamOpen(true);
  };

  // Close "Create Team" modal
  const handleCloseCreateTeamForm = () => {
    setIsCreateTeamOpen(false);
    setSelectedProject(null);
  };

  // Open "Join Team" modal
  const handleOpenJoinTeamForm = (projectId) => {
    setSelectedProject(projectId);
    setIsJoinTeamOpen(true);
  };

  // Close "Join Team" modal
  const handleCloseJoinTeamForm = () => {
    setIsJoinTeamOpen(false);
    setSelectedProject(null);
  };

  // Remove user from team
  const handleLeaveTeam = async (projectId) => {
    try {
      await api.post("/teams/leave", { projectId });
      alert("You have left the team successfully.");
      // Refresh projects to reflect updated team status
      const response = await api.get("/users/student-dashboard");
      setProjects(response.data.projects || []);
    } catch (error) {
      alert("Failed to leave the team. Please try again.");
      console.error("Error leaving team:", error.response?.data || error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Dashboard</h1>
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
                <p style={styles.formator}>
                  Formator: {project.formator || "Unknown"}
                </p>

                <div style={styles.buttonGroup}>
                  {/* Conditional Buttons */}
                  {project.isStudentInTeam ? (
                    <>
                      <button
                        style={styles.cardButton}
                        onClick={() => handleLeaveTeam(project.projectId)}
                      >
                        Leave Team ({project.studentTeamName})
                      </button>
                      <button
                        style={styles.cardButton}
                        onClick={() => alert("Send Deliverables functionality")}
                      >
                        Send Deliverables
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={styles.cardButton}
                        onClick={() =>
                          handleOpenCreateTeamForm(project.projectId)
                        }
                      >
                        Create Team
                      </button>
                      <button
                        style={styles.cardButton}
                        onClick={() =>
                          handleOpenJoinTeamForm(project.projectId)
                        }
                      >
                        Join Team
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateTeamOpen && (
        <CreateTeam
          projectId={selectedProject}
          onClose={handleCloseCreateTeamForm}
        />
      )}

      {/* Join Team Modal */}
      {isJoinTeamOpen && (
        <JoinTeam
          projectId={selectedProject}
          onClose={handleCloseJoinTeamForm}
        />
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
  formator: {
    color: "#4a148c",
    fontSize: "14px",
    fontStyle: "italic",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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

export default StudentDashboard;
