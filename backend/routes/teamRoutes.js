const express = require("express");
const {
  verifyToken,
  isStudent,
  isProfessor,
} = require("../middlewares/authMiddleware");
const {
  createTeam,
  joinTeam,
  getTeamsByProject,
  removeUserFromTeam,
  deleteTeam,
  getTeamMembers,
  leaveTeam
} = require("../controllers/teamController");

const router = express.Router();

// Routes for teams
router.post("/create", verifyToken, isStudent, createTeam);
router.post("/join", verifyToken, isStudent, joinTeam);
router.get("/project/:projectId", verifyToken, getTeamsByProject);

router.delete("/:teamId", verifyToken, isProfessor, deleteTeam);
router.get("/:teamId/members", verifyToken, getTeamMembers);
router.post("/remove-user", verifyToken, isProfessor, removeUserFromTeam);
router.post("/leave", verifyToken, isStudent, leaveTeam);


module.exports = router;
