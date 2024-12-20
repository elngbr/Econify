const express = require("express");
const { Project, User } = require("../db/models");
const router = express.Router();

// Middleware to check if the user is a student
const isStudent = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ error: "Only students can create projects" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error checking student role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new project (only for students)
router.post("/", isStudent, async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    // Create a new project linked to the student (userId)
    const project = await Project.create({
      title,
      description,
      userId,
    });

    res.status(201).json(project);  // Return the created project
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);  // Return all projects
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get projects by userId (only students can have projects)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Ensure the user exists and is a student
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ error: "User is not a student" });
    }

    // Fetch projects linked to the userId
    const projects = await Project.findAll({ where: { userId } });
    res.status(200).json(projects);  // Return the user's projects
  } catch (err) {
    console.error("Error fetching projects by userId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a project (only the user who created it can update it)
router.patch("/:id", async (req, res) => {
  const projectId = req.params.id;
  const { title, description, userId } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is authorized to update the project
    if (project.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this project" });
    }

    // Update the project fields
    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    res.status(200).json(project);  // Return the updated project
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **PUT**: Replace a project entirely (only the user who created it can update it)
router.put("/:id", async (req, res) => {
  const projectId = req.params.id;
  const { title, description, userId } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is authorized to update the project
    if (project.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this project" });
    }

    // Replace the entire project with the new data
    project.title = title;
    project.description = description;

    await project.save();

    res.status(200).json(project);  // Return the replaced project
  } catch (err) {
    console.error("Error replacing project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a project (only the user who created it can delete it)
router.delete("/:id", async (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is authorized to delete the project
    if (project.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this project" });
    }

    await project.destroy();  // Delete the project
    res.status(200).json({ message: "Project deleted successfully" });  // Return success message
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Routes for user-specific project operations

// Create a project for a specific user
router.post("/users/:userId/projects", async (req, res) => {
  const { userId } = req.params;
  const { title, description } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new project linked to the user (userId)
    const project = await Project.create({
      title,
      description,
      userId,
    });

    res.status(201).json(project);  // Return the created project
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all projects for a specific user
router.get("/users/:userId/projects", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all projects for the user
    const projects = await Project.findAll({ where: { userId } });
    res.status(200).json(projects);  // Return the user's projects
  } catch (err) {
    console.error("Error fetching user's projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific project of a user
router.get("/users/:userId/projects/:projectId", async (req, res) => {
  const { userId, projectId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await Project.findOne({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found for this user" });
    }

    res.status(200).json(project);  // Return the project
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific project of a user
router.put("/users/:userId/projects/:projectId", async (req, res) => {
  const { userId, projectId } = req.params;
  const { title, description } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await Project.findOne({ where: { id: projectId, userId } });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Replace the entire project with the new data
    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    res.status(200).json(project);  // Return the updated project
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a specific project of a user
router.delete("/users/:userId/projects/:projectId", async (req, res) => {
  const { userId, projectId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await Project.findOne({ where: { id: projectId, userId } });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.destroy();  // Delete the project
    res.status(200).json({ message: "Project deleted successfully" });  // Return success message
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete all projects of a user
router.delete("/users/:userId/projects", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Project.destroy({ where: { userId } });  // Delete all projects linked to this user
    res.status(200).json({ message: "All projects deleted successfully" });  // Return success message
  } catch (err) {
    console.error("Error deleting user's projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
