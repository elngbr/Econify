const { Project, User } = require("../db/models");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Only professors can create projects (middleware already enforces this)
    const project = await Project.create({
      title,
      description,
      userId: req.user.id, // Assign the project to the logged-in professor
    });

    res.status(201).json({ message: "Project created successfully.", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating project." });
  }
};
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: "professor", attributes: ["name", "email"] },
      ], // Include professor details
    });

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
};
const editProject = async (req, res) => {
  try {
    const { id } = req.params; // Get project ID from URL
    const { title, description } = req.body; // Get updated fields

    // Find the project to edit
    const project = await Project.findOne({
      where: { id, userId: req.user.id }, // Ensure it belongs to the logged-in professor
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found or not owned by you." });
    }

    // Update the project fields
    project.title = title || project.title;
    project.description = description || project.description;
    await project.save();

    res.status(200).json({ message: "Project updated successfully.", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Server error while updating project." });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params; // Get project ID from URL

    // Find the project with the given ID, including the professor details
    const project = await Project.findOne({
      where: { id },
      include: [
        { model: User, as: "professor", attributes: ["name", "email"] }, // Include professor details
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error while fetching project." });
  }
};

module.exports = { createProject, getAllProjects, editProject, getProjectById };


