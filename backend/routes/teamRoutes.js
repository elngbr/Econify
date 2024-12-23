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

// Student creating or joining a team
router.post("/join", verifyToken, isStudent, joinTeam);

// Professors can create a team
router.post("/create", verifyToken, isStudent, createTeam);

// Professors fetching all teams for a specific project
router.get("/project/:projectId", verifyToken, isProfessor, getTeamsByProject);

// Professors removing a user from a team
router.post("/remove-user", verifyToken, isProfessor, removeUserFromTeam);

// Professors deleting a team
router.delete("/:teamId", verifyToken, isProfessor, deleteTeam);

module.exports = router;
