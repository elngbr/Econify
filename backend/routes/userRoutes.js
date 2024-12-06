// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

// Create a new user (either a student or professor)
router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Log incoming request body

    const { name, email, password, role } = req.body;

    // Validate role
    if (role !== "student" && role !== "professor") {
      return res.status(400).json({ error: "Role must be 'student' or 'professor'" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user in the database
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);  // Detailed error log
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.findAll({ where: { role: "student" } });
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all professors
router.get("/professors", async (req, res) => {
  try {
    const professors = await User.findAll({ where: { role: "professor" } });
    res.status(200).json(professors);
  } catch (err) {
    console.error("Error fetching professors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
