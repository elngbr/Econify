const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  getAllUsers,
  getStudentsByProject,
  getUsersByTeam,
  deleteUser,
  changePassword,
  getUsersByRole,
} = require("../controllers/userController");
const { verifyToken, isProfessor, isStudent } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateUser);

// Role-specific Routes
router.get("/professor-dashboard", verifyToken, isProfessor, (req, res) => {
  res.json({ message: "Welcome, Professor!" });
});

router.get("/student-dashboard", verifyToken, isStudent, (req, res) => {
  res.json({ message: "Welcome, Student!" });
});

module.exports = router;
