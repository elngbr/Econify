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
    const {
      title,
      description,
      dueDate,
      teamId,
      submissionLink,
      isLastDeliverable,
    } = req.body;

    // Verify the team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    if (isLastDeliverable) {
      // Ensure no other deliverables are marked as the last for this team
      await Deliverable.update(
        { lastDeliverable: false },
        { where: { teamId } }
      );
    }

    // Create the deliverable
    const deliverable = await Deliverable.create({
      title,
      description,
      dueDate,
      submissionLink,
      lastDeliverable: isLastDeliverable,
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

const editDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const { title, description, dueDate, submissionLink } = req.body;

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    if (new Date() > new Date(deliverable.dueDate)) {
      return res.status(403).json({
        error: "Editing deadline has passed. Deliverable cannot be modified.",
      });
    }

    await deliverable.update({ title, description, dueDate, submissionLink });

    res
      .status(200)
      .json({ message: "Deliverable updated successfully.", deliverable });
  } catch (error) {
    console.error("Error editing deliverable:", error.message);
    res.status(500).json({ error: "Server error while editing deliverable." });
  }
};

const getDeliverablesByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const deliverables = await Deliverable.findAll({
      where: { teamId },
      order: [["dueDate", "ASC"]], // Sort by due date
    });

    if (!deliverables || deliverables.length === 0) {
      return res
        .status(404)
        .json({ error: "No deliverables found for this team." });
    }

    const lastDeliverable = deliverables.find((d) => d.lastDeliverable);

    res.status(200).json({
      deliverables,
      lastDeliverableId: lastDeliverable ? lastDeliverable.id : null,
    });
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

    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    const teamId = deliverable.team.id;

    // Exclude students who are part of the team
    const potentialJurors = await User.findAll({
      where: { role: "student" },
      include: [
        {
          model: Team,
          as: "teams",
          where: { id: { [Op.ne]: teamId } }, // Exclude current team
        },
      ],
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
const deleteDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found." });
    }

    if (new Date() > new Date(deliverable.dueDate)) {
      return res.status(403).json({
        error: "Deliverable cannot be deleted as its due date has passed.",
      });
    }

    await deliverable.destroy();
    res.status(200).json({ message: "Deliverable deleted successfully." });
  } catch (error) {
    console.error("Error deleting deliverable:", error.message);
    res.status(500).json({ error: "Server error while deleting deliverable." });
  }
};

const getAllDeliverablesForProfessor = async (req, res) => {
  try {
    // Extract professor ID from the token
    const professorId = req.user.id;

    // Fetch all teams supervised by this professor
    const teams = await Team.findAll({
      where: { professorId }, // Only teams under the logged-in professor
      include: [
        {
          model: Deliverable,
          as: "deliverables",
          attributes: [
            "id",
            "title",
            "description",
            "dueDate",
            "lastDeliverable",
          ],
        },
      ],
    });

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ error: "No deliverables found for your teams." });
    }

    // Transform data for better readability
    const results = teams.map((team) => ({
      teamId: team.id,
      teamName: team.name,
      deliverables: team.deliverables,
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching deliverables for professor:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching deliverables." });
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
  editDeliverable,
  deleteDeliverable,
  getAllDeliverablesForProfessor,
};
