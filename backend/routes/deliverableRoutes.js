const express = require("express");
const {
  verifyToken,
  isStudent,
  isProfessor,
} = require("../middlewares/authMiddleware");
const {

  getProfessorGradesForDeliverable,
  getStudentGradesForDeliverable,
  createDeliverable,
  getDeliverablesByTeam,
  assignJuryToDeliverable,
  submitGrade,
  editDeliverable,
  getDeliverableGrades,
  getTeamMembersByDeliverable,
  releaseDeliverableGrades,
  deleteDeliverable,
  getAllDeliverablesForProfessor,
  getDeliverablesAssignedToStudent, // New function to get student-specific deliverables
} = require("../controllers/deliverableController");

const router = express.Router();

// Deliverable routes
router.post("/create", verifyToken, isStudent, createDeliverable);
router.get("/team/:teamId", verifyToken, getDeliverablesByTeam);
router.post("/assign-jury", verifyToken, isProfessor, assignJuryToDeliverable);
router.post("/grade", verifyToken, isStudent, submitGrade);
router.get("/:deliverableId/grades", verifyToken, getDeliverableGrades);
router.get(
  "/:deliverableId/team-members",
  verifyToken,
  getTeamMembersByDeliverable
);
router.put(
  "/:deliverableId/release",
  verifyToken,
  isProfessor,
  releaseDeliverableGrades
);
router.put("/edit/:deliverableId", verifyToken, isStudent, editDeliverable);
router.delete("/:deliverableId", verifyToken, isStudent, deleteDeliverable);
router.get(
  "/professor/deliverables",
  verifyToken,
  isProfessor,
  getAllDeliverablesForProfessor
);
// router.get(
//   "/:deliverableId/jury-assigned",
//   verifyToken,
//   isProfessor,
//   checkIfJuryAssigned
// );

// New route for fetching deliverables assigned to a student
router.get(
  "/assigned",
  verifyToken,
  isStudent,
  getDeliverablesAssignedToStudent
);
router.get(
  "/:deliverableId/professor-grades",
  verifyToken,
  isProfessor,
  getProfessorGradesForDeliverable
);
router.get(
  "/:deliverableId/student-grades",
  verifyToken,
  isStudent,
  getStudentGradesForDeliverable
);

module.exports = router;
