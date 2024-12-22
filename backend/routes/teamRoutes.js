const express = require("express");
const router = express.Router();
const { Team, User, Project } = require("../db/models");

// 1. Create a new team
router.post("/", async (req, res, next) => {
  try {
    const { name, studentIds } = req.body;

    // Create the team
    const team = await Team.create({ name });

    // Add members (students) to the team
    if (studentIds && studentIds.length > 0) {
      await User.update({ teamId: team.id }, { where: { id: studentIds } });
    }

    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
});

// 2. Get all teams
router.get("/", async (req, res, next) => {
  try {
    const teams = await Team.findAll({ include: [{ model: User, as: "members" }] });
    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
});

// 3. Get a specific team by ID
router.get("/:id", async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id, { include: [{ model: User, as: "members" }] });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json(team);
  } catch (err) {
    next(err);
  }
});

// 4. Update a team
router.put("/:id", async (req, res, next) => {
  try {
    const { name, studentIds } = req.body;

    // Find the team
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Update team name
    if (name) {
      team.name = name;
      await team.save();
    }

    // Update members if provided
    if (studentIds) {
      // Reset existing members
      await User.update({ teamId: null }, { where: { teamId: team.id } });

      // Assign new members
      await User.update({ teamId: team.id }, { where: { id: studentIds } });
    }

    res.status(200).json(team);
  } catch (err) {
    next(err);
  }
});

// 5. Delete a team
router.delete("/:id", async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Unassign all members
    await User.update({ teamId: null }, { where: { teamId: team.id } });

    // Delete the team
    await team.destroy();
    res.status(200).json({ message: "Team deleted" });
  } catch (err) {
    next(err);
  }
});

// 6. Get teams by project
router.get("/project/:projectId", async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: Project, as: "projects", where: { id: req.params.projectId } },
        { model: User, as: "members" },
      ],
    });
    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
});

// 7. Assign a team to a project
router.post("/project/:projectId", async (req, res, next) => {
  try {
    const { teamId } = req.body;

    // Check if team and project exist
    const team = await Team.findByPk(teamId);
    const project = await Project.findByPk(req.params.projectId);

    if (!team || !project) {
      return res.status(404).json({ error: "Team or project not found" });
    }

    // Associate team with the project
    await project.addTeam(team);

    res.status(200).json({ message: "Team assigned to project" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
