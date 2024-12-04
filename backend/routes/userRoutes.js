const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

router.post("/", async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({ name, email, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ message: "The user does not exist!" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
