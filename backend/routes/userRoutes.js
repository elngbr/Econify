const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

// Create a new user (either a student or professor)
router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming request body

    const { name, email, password, role } = req.body;

    // Validate role
    if (role !== "student" && role !== "professor") {
      return res
        .status(400)
        .json({ error: "Role must be 'student' or 'professor'" });
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
    console.error("Error creating user:", err); // Detailed error log
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
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

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user by ID (Full update using PUT)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate role
    if (role && role !== "student" && role !== "professor") {
      return res
        .status(400)
        .json({ error: "Role must be 'student' or 'professor'" });
    }

    // Check if the email is already taken by another user (skip if it's the same user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Update the user data
    await user.update({ name, email, password, role });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Patch a user by ID (Partial update)
router.patch("/:id", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check for individual fields to update and validate them
    if (role && role !== "student" && role !== "professor") {
      return res
        .status(400)
        .json({ error: "Role must be 'student' or 'professor'" });
    }

    // Check if the email is already taken by another user (skip if it's the same user)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Update only the fields provided (partial update)
    const updatedUser = await user.update({
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      role: role || user.role,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error patching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send(); // No content after successful deletion
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
