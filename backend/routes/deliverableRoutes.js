const express = require("express");
const router = express.Router();
const { Deliverable, Project, Grade, User } = require("../db/models");

// 1. Create a new deliverable
router.post("/", async (req, res, next) => {
  try {
    const { title, dueDate, submissionLink, projectId } = req.body;
    
    // Check if the project exists before creating the deliverable
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ error: "Project not found" });
    }

    const deliverable = await Deliverable.create({ title, dueDate, submissionLink, projectId });
    res.status(201).json(deliverable);
  } catch (err) {
    next(err);
  }
});

// 2. Get all deliverables
router.get("/", async (req, res, next) => {
  try {
    const deliverables = await Deliverable.findAll({
      include: [
        { model: Project, as: "project" },
        { model: Grade, as: "grades" },
        { model: User, as: "juryMembers" }
      ]
    });
    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

// 3. Get a deliverable by ID
router.get("/:id", async (req, res, next) => {
  try {
    const deliverable = await Deliverable.findByPk(req.params.id, {
      include: [
        { model: Project, as: "project" },
        { model: Grade, as: "grades" },
        { model: User, as: "juryMembers" }
      ]
    });
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    res.status(200).json(deliverable);
  } catch (err) {
    next(err);
  }
});

// 4. Update a deliverable
router.put("/:id", async (req, res, next) => {
  try {
    const { title, dueDate, submissionLink, projectId } = req.body;

    // Find the deliverable to update
    const deliverable = await Deliverable.findByPk(req.params.id);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }

    // Update fields only if they are provided in the request
    deliverable.title = title || deliverable.title;
    deliverable.dueDate = dueDate || deliverable.dueDate;
    deliverable.submissionLink = submissionLink || deliverable.submissionLink;
    deliverable.projectId = projectId || deliverable.projectId;

    await deliverable.save();
    res.status(200).json(deliverable);
  } catch (err) {
    next(err);
  }
});

// 5. Delete a deliverable
router.delete("/:id", async (req, res, next) => {
  try {
    const deliverable = await Deliverable.findByPk(req.params.id);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    await deliverable.destroy();
    res.status(200).json({ message: "Deliverable deleted" });
  } catch (err) {
    next(err);
  }
});

// 6. Get deliverables by project ID
router.get("/project/:projectId", async (req, res, next) => {
  try {
    const deliverables = await Deliverable.findAll({
      where: { projectId: req.params.projectId },
      include: [
        { model: Project, as: "project" },
        { model: Grade, as: "grades" },
        { model: User, as: "juryMembers" }
      ]
    });
    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

// 7. Get deliverables by jury member (user)
router.get("/jury/:userId", async (req, res, next) => {
  try {
    const deliverables = await Deliverable.findAll({
      include: [
        { model: User, as: "juryMembers", where: { id: req.params.userId } },
        { model: Project, as: "project" },
        { model: Grade, as: "grades" }
      ]
    });
    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
