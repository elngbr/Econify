// routes/deliverableRoutes.js
const express = require("express");
const router = express.Router();
const { Deliverable, Project, User } = require("../db/models");

// Create a new deliverable
router.post("/", async (req, res) => {
  try {
    const { title, dueDate, projectId } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const deliverable = await Deliverable.create({ title, dueDate, projectId });
    res.status(201).json(deliverable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assign jury members to deliverable
router.post("/:id/jury", async (req, res) => {
  try {
    const { juryIds } = req.body;
    const deliverable = await Deliverable.findByPk(req.params.id);

    if (!deliverable) {
      return res.status(400).json({ error: "Invalid deliverable ID" });
    }

    for (const juryId of juryIds) {
      const user = await User.findByPk(juryId);
      if (!user || user.role !== "professor") {
        return res.status(400).json({ error: `Invalid jury ID: ${juryId}` });
      }
      await deliverable.addJuryMember(user);
    }

    res.status(200).json({ message: "Jury members assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
