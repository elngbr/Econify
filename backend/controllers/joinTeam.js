const { Team, User } = require("../db/models");

const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    // Check if the team exists
    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ error: "Team not found." });

    // Check if the user is already in a team
    if (req.user.teamId) {
      return res.status(400).json({ error: "You are already part of a team." });
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

module.exports = { joinTeam };
