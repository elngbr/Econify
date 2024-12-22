const express = require("express");
const { verifyToken, isProfessor } = require("../middlewares/authMiddleware");
const { createProject } = require("../controllers/projectController");

const router = express.Router();

router.post("/create", verifyToken, isProfessor, createProject);

module.exports = router;
