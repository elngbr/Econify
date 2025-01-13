const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  getCurrentTeamForProject,
} = require("../controllers/userController");
const {
  getProfessorDashboard,
  getProfessorProjectStats,
} = require("../controllers/professorController");
const { getStudentDashboard } = require("../controllers/studentController");
const {
  verifyToken,
  isProfessor,
  isStudent,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", verifyToken, getProfile);

// Role-Specific Routes
// Role-Specific Routes
router.get("/student-dashboard", verifyToken, isStudent, getStudentDashboard);
// Fetch professor project stats (new route)
router.get(
  "/professor/project-stats", // Define the route
  verifyToken, // Ensure the user is authenticated
  isProfessor, // Ensure the user is a professor
  getProfessorProjectStats // Call the new controller
);

router.get(
  "/professor-dashboard",
  verifyToken,
  isProfessor,
  getProfessorDashboard
);
router.get(
  "/current-team/:projectId",
  verifyToken,
  isStudent,
  getCurrentTeamForProject
);

module.exports = router;
