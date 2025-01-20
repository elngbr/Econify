import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import CreateTeam from "./CreateTeam";
import JoinTeam from "./JoinTeam";
import LeaveTeam from "./LeaveTeam";
import SendDeliverable from "./SendDeliverable";

const ITEMS_PER_PAGE = 3; // Number of projects per page

const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE); // Total pages

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await api.get("/users/student-dashboard");
      const projects = response.data.projects || [];

      const projectsWithDeliverables = await Promise.all(
        projects.map(async (project) => {
          const studentTeamsWithDeliverables = await Promise.all(
            project.studentTeams.map(async (team) => {
              try {
                const deliverablesResponse = await api.get(
                  `/deliverables/team/${team.teamId}`
                );
                const deliverables =
                  deliverablesResponse.data.deliverables || [];

                const lastDeliverable = deliverables.find(
                  (d) => d.lastDeliverable
                );

                const currentDate = new Date();

                return {
                  ...team,
                  deliverables, // Ensure deliverables is always an array
                  lastDeliverableId: lastDeliverable?.id || null,
                  lastDeliverablePassed: lastDeliverable
                    ? new Date(lastDeliverable.dueDate) < currentDate
                    : false,
                };
              } catch (error) {
                console.error(
                  `Error fetching deliverables for team ${team.teamId}:`,
                  error.response?.data || error.message
                );
                return {
                  ...team,
                  deliverables: [], // Default to an empty array on error
                  lastDeliverableId: null,
                  lastDeliverablePassed: false,
                };
              }
            })
          );
          return { ...project, studentTeams: studentTeamsWithDeliverables };
        })
      );

      setProjects(projectsWithDeliverables);
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Dashboard</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div>
          <div style={styles.projectList}>
            {currentProjects.length === 0 ? (
              <p>No projects available.</p>
            ) : (
              currentProjects.map((project) => (
                <div key={project.projectId} style={styles.projectCard}>
                  <h3>{project.projectTitle || "Untitled Project"}</h3>
                  <p>
                    {project.projectDescription || "No description provided."}
                  </p>
                  <p style={styles.formator}>
                    Formator: {project.formator || "Unknown"}
                  </p>

                  {project.isStudentInTeam ? (
                    <div>
                      <h4>Your Teams:</h4>
                      {project.studentTeams.map((team) => (
                        <div key={team.teamId} style={styles.teamSection}>
                          <p>Team Name: {team.teamName}</p>

                          {/* Show the 'Leave Team' and 'View Deliverables' buttons */}
                          <LeaveTeam
                            projectId={project.projectId}
                            teamId={team.teamId}
                            refreshDashboard={() => fetchProjects()}
                          />

                          {team.deliverables?.length > 0 ||
                          !team.lastDeliverablePassed ? (
                            <SendDeliverable
                              projectId={project.projectId}
                              teamId={team.teamId}
                            />
                          ) : (
                            <p>
                              No deliverables available. You can create one.
                            </p>
                          )}
                          <button
                            style={styles.cardButton}
                            onClick={() =>
                              navigate(`/deliverables/team/${team.teamId}`)
                            }
                          >
                            View Deliverables
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.cardButton}
                        onClick={() =>
                          setSelectedProject(project.projectId) ||
                          setIsCreateTeamOpen(true)
                        }
                      >
                        Create Team
                      </button>
                      <button
                        style={styles.cardButton}
                        onClick={() =>
                          setSelectedProject(project.projectId) ||
                          setIsJoinTeamOpen(true)
                        }
                      >
                        Join Team
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              style={styles.pageButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isCreateTeamOpen && (
        <CreateTeam
          projectId={selectedProject}
          onClose={() => setIsCreateTeamOpen(false)}
        />
      )}
      {isJoinTeamOpen && (
        <JoinTeam
          projectId={selectedProject}
          onClose={() => setIsJoinTeamOpen(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  heading: { textAlign: "center", color: "#4a148c", marginBottom: "20px" },
  projectList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center", // Center horizontally
    alignItems: "flex-start", // Align items at the top
    gap: "20px", // Maintain spacing between cards
  },

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
  teamSection: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    borderRadius: "5px",
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  pageButton: {
    padding: "10px 15px",
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0 5px",
  },
  pageInfo: {
    fontWeight: "bold",
    color: "#4a148c",
  },
};

export default StudentDashboard;
