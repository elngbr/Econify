const express = require("express");
const { verifyToken, isStudent } = require("../middlewares/authMiddleware");
const { joinTeam } = require("../controllers/joinTeam");

const router = express.Router();

router.post("/join", verifyToken, isStudent, joinTeam);
// router.post("/create", verifyToken, isStudent, createTeam);

module.exports = router;
