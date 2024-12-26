import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditProject = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`); // Fetch project details
        console.log("Fetched project:", response.data);

        // Check response structure and set the project state
        if (response.data && response.data.project) {
          setProject({
            title: response.data.project.title || "",
            description: response.data.project.description || "",
          });
        } else {
          console.error("Unexpected response structure:", response.data);
          alert("Failed to load project details.");
        }
      } catch (error) {
        console.error(
          "Error fetching project:",
          error.response?.data || error.message
        );
        alert("Error fetching project details.");
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/projects/${id}`, project); // Update project
      console.log("Project updated:", response.data);
      alert("Project updated successfully!");
      navigate("/professor-dashboard");
    } catch (error) {
      console.error(
        "Error updating project:",
        error.response?.data || error.message
      );
      alert("Failed to update project.");
    }
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Edit Project</h2>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProject;
