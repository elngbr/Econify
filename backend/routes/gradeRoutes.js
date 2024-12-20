// routes/gradeRoutes.js
const express = require("express");
const router = express.Router();
const { Grade, Deliverable, User } = require("../db/models");

// Submit a grade for a deliverable
router.post("/", async (req, res) => {
  try {
    const { value, juryId, deliverableId } = req.body;

    const deliverable = await Deliverable.findByPk(deliverableId);
    const jury = await User.findByPk(juryId);

    if (!deliverable || !jury) {
      return res.status(400).json({ error: "Invalid deliverable ID or jury ID" });
    }

    const grade = await Grade.create({ value, juryId, deliverableId });
    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
