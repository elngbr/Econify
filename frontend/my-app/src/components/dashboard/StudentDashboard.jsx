import React, { useEffect, useState } from "react";
import api from "../../services/api";
import CreateTeam from "./CreateTeam";
import JoinTeam from "./JoinTeam";
import LeaveTeam from "./LeaveTeam";
import SendDeliverable from "./SendDeliverable";

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]); // All projects
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false); // Confirmation modal state

  // Fetch projects on component load
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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open and close modals
  const handleOpenCreateTeamForm = (projectId) => {
    setSelectedProject(projectId);
    setIsCreateTeamOpen(true);
  };

  const handleCloseCreateTeamForm = () => {
    setIsCreateTeamOpen(false);
    setSelectedProject(null);
  };

  const handleOpenJoinTeamForm = (projectId) => {
    setSelectedProject(projectId);
    setIsJoinTeamOpen(true);
  };

  const handleCloseJoinTeamForm = () => {
    setIsJoinTeamOpen(false);
    setSelectedProject(null);
  };

  // Handle Join Team Success
  const handleJoinSuccess = () => {
    fetchProjects(); // Refresh projects
    setIsJoinTeamOpen(false); // Close the Join Team modal
    setConfirmationModal(true); // Show confirmation modal
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
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
                  {project.isStudentInTeam ? (
                    <>
                      <LeaveTeam
                        projectId={project.projectId}
                        refreshDashboard={fetchProjects}
                      />
                      <SendDeliverable
                        projectId={project.projectId}
                        refreshDashboard={fetchProjects}
                      />
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

      {isCreateTeamOpen && (
        <CreateTeam
          projectId={selectedProject}
          onClose={handleCloseCreateTeamForm}
        />
      )}

      {isJoinTeamOpen && (
        <JoinTeam
          projectId={selectedProject}
          onClose={handleCloseJoinTeamForm}
          onJoinSuccess={handleJoinSuccess} // Trigger success callback
        />
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Successfully joined the team!</h3>
            <button
              style={styles.confirmButton}
              onClick={closeConfirmationModal}
            >
              OK
            </button>
          </div>
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
    textAlign: "center",
    width: "300px",
  },
  confirmButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StudentDashboard;
