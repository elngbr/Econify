const { Project } = require("../db/models");

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

module.exports = { createProject };
