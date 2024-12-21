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

    // Create the deliverable
    const deliverable = await Deliverable.create({
      title,
      dueDate,
      submissionLink,
      projectId,
    });
    res.status(201).json(deliverable);
  } catch (err) {
    console.error("Error details:", err);
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({ error: err.message });
    }
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
        { model: User, as: "juryMembers" },
      ],
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
        { model: User, as: "juryMembers" },
      ],
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

    const deliverable = await Deliverable.findByPk(req.params.id);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }

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
        { model: User, as: "juryMembers" },
      ],
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
        { model: Grade, as: "grades" },
      ],
    });
    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

// 8. Get grades for a specific deliverable
router.get("/:id/grades", async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      where: { deliverableId: req.params.id },
      include: [{ model: User, as: "juryMember" }],
    });
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
});

// 9. Get jury members for a specific deliverable
router.get("/:id/jury", async (req, res, next) => {
  try {
    const deliverable = await Deliverable.findByPk(req.params.id, {
      include: [{ model: User, as: "juryMembers" }],
    });
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    res.status(200).json(deliverable.juryMembers);
  } catch (err) {
    next(err);
  }
});

// 10. Get grades given by each juror for a deliverable
router.get("/:id/grades-by-jury", async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      where: { deliverableId: req.params.id },
      include: [{ model: User, as: "juryMember" }],
    });
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
});

// 11. Get a specific deliverable of a project
router.get("/project/:projectId/deliverable/:deliverableId", async (req, res, next) => {
  try {
    const deliverable = await Deliverable.findOne({
      where: {
        projectId: req.params.projectId,
        id: req.params.deliverableId,
      },
      include: [
        { model: Project, as: "project" },
        { model: Grade, as: "grades" },
        { model: User, as: "juryMembers" },
      ],
    });
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }
    res.status(200).json(deliverable);
  } catch (err) {
    next(err);
  }
});

// 12. Get deliverables filtered by due date (optional query parameter)
router.get("/filter/by-date", async (req, res, next) => {
  try {
    const { before, after } = req.query;

    const whereClause = {};
    if (before) {
      whereClause.dueDate = { ...(whereClause.dueDate || {}), $lte: new Date(before) };
    }
    if (after) {
      whereClause.dueDate = { ...(whereClause.dueDate || {}), $gte: new Date(after) };
    }

    const deliverables = await Deliverable.findAll({
      where: whereClause,
      include: [
        { model: Project, as: "project" },
        { model: Grade, as: "grades" },
        { model: User, as: "juryMembers" },
      ],
    });
    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
