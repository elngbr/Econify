const express = require("express");
const { verifyToken, isProfessor } = require("../middlewares/authMiddleware");
const {
  createProject,
  getAllProjects,
  editProject,
  getProjectById, // Import the new controller
} = require("../controllers/projectController");

const router = express.Router();

// Professors creating a project
router.post("/create", verifyToken, isProfessor, createProject);

// Fetch all projects
router.get("/", verifyToken, getAllProjects);

// Fetch a single project by ID
router.get("/:id", verifyToken, getProjectById);

// Professors editing their own project
router.put("/:id", verifyToken, isProfessor, editProject);

module.exports = router;
