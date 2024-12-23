const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");
const { getProfessorDashboard } = require("../controllers/professorController");
const { getStudentDashboard } = require("../controllers/studentController"); // Import the student dashboard controller
const { verifyToken, isProfessor, isStudent } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", verifyToken, getProfile);

// Role-Specific Routes
router.get("/student-dashboard", verifyToken, isStudent, getStudentDashboard); // Updated for student dashboard
router.get("/professor-dashboard", verifyToken, isProfessor, getProfessorDashboard);

module.exports = router;
