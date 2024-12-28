const express = require("express");
const {
  verifyToken,
  isStudent,
  isProfessor,
} = require("../middlewares/authMiddleware");
const {
  createDeliverable,
  getDeliverablesByTeam,
  assignJuryToDeliverable,
  submitGrade,
  editDeliverable,
  getDeliverableGrades,
  getTeamMembersByDeliverable,
  releaseDeliverableGrades,
  deleteDeliverable,
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

module.exports = router;
