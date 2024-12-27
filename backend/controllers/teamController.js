const { Team, Project, User } = require("../db/models");

// Controller for creating a team
const createTeam = async (req, res) => {
  try {
    const { name, projectId } = req.body;
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can create teams." });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Check if the student is already in a team for this project
    const existingTeam = await Team.findOne({
      where: { projectId },
      include: [{ model: User, as: "students", where: { id: req.user.id } }],
    });

    if (existingTeam) {
      return res
        .status(400)
        .json({ error: "You are already part of a team for this project." });
    }

    const duplicateTeam = await Team.findOne({ where: { name, projectId } });
    if (duplicateTeam) {
      return res.status(400).json({ error: "Team name already exists." });
    }

    const team = await Team.create({ name, projectId });
    const user = await User.findByPk(req.user.id);
    user.teamId = team.id;
    await user.save();

    res.status(201).json({ message: "Team created successfully.", team });
  } catch (error) {
    console.error("Error creating team:", error.message);
    res.status(500).json({ error: "Server error while creating team." });
  }
};

// Controller for joining a team
const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "Team ID is required." });
    }

    // Find the team and include its associated project
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }], // Correct alias for Project
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Find the user and include their current team
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Team,
          as: "team", // Correct alias for the user's current team
          include: [{ model: Project, as: "project" }], // Include the project for validation
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user is already in a team for the same project
    if (
      user.team &&
      user.team.project &&
      user.team.project.id === team.project.id
    ) {
      return res
        .status(400)
        .json({ error: "You are already part of a team for this project." });
    }

    // Assign the user to the new team
    user.teamId = teamId;
    await user.save();

    res.status(200).json({ message: "Successfully joined the team." });
  } catch (error) {
    console.error("Error joining team:", error.message);
    res.status(500).json({ error: "Server error while joining team." });
  }
};

const getTeamsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const teams = await Team.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: "students", // Correct alias for students
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!teams || teams.length === 0) {
      console.log(`No teams found for project ID ${projectId}.`);
      return res.status(200).json({ teams: [] });
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    res.status(500).json({ error: "Server error while fetching teams." });
  }
};

const leaveTeam = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    const team = await Team.findOne({
      include: [
        { model: Project, as: "project", where: { id: projectId } },
        { model: User, as: "students", where: { id: userId } },
      ],
    });

    if (!team) {
      return res
        .status(404)
        .json({ error: "You are not part of a team for this project." });
    }

    const user = await User.findByPk(userId);
    user.teamId = null;
    await user.save();

    res.status(200).json({ message: "You have left the team successfully." });
  } catch (error) {
    console.error("Error leaving team:", error.message);
    res.status(500).json({ error: "Server error while leaving the team." });
  }
};

// Controller to delete a team
const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ error: "Team not found." });
    await team.destroy();
    res.json({ message: "Team deleted successfully." });
  } catch (error) {
    console.error("Error deleting team:", error.message);
    res.status(500).json({ error: "Server error while deleting team." });
  }
};
// Controller to get all members of a team
const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          as: "students",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    res.status(200).json({ members: team.students });
  } catch (error) {
    console.error("Error fetching team members:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching team members." });
  }
};

// Controller to remove a member from a team
const removeUserFromTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user || !user.teamId) {
      return res
        .status(404)
        .json({ error: "User not found or not in a team." });
    }
    user.teamId = null; // Remove user from the team
    await user.save();
    res.json({ message: "User removed from the team successfully." });
  } catch (error) {
    console.error("Error removing user from team:", error.message);
    res
      .status(500)
      .json({ error: "Server error while removing user from team." });
  }
};

module.exports = {
  createTeam,
  joinTeam,
  getTeamsByProject,
  removeUserFromTeam,
  deleteTeam,
  getTeamMembers,
  removeUserFromTeam,
  leaveTeam,
};
