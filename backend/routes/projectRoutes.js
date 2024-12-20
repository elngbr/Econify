const express = require("express");
const router = express.Router();
const { Project, User } = require("../db/models");

// Create a project
router.post("/", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Check if the user exists and is a student
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(400).json({ error: "User is not a student" });
    }

    // Create the project
    const project = await Project.create({ title, description, userId });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
