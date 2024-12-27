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

  const handleJoinSuccess = () => {
    fetchProjects();
    setIsJoinTeamOpen(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Dashboard</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={styles.projectList}>
          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            projects.map((project) => (
              <div key={project.projectId} style={styles.projectCard}>
                <h3>{project.projectTitle || "Untitled Project"}</h3>
                <p>
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
                        teamId={project.studentTeamId}
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
          onJoinSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  heading: { textAlign: "center", color: "#4a148c", marginBottom: "20px" },
  projectList: { display: "flex", flexWrap: "wrap", gap: "20px" },
  projectCard: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  formator: {
    color: "#4a148c",
    fontSize: "14px",
    fontStyle: "italic",
    marginTop: "10px",
  },
  buttonGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  cardButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StudentDashboard;
