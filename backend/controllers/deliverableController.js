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
      projectId, // Add projectId here
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
      projectId, // Include projectId here
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

    // Check if team exists first
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    const deliverables = await Deliverable.findAll({
      where: { teamId },
      order: [["dueDate", "ASC"]],
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
    console.error("Error fetching deliverables for team:", error.message);
    res.status(500).json({ error: "Error fetching deliverables." });
  }
};

const assignJuryToDeliverable = async (req, res) => {
  try {
    const { deliverableId, jurySize } = req.body;

    // Fetch deliverable and its team
    const deliverable = await Deliverable.findByPk(deliverableId, {
      include: [{ model: Team, as: "team" }],
    });

    if (!deliverable)
      return res.status(404).json({ error: "Deliverable not found." });

    if (!deliverable.team)
      return res
        .status(400)
        .json({ error: "Deliverable is not associated with a valid team." });

    const teamId = deliverable.team.id;
    console.log("Deliverable Team ID:", teamId);

    // Fetch potential jurors
    const potentialJurors = await User.findAll({
      where: {
        role: "student", // Only students
      },
      include: [
        {
          model: Team,
          as: "teams",
          through: { attributes: [] }, // Exclude join table attributes
          where: {
            id: { [Op.ne]: teamId }, // Exclude same team
          },
          required: false, // Allow students without any teams
        },
      ],
    });

    console.log(
      "Potential Jurors Found:",
      potentialJurors.map((j) => j.name)
    );

    if (potentialJurors.length < jurySize) {
      console.error("Juror Count:", potentialJurors.length);
      return res
        .status(400)
        .json({ error: "Not enough students to assign as jurors." });
    }

    // Select jurors and assign them
    const selectedJurors = potentialJurors
      .sort(() => Math.random() - 0.5)
      .slice(0, jurySize);

    const juryAssignments = selectedJurors.map((juror) => ({
      userId: juror.id,
      deliverableId,
    }));

    await DeliverableJury.bulkCreate(juryAssignments);

    deliverable.isAssigned = true;
    await deliverable.save();

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

const getDeliverablesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { teamId } = req.params; // Team ID is passed in the request

    // Verify that the student is part of the specified team
    const team = await Team.findOne({
      where: { id: teamId },
      include: {
        model: User,
        as: "students",
        where: { id: studentId },
      },
    });

    if (!team) {
      return res.status(403).json({
        error: "You are not a member of this team or the team does not exist.",
      });
    }

    // Fetch deliverables for the team
    const deliverables = await Deliverable.findAll({
      where: { teamId },
      include: [
        {
          model: Grade,
          as: "grades",
        },
      ],
    });

    if (!deliverables || deliverables.length === 0) {
      return res.status(404).json({
        error: "No deliverables found for this team.",
      });
    }

    // Map deliverables to include grading status
    const formattedDeliverables = deliverables.map((deliverable) => ({
      id: deliverable.id,
      title: deliverable.title,
      description: deliverable.description,
      dueDate: deliverable.dueDate,
      isAssigned: deliverable.isAssigned,
      grades: deliverable.grades.map((grade) => ({
        grade: grade.grade || "Not graded yet",
        feedback: grade.feedback || "No feedback provided",
      })),
    }));

    res.status(200).json({ deliverables: formattedDeliverables });
  } catch (error) {
    console.error("Error fetching deliverables for student:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching deliverables." });
  }
};

module.exports = { getDeliverablesForStudent };

const submitGrade = async (req, res) => {
  try {
    const { deliverableId, grade, feedback } = req.body;

    // Check if the user is authorized to grade this deliverable
    const juryMember = await DeliverableJury.findOne({
      where: { userId: req.user.id, deliverableId },
    });

    if (!juryMember) {
      return res
        .status(403)
        .json({ error: "You are not authorized to grade this deliverable." });
    }

    // Check if a grade already exists
    const existingGrade = await Grade.findOne({
      where: { userId: req.user.id, deliverableId },
    });

    if (existingGrade) {
      // Update the existing grade
      existingGrade.grade = grade;
      existingGrade.feedback = feedback;
      await existingGrade.save();
      res.status(200).json({ message: "Grade updated successfully." });
    } else {
      // Create a new grade entry
      await Grade.create({
        deliverableId,
        userId: req.user.id,
        grade,
        feedback,
      });
      res.status(201).json({ message: "Grade submitted successfully." });
    }
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
const getDeliverablesAssignedToStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get all deliverables assigned to the student
    const juryAssignments = await DeliverableJury.findAll({
      where: { userId: studentId },
      include: [
        {
          model: Deliverable,
          as: "deliverable",
          include: [
            {
              model: Team,
              as: "team",
              include: [
                {
                  model: Project,
                  as: "project",
                  attributes: ["id", "title", "userId"],
                  include: [
                    {
                      model: User,
                      as: "professor",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!juryAssignments || juryAssignments.length === 0) {
      return res
        .status(404)
        .json({ error: "No deliverables assigned to you." });
    }

    // Transform the result to include grade and feedback
    const deliverables = await Promise.all(
      juryAssignments.map(async (juryAssignment) => {
        const deliverable = juryAssignment.deliverable;

        // Fetch grade and feedback if already submitted
        const gradeEntry = await Grade.findOne({
          where: {
            userId: studentId,
            deliverableId: deliverable.id,
          },
          attributes: ["grade", "feedback"],
        });

        return {
          deliverableId: deliverable.id,
          title: deliverable.title,
          description: deliverable.description,
          dueDate: deliverable.dueDate,
          projectTitle: deliverable.team.project.title,
          teamName: deliverable.team.name,
          professorName: deliverable.team.project.professor.name,
          submissionLink: deliverable.submissionLink,
          grade: gradeEntry?.grade || "No Grade",
          feedback: gradeEntry?.feedback || "No Feedback",
        };
      })
    );

    res.status(200).json({ deliverables });
  } catch (error) {
    console.error(
      "Error fetching deliverables assigned to student:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Server error while fetching deliverables." });
  }
};
const checkIfJuryAssigned = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const assignedJury = await DeliverableJury.findOne({
      where: { deliverableId },
    });

    if (assignedJury) {
      return res.status(200).json({ juryAssigned: true });
    }

    return res.status(200).json({ juryAssigned: false });
  } catch (error) {
    console.error("Error checking jury assignment:", error.message);
    res.status(500).json({ error: "Error checking jury assignment." });
  }
};
const getProfessorGradesForDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const professorId = req.user.id; // Extract professor ID from token

    // Fetch the deliverable along with associated grades and jury members
    const deliverable = await Deliverable.findOne({
      where: { id: deliverableId },
      include: [
        {
          model: Team,
          as: "team",
          include: [
            {
              model: Project,
              as: "project",
              attributes: ["id", "title", "userId"], // Validate project ownership
              where: { userId: professorId }, // Ensure the professor owns this project
            },
          ],
        },
        {
          model: Grade,
          as: "grades", // Correct alias for Grade
          include: [
            {
              model: User,
              as: "juryMember", // Correct alias for User in Grade model
              attributes: ["id", "name", "email"], // Fetch jury member details
            },
          ],
        },
      ],
    });

    // Check if the deliverable exists and is associated with the professor's project
    if (!deliverable) {
      return res
        .status(404)
        .json({ error: "Deliverable not found or unauthorized access." });
    }

    // Send the grades and associated jury members
    res.status(200).json({ grades: deliverable.grades });
  } catch (error) {
    console.error("Error fetching grades for professor:", error.message);
    res.status(500).json({ error: "Server error while fetching grades." });
  }
};
const getStudentGradesForDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params; // Deliverable ID from the request params
    const studentId = req.user.id; // Extract student ID from the authenticated user

    // Fetch the deliverable along with its team and grades
    const deliverable = await Deliverable.findOne({
      where: { id: deliverableId },
      include: [
        {
          model: Team,
          as: "team",
          include: [
            {
              model: User,
              as: "students",
              where: { id: studentId }, // Ensure the student is part of the team
              attributes: ["id", "name"], // Fetch student details
            },
          ],
        },
        {
          model: Grade,
          as: "grades",
          include: [
            {
              model: User,
              as: "juryMember", // Include jury member details
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    // Check if the deliverable exists and the student is authorized
    if (!deliverable) {
      return res.status(404).json({
        error: "Deliverable not found or you are not authorized to view it.",
      });
    }

    // Return the grades
    res.status(200).json({
      deliverableId: deliverable.id,
      deliverableTitle: deliverable.title,
      grades: deliverable.grades.map((grade) => ({
        juryMember: grade.juryMember.name,
        grade: grade.grade || "Not graded yet",
        feedback: grade.feedback || "No feedback provided",
      })),
    });
  } catch (error) {
    console.error("Error fetching grades for student:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching deliverable grades." });
  }
};

module.exports = {
  getStudentGradesForDeliverable,
  getProfessorGradesForDeliverable,
  checkIfJuryAssigned,
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
  getDeliverablesAssignedToStudent,
};
