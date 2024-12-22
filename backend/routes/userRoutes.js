const express = require("express");
const { registerUser, loginUser, getProfile, updateUser } = require("../controllers/userController");
const { verifyToken, isProfessor, isStudent } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser); // Register as student or professor
router.post("/login", loginUser); // Login and get a token

// Protected Routes
router.get("/profile", verifyToken, getProfile); // Get user profile
router.put("/profile", verifyToken, updateUser); // Update user details

// Example of role-specific endpoints
router.get("/professor-dashboard", verifyToken, isProfessor, (req, res) => {
  res.json({ message: "Welcome, Professor!" });
});

router.get("/student-dashboard", verifyToken, isStudent, (req, res) => {
  res.json({ message: "Welcome, Student!" });
});

module.exports = router;
