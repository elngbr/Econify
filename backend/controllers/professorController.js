const { Project, Team, Deliverable, Grade } = require("../db/models");

const getProfessorDashboard = async (req, res) => {
  try {
    const professorId = req.user.id; // Logged-in professor's ID

    // Fetch all projects created by the professor
    const projects = await Project.findAll({
      where: { userId: professorId },
      include: [
        {
          model: Team,
          as: "teams",
          include: [
            {
              model: Deliverable,
              as: "deliverables",
              include: [
                {
                  model: Grade,
                  as: "grades",
                  attributes: ["grade"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: "No projects found for this professor." });
    }

    // Format the data to include average grades for deliverables
    const formattedProjects = projects.map((project) => ({
      projectId: project.id,
      projectTitle: project.title,
      projectDescription: project.description,
      teams: project.teams.map((team) => ({
        teamId: team.id,
        teamName: team.name,
        deliverables: team.deliverables.map((deliverable) => {
          const grades = deliverable.grades.map((g) => g.grade);
          const averageGrade =
            grades.length > 0
              ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(2)
              : null;

          return {
            deliverableId: deliverable.id,
            title: deliverable.title,
            description: deliverable.description,
            dueDate: deliverable.dueDate,
            averageGrade,
            gradesCount: grades.length,
          };
        }),
      })),
    }));

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching professor dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching dashboard data." });
  }
};

module.exports = { getProfessorDashboard };
