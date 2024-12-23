const express = require("express");
const { verifyToken, isStudent, isProfessor } = require("../middlewares/authMiddleware");
const {
  createDeliverable,
  getDeliverablesByTeam,
  assignJuryToDeliverable,
  submitGrade,
  getDeliverableGrades,
  getTeamMembersByDeliverable,releaseDeliverableGrades
} = require("../controllers/deliverableController");

const router = express.Router();

// Deliverable routes
router.post("/create", verifyToken, isStudent, createDeliverable);
router.get("/team/:teamId", verifyToken, getDeliverablesByTeam);
router.post("/assign-jury", verifyToken, isProfessor, assignJuryToDeliverable);
router.post("/grade", verifyToken, isStudent, submitGrade);
router.get("/:deliverableId/grades", verifyToken, getDeliverableGrades);
router.get("/:deliverableId/team-members", verifyToken, getTeamMembersByDeliverable);
router.put("/:deliverableId/release", verifyToken, isProfessor, releaseDeliverableGrades);


module.exports = router;
