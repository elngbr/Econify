const { Deliverable, Team, Project } = require("../db/models");

const createDeliverable = async (req, res) => {
  try {
    const { title, description, dueDate, teamId } = req.body;

    // Verify the team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }],
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Ensure the user is part of the team
    if (req.user.teamId !== team.id) {
      return res.status(403).json({ error: "You do not belong to this team." });
    }

    // Create deliverable
    const deliverable = await Deliverable.create({
      title,
      description,
      dueDate,
      teamId,
    });

    res.status(201).json({ message: "Deliverable created successfully.", deliverable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating deliverable." });
  }
};
const getDeliverablesByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const deliverables = await Deliverable.findAll({
      where: { teamId },
    });

    if (!deliverables) {
      return res.status(404).json({ error: "No deliverables found for this team." });
    }

    res.status(200).json({ deliverables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching deliverables." });
  }
};
const getDeliverablesByProject = async (req, res) => {
  try {
      const { projectId } = req.params;
      const deliverables = await Deliverable.findAll({
          include: {
              model: Team,
              where: { projectId },
          },
      });
      res.status(200).json(deliverables);
  } catch (error) {
      res.status(500).json({ error: "Error fetching deliverables by project." });
  }
};

const getDeliverablesForUser = async (req, res) => {
  try {
      const { userId } = req.params;
      const teams = await Team.findAll({ where: { userId } });
      const teamIds = teams.map((team) => team.id);
      const deliverables = await Deliverable.findAll({
          where: { teamId: teamIds },
      });
      res.status(200).json(deliverables);
  } catch (error) {
      res.status(500).json({ error: "Error fetching deliverables for user." });
  }
};
const getDeliverablesDueSoon = async (req, res) => {
  try {
      const { days } = req.query; // e.g., ?days=7
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(days));
      const deliverables = await Deliverable.findAll({
          where: { dueDate: { [Op.lte]: dueDate } },
      });
      res.status(200).json(deliverables);
  } catch (error) {
      res.status(500).json({ error: "Error fetching deliverables due soon." });
  }
};

module.exports = { createDeliverable, getDeliverablesByTeam , getDeliverablesByProject,getDeliverablesDueSoon,getDeliverablesForUser};
