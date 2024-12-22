const { Team, Project, User, DeliverableJury, Deliverable } = require("../db/models");

// Controller for creating a team
const createTeam = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    // Check if the user is already part of a team
    if (req.user.teamId) {
      return res.status(400).json({ error: "You are already part of a team." });
    }

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Create the team
    const team = await Team.create({
      name,
      projectId, // Team is associated with a project
    });

    // Assign the user (the creator) to the team
    req.user.teamId = team.id;
    await req.user.save();

    res.status(201).json({
      message: "Team created successfully.",
      team: {
        id: team.id,
        name: team.name,
        projectId: team.projectId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating team." });
  }
};

// Controller for joining a team
const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    // Check if the team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }] // Eager load the associated project
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    const project = team.project;

    // Check if the user is already part of a team
    if (req.user.teamId) {
      return res.status(400).json({ error: "You are already part of a team." });
    }

    // Check if the user is part of the jury for this project
    const isJuryMember = await DeliverableJury.findOne({
      where: {
        userId: req.user.id,
        "$deliverable.team.projectId$": project.id,
      },
      include: [{
        model: Deliverable,
        as: "deliverable",
        include: [{ model: Team, as: "team", include: [{ model: Project, as: "project" }] }]
      }]
    });

    if (isJuryMember) {
      return res.status(403).json({
        error: "You cannot join a team for this project because you're part of the jury."
      });
    }

    // Assign the user to the team
    req.user.teamId = teamId;
    await req.user.save();

    res.json({ message: "Successfully joined the team.", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while joining team." });
  }
};

module.exports = { createTeam, joinTeam };
