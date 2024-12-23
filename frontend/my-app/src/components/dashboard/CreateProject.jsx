import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/projects/create", {
        title,
        description,
      });
      console.log("Project created:", response.data);
      alert("Project created successfully!");
      navigate("/professor-dashboard");
    } catch (error) {
      console.error(
        "Error creating project:",
        error.response?.data || error.message
      );
      alert("Failed to create project. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Create New Project</h2>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter project title"
          />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter project description"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
