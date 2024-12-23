const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");
const { getProfessorDashboard } = require("../controllers/professorController"); // Import the professor dashboard controller
const { verifyToken, isProfessor, isStudent } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", verifyToken, getProfile);

// Role-Specific Routes
router.get("/student-dashboard", verifyToken, isStudent, async (req, res) => {
  res.json({ message: "Welcome, Student!" });
});

// Updated route for Professor Dashboard
router.get("/professor-dashboard", verifyToken, isProfessor, getProfessorDashboard); // Use the controller here

module.exports = router;
