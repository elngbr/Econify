const express = require("express");
const router = express.Router();
const { Deliverable } = require("../db/models");

router.post("/", async (req, res, next) => {
  try {
    const { name, dueDate, videoUrl, projectId } = req.body;
    const deliverable = await Deliverable.create({
      name,
      dueDate,
      videoUrl,
      projectId,
    });
    res.status(201).json(deliverable);
  } catch (err) {
    next(err);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const deliverables = await Deliverable.findAll();

    res.status(200).json(deliverables);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const deliverable = await Deliverable.findByPk(req.params.id);
    if (!deliverable) {
      res.status(404).json({ message: "Deliverable not found!" });
    } else {
      res.status(200).json(deliverable);
    }
  } catch (err) {
    next(err);
  }
});


module.exports=router;