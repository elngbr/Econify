const express = require("express");
const { verifyToken, isProfessor } = require("../middlewares/authMiddleware");
const {
  createProject,
  getAllProjects,
  editProject,
} = require("../controllers/projectController");

const router = express.Router();

// Professors creating a project
router.post("/create", verifyToken, isProfessor, createProject);

// Fetch all projects
router.get("/", verifyToken, getAllProjects);

// Professors editing their own project
router.put("/:id", verifyToken, isProfessor, editProject);

module.exports = router;
