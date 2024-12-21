const express = require("express");
const router = express.Router();
const { Grade, Deliverable, Project, User } = require("../db/models");

// 1. Get All Grades
router.get("/", async (req, res, next) => {
  try {
    const grades = await Grade.findAll({
      include: [
        { model: Deliverable, as: "deliverable" },
        { model: User, as: "juryMember" },
      ],
    });
    res.status(200).json(grades);
  } catch (err) {
    next(err);
  }
});

// 2. Get Grade by ID
router.get("/:id", async (req, res, next) => {
  try {
    const grade = await Grade.findByPk(req.params.id, {
      include: [
        { model: Deliverable, as: "deliverable" },
        { model: User, as: "juryMember" },
      ],
    });
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }
    res.status(200).json(grade);
  } catch (err) {
    next(err);
  }
});

// 3. Create Grade
router.post("/", async (req, res, next) => {
  try {
    const { deliverableId, userId, grade, feedback } = req.body;

    // Validate the deliverable and user
    const deliverable = await Deliverable.findByPk(deliverableId);
    const user = await User.findByPk(userId);

    if (!deliverable) return res.status(400).json({ error: "Deliverable not found" });
    if (!user) return res.status(400).json({ error: "User (jury member) not found" });

    // Create the grade
    const newGrade = await Grade.create({
      deliverableId,
      userId,
      grade,
      feedback,
    });

    // Update the average grade for the deliverable
    const avgGrade = await Grade.getAverageGradeForDeliverable(deliverableId);
    await deliverable.update({ grade: avgGrade });

    // Optionally, update the project grade (average of all deliverables)
    const project = await Project.findByPk(deliverable.projectId);
    if (project) {
      const deliverables = await Deliverable.findAll({ where: { projectId: project.id } });
      const allGrades = await Promise.all(deliverables.map(async (d) => Grade.getAverageGradeForDeliverable(d.id)));
      const projectGrade = (allGrades.filter(g => g !== null).reduce((acc, g) => acc + parseFloat(g), 0) / allGrades.length).toFixed(2);
      await project.update({ grade: projectGrade });
    }

    res.status(201).json(newGrade);
  } catch (err) {
    next(err);
  }
});

// 4. Update Grade
router.put("/:id", async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    const gradeToUpdate = await Grade.findByPk(req.params.id);
    if (!gradeToUpdate) {
      return res.status(404).json({ error: "Grade not found" });
    }

    gradeToUpdate.grade = grade || gradeToUpdate.grade;
    gradeToUpdate.feedback = feedback || gradeToUpdate.feedback;
    await gradeToUpdate.save();

    // Recalculate the average grade for the deliverable
    const avgGrade = await Grade.getAverageGradeForDeliverable(gradeToUpdate.deliverableId);
    const deliverable = await Deliverable.findByPk(gradeToUpdate.deliverableId);
    await deliverable.update({ grade: avgGrade });

    // Recalculate the project grade
    const project = await Project.findByPk(deliverable.projectId);
    if (project) {
      const deliverables = await Deliverable.findAll({ where: { projectId: project.id } });
      const allGrades = await Promise.all(deliverables.map(async (d) => Grade.getAverageGradeForDeliverable(d.id)));
      const projectGrade = (allGrades.filter(g => g !== null).reduce((acc, g) => acc + parseFloat(g), 0) / allGrades.length).toFixed(2);
      await project.update({ grade: projectGrade });
    }

    res.status(200).json(gradeToUpdate);
  } catch (err) {
    next(err);
  }
});

// 5. Delete Grade
router.delete("/:id", async (req, res, next) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    await grade.destroy();

    // Recalculate the average grade for the deliverable after deleting the grade
    const avgGrade = await Grade.getAverageGradeForDeliverable(grade.deliverableId);
    const deliverable = await Deliverable.findByPk(grade.deliverableId);
    await deliverable.update({ grade: avgGrade });

    // Recalculate the project grade
    const project = await Project.findByPk(deliverable.projectId);
    if (project) {
      const deliverables = await Deliverable.findAll({ where: { projectId: project.id } });
      const allGrades = await Promise.all(deliverables.map(async (d) => Grade.getAverageGradeForDeliverable(d.id)));
      const projectGrade = (allGrades.filter(g => g !== null).reduce((acc, g) => acc + parseFloat(g), 0) / allGrades.length).toFixed(2);
      await project.update({ grade: projectGrade });
    }

    res.status(200).json({ message: "Grade deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
