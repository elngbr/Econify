const express = require("express");

const router = express.Router();

// Mock Data
let grades = [
  { id: 1, studentId: 202, deliverableId: 1, grade: 85 },
];

// Get All Grades
router.get("/", (req, res) => {
  res.json(grades);
});

// Get Grade by ID
router.get("/:id", (req, res) => {
  const grade = grades.find((g) => g.id === parseInt(req.params.id));
  if (!grade) {
    return res.status(404).json({ error: "Grade not found" });
  }
  res.json(grade);
});

// Create Grade
router.post("/", (req, res) => {
  const { studentId, deliverableId, grade } = req.body;
  const newGrade = {
    id: grades.length + 1,
    studentId,
    deliverableId,
    grade,
  };
  grades.push(newGrade);
  res.status(201).json(newGrade);
});

// Update Grade
router.put("/:id", (req, res) => {
  const grade = grades.find((g) => g.id === parseInt(req.params.id));
  if (!grade) {
    return res.status(404).json({ error: "Grade not found" });
  }
  const { studentId, deliverableId, grade: newGradeValue } = req.body;
  grade.studentId = studentId || grade.studentId;
  grade.deliverableId = deliverableId || grade.deliverableId;
  grade.grade = newGradeValue || grade.grade;
  res.json(grade);
});

// Delete Grade
router.delete("/:id", (req, res) => {
  const index = grades.findIndex((g) => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Grade not found" });
  }
  grades.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
