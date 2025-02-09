const { Team, Project, User } = require("../db/models");

// Controller for creating a team
const createTeam = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    // Ensure only students can create teams
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can create teams." });
    }

    // Check if the project exists
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

    // Check if the team name already exists for the project
    const duplicateTeam = await Team.findOne({ where: { name, projectId } });
    if (duplicateTeam) {
      return res.status(400).json({ error: "Team name already exists." });
    }

    // Create the team
    const team = await Team.create({ name, projectId });

    // Add the user who created the team to the team
    const user = await User.findByPk(req.user.id);
    await team.addStudent(user); // Use Sequelize's addStudent method

    res
      .status(201)
      .json({
        message: "Team created successfully, and you are now part of it.",
        team,
      });
  } catch (error) {
    console.error("Error creating team:", error.message);
    res.status(500).json({ error: "Server error while creating team." });
  }
};

// Controller for joining a team
const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user.id;

    // Check if teamId is provided
    if (!teamId) {
      return res.status(400).json({ error: "Team ID is required." });
    }

    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }],
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Check if user is already in a team for the same project
    const existingMembership = await Team.findOne({
      include: [
        {
          model: User,
          as: "students",
          where: { id: userId },
        },
        {
          model: Project,
          as: "project",
          where: { id: team.projectId },
        },
      ],
    });

    if (existingMembership) {
      return res.status(400).json({
        error: "You are already part of a team for this project.",
      });
    }

    const user = await User.findByPk(userId);
    await team.addStudent(user); // Add user to the team

    res.status(200).json({ message: "Successfully joined the team.", team });
  } catch (error) {
    console.error("Error joining team:", error.message);
    res.status(500).json({ error: "Server error while joining the team." });
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
    const { projectId, teamId } = req.body;
    const userId = req.user.id;

    // Find the team the user is part of
    const team = await Team.findOne({
      where: { id: teamId },
      include: [
        {
          model: Project,
          as: "project",
          where: { id: projectId },
        },
        {
          model: User,
          as: "students",
          where: { id: userId },
        },
      ],
    });

    if (!team) {
      return res
        .status(404)
        .json({ error: "Team not found or user not in the team." });
    }

    // Remove the user from the team
    const user = await User.findByPk(userId);
    await team.removeStudent(user); // This removes the association in the UserTeams table

    res.status(200).json({ message: "Successfully left the team." });
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
    const { teamId, userId } = req.body;

    // Check if the team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Check if the user is part of the team
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMember = await team.hasStudent(user);
    if (!isMember) {
      return res
        .status(400)
        .json({ error: "User is not a member of this team." });
    }

    // Remove the user from the team
    await team.removeStudent(user);

    res.json({
      message: `User ${userId} removed from team ${team.id} successfully.`,
    });
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
