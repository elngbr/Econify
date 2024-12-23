const {
  Team,
  Project,
  User,
  DeliverableJury,
  Deliverable,
} = require("../db/models");

// Controller for creating a team
const createTeam = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    // Check if the user is a student
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ error: "Only students are allowed to create teams." });
    }

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Check if the user is already part of a team in this project
    const existingTeam = await Team.findOne({
      where: { projectId },
      include: [{ model: User, as: "students", where: { id: req.user.id } }],
    });

    if (existingTeam) {
      return res.status(400).json({
        error:
          "You are already part of a team in this project and cannot create another.",
      });
    }

    // Ensure the team name is unique within the project
    const duplicateTeam = await Team.findOne({ where: { name, projectId } });
    if (duplicateTeam) {
      return res.status(400).json({
        error: "A team with this name already exists in the project.",
      });
    }

    // Create the team
    const team = await Team.create({
      name,
      projectId,
    });

    // Assign the user (the creator) to the team
    const user = await User.findByPk(req.user.id);
    user.teamId = team.id;
    await user.save();

    res.status(201).json({
      message: "Team created successfully.",
      team: {
        id: team.id,
        name: team.name,
        projectId: team.projectId,
      },
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

    // Check if the team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }],
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
      where: { userId: req.user.id },
      include: [
        {
          model: Deliverable,
          as: "deliverable",
          include: [
            {
              model: Team,
              as: "team",
              include: [
                { model: Project, as: "project", where: { id: project.id } },
              ],
            },
          ],
        },
      ],
    });

    if (isJuryMember) {
      return res.status(403).json({
        error:
          "You cannot join a team for this project because you're part of the jury.",
      });
    }

    // Ensure the team is not full (e.g., max 5 members per team)
    const teamMembersCount = await User.count({ where: { teamId } });
    const maxMembers = project.maxTeamSize || 5; // Assuming `maxTeamSize` is defined in the project
    if (teamMembersCount >= maxMembers) {
      return res.status(400).json({ error: "The team is already full." });
    }

    // Assign the user to the team
    const user = await User.findByPk(req.user.id);
    user.teamId = teamId;
    await user.save();

    res.json({
      message: "Successfully joined the team.",
      team: {
        id: team.id,
        name: team.name,
        projectId: team.projectId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while joining team." });
  }
};
const getTeamsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch all teams associated with the specific project
    const teams = await Team.findAll({
      where: { projectId },
      include: [
        { model: Project, as: "project" }, // Include associated project data
        { model: User, as: "students" }, // Include team members, if applicable
      ],
    });

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ error: "No teams found for this project." });
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams for the project." });
  }
};
// Controller to remove a user from a team
const removeUserFromTeam = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user || !user.teamId) {
      return res
        .status(404)
        .json({ error: "User not found or not part of a team." });
    }

    user.teamId = null; // Remove user from the team
    await user.save();

    res.status(200).json({ message: "User removed from the team." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while removing user from the team." });
  }
};

// Controller to delete a team
const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findByPk(teamId);

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    await team.destroy(); // Delete the team

    res.status(200).json({ message: "Team deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while deleting team." });
  }
};

module.exports = {
  createTeam,
  joinTeam,
  getTeamsByProject,
  removeUserFromTeam,
  deleteTeam,
};
