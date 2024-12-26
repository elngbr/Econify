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
} = require("../controllers/teamController");

const router = express.Router();

// Routes for teams
router.post("/create", verifyToken, isStudent, createTeam);
router.post("/join", verifyToken, isStudent, joinTeam);
router.get("/project/:projectId", verifyToken, getTeamsByProject);
router.post("/remove-user", verifyToken, isProfessor, removeUserFromTeam);
router.delete("/:teamId", verifyToken, isProfessor, deleteTeam);

module.exports = router;
