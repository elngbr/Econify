const { Team, Deliverable, Grade } = require("../db/models");

const getStudentDashboard = async (req, res) => {
  try {
    // Get the student’s team
    const team = await Team.findOne({
      where: { id: req.user.teamId },
      include: [
        { model: Deliverable, as: "deliverables" }, // Include deliverables for the team
      ],
    });

    if (!team) {
      return res.status(404).json({ error: "You are not part of any team." });
    }

    // Fetch deliverables and their grades (only if released)
    const deliverablesWithGrades = await Promise.all(
      team.deliverables.map(async (deliverable) => {
        if (!deliverable.released) {
          return {
            id: deliverable.id,
            title: deliverable.title,
            dueDate: deliverable.dueDate,
            gradesReleased: false, // Indicate that grades are not released yet
          };
        }

        const grades = await Grade.findAll({
          where: { deliverableId: deliverable.id },
          attributes: ["grade"],
        });

        const averageGrade =
          grades.length > 0
            ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
            : null;

        return {
          id: deliverable.id,
          title: deliverable.title,
          dueDate: deliverable.dueDate,
          gradesReleased: true, // Indicate that grades are released
          averageGrade: averageGrade,
          totalGrades: grades.length,
        };
      })
    );

    res.status(200).json({
      team: {
        id: team.id,
        name: team.name,
      },
      deliverables: deliverablesWithGrades,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching student dashboard." });
  }
};

module.exports = { getStudentDashboard };
