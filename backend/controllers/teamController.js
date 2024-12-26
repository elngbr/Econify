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

    console.log("teamId received:", teamId);
    console.log("User from token:", req.user);

    // Check if team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }],
    });
    if (!team) {
      console.log(`Team with ID ${teamId} not found.`);
      return res.status(404).json({ error: "Team not found." });
    }

    // Check if user exists
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log(`User with ID ${req.user.id} not found.`);
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user is already in a team
    if (user.teamId) {
      console.log(`User with ID ${req.user.id} is already in a team.`);
      return res.status(400).json({ error: "You are already in a team." });
    }

    // Assign the user to the team
    user.teamId = teamId;
    await user.save();

    console.log(`User ${user.id} successfully joined team ${teamId}.`);
    res.json({ message: "Successfully joined the team." });
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
          as: "students",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Return an empty array if no teams are found
    if (!teams || teams.length === 0) {
      console.log(`No teams found for project ID ${projectId}.`);
      return res.status(200).json({ teams: [] }); // Send empty array as response
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    res.status(500).json({ error: "Server error while fetching teams." });
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
};
