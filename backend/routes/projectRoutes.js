const express = require("express");
const router = express.Router();
const { Project } = require("../db/models");

//post:new project
router.post("/", async (req, res, next) => {
  try {
    const { title, description, link, createdBy } = req.body;
    const project = await Project.create({
      title,
      description,
      link,
      createdBy,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if(!project)
      {
        res.status(404).json({message:"Project not found!"});
      }
      else{
        res.status(200).json(project);
      }
     
    } catch (err) {
      next(err);
    }
  });
  

  module.exports=router;