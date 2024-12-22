const express = require("express");
const { verifyToken, isProfessor } = require("../middlewares/authMiddleware");
const { createProject, getAllProjects } = require("../controllers/projectController");

const router = express.Router();

// Professors creating a project
router.post("/create", verifyToken, isProfessor, createProject);
// Fetch all projects
router.get("/", verifyToken, getAllProjects);

module.exports = router;
