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

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const viewProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Professor Dashboard</h1>
      <button className="create-button" onClick={handleCreateProject}>
        Create New Project
      </button>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="project-list">
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <button onClick={() => viewProjectDetails(project.id)}>
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

export default ProfessorDashboard;
