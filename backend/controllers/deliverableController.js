const {
  Deliverable,
  Team,
  Project,
  User,
  DeliverableJury,
  Grade,
} = require("../db/models");
const { Op } = require("sequelize");

const createDeliverable = async (req, res) => {
  try {
    const { title, description, dueDate, teamId, submissionLink } = req.body;

    console.log(`Received createDeliverable request with teamId: ${teamId}`);
    console.log(`Submission Link: ${submissionLink}`);

    // Ensure the submissionLink is provided
    if (!submissionLink) {
      return res.status(400).json({
        error: "Submission link is required.",
      });
    }

    // Verify the team exists
    const team = await Team.findByPk(teamId, {
      include: [{ model: Project, as: "project" }],
    });

    if (!team) {
      console.log(`Team with ID ${teamId} not found.`);
      return res.status(404).json({ error: "Team not found." });
    }

    // Ensure the user is part of the team
    const isUserInTeam = await team.hasStudent(req.user.id);
    if (!isUserInTeam) {
      return res.status(403).json({ error: "You do not belong to this team." });
    }

    // Check for duplicate deliverables in the same team
    const existingDeliverable = await Deliverable.findOne({
      where: { title, teamId },
    });

    if (existingDeliverable) {
      return res
        .status(400)
        .json({ error: "A deliverable with this title already exists." });
    }

    // Create deliverable
    const deliverable = await Deliverable.create({
      title,
      description,
      dueDate,
      submissionLink,
      teamId,
    });

    res
      .status(201)
      .json({ message: "Deliverable created successfully.", deliverable });
  } catch (error) {
    console.error("Error creating deliverable:", error.message);
    res.status(500).json({ error: "Server error while creating deliverable." });
  }
};

const getDeliverablesByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const deliverables = await Deliverable.findAll({
      where: { teamId },
    });

    if (!deliverables || deliverables.length === 0) {
      return res
        .status(404)
        .json({ error: "No deliverables found for this team." });
    }

    res.status(200).json({ deliverables });
  } catch (error) {
    console.error("Error fetching deliverables by team:", error.message);
    res.status(500).json({ error: "Error fetching deliverables." });
  }
};

const assignJuryToDeliverable = async (req, res) => {
  try {
    const { deliverableId, jurySize } = req.body;

    const deliverable = await Deliverable.findByPk(deliverableId, {
      include: [{ model: Team, as: "team" }],
    });

    if (!deliverable)
      return res.status(404).json({ error: "Deliverable not found." });

    const teamId = deliverable.team.id;

    const potentialJurors = await User.findAll({
      where: { role: "student", teamId: { [Op.ne]: teamId } },
    });

    if (potentialJurors.length < jurySize) {
      return res
        .status(400)
        .json({ error: "Not enough students to assign as jurors." });
    }

    const selectedJurors = potentialJurors
      .sort(() => Math.random() - 0.5)
      .slice(0, jurySize);

    const juryAssignments = selectedJurors.map((juror) => ({
      userId: juror.id,
      deliverableId,
    }));

    await DeliverableJury.bulkCreate(juryAssignments);

    res.status(201).json({
      message: "Jury assigned successfully.",
      jurors: selectedJurors.map((juror) => ({
        id: juror.id,
        name: juror.name,
      })),
    });
  } catch (error) {
    console.error("Error assigning jury:", error.message);
    res.status(500).json({ error: "Server error while assigning jury." });
  }
};

const submitGrade = async (req, res) => {
  try {
    const { deliverableId, grade, feedback } = req.body;

    const juryMember = await DeliverableJury.findOne({
      where: { userId: req.user.id, deliverableId },
    });

    if (!juryMember) {
      return res
        .status(403)
        .json({ error: "You are not authorized to grade this deliverable." });
    }

    const existingGrade = await Grade.findOne({
      where: { userId: req.user.id, deliverableId },
    });

    if (existingGrade) {
      existingGrade.grade = grade;
      existingGrade.feedback = feedback;
      await existingGrade.save();
    } else {
      await Grade.create({
        deliverableId,
        userId: req.user.id,
        grade,
        feedback,
      });
    }

    res.status(201).json({ message: "Grade submitted successfully." });
  } catch (error) {
    console.error("Error submitting grade:", error.message);
    res.status(500).json({ error: "Server error while submitting grade." });
  }
};

const getDeliverableGrades = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId);

    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    if (!deliverable.released) {
      return res
        .status(403)
        .json({ error: "Grades for this deliverable are not yet released." });
    }

    const grades = await Grade.findAll({
      where: { deliverableId },
      attributes: ["grade"],
    });

    if (grades.length === 0) {
      return res
        .status(404)
        .json({ error: "No grades found for this deliverable." });
    }

    const averageGrade =
      grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;

    res.status(200).json({
      averageGrade: averageGrade.toFixed(2),
      totalGrades: grades.length,
    });
  } catch (error) {
    console.error("Error fetching deliverable grades:", error.message);
    res.status(500).json({ error: "Server error while fetching grades." });
  }
};

const getTeamMembersByDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId, {
      include: {
        model: Team,
        as: "team",
        include: {
          model: User,
          as: "students",
          attributes: ["id", "name", "email"],
        },
      },
    });

    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    const team = deliverable.team;

    if (!team) {
      return res
        .status(404)
        .json({ error: "No team found for this deliverable." });
    }

    res.status(200).json({
      teamId: team.id,
      teamName: team.name,
      members: team.students,
    });
  } catch (error) {
    console.error("Error fetching team members:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching team members." });
  }
};
const releaseDeliverableGrades = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId);

    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    // Toggle the 'released' status
    deliverable.released = !deliverable.released;
    await deliverable.save();

    res.status(200).json({
      message: `Deliverable grades ${
        deliverable.released ? "released" : "hidden"
      } successfully.`,
      deliverable,
    });
  } catch (error) {
    console.error("Error releasing grades:", error.message);
    res.status(500).json({ error: "Server error while releasing grades." });
  }
};

module.exports = {
  createDeliverable,
  getDeliverablesByTeam,
  assignJuryToDeliverable,
  submitGrade,
  getDeliverableGrades,
  getTeamMembersByDeliverable,
  releaseDeliverableGrades,
};
