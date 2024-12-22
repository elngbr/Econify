const express = require("express");
const { verifyToken, isStudent , isProfessor } = require("../middlewares/authMiddleware");
const { createTeam, joinTeam } = require("../controllers/teamController");

const router = express.Router();

// Student creating or joining a team
router.post("/join", verifyToken, isStudent, joinTeam);
// If professors or other roles are allowed to create teams, you can add a route here as well
router.post("/create", verifyToken, isProfessor, createTeam);

module.exports = router;
