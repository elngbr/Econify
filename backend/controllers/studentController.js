const { Project, Team, User, Deliverable } = require("../db/models");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch all projects, their teams, and associated professor
    const projects = await Project.findAll({
      include: [
        {
          model: Team,
          as: "teams",
          include: [
            {
              model: User,
              as: "students",
              where: { id: studentId },
              required: false,
            },
            {
              model: Deliverable, // Include deliverables for each team
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
        },
        {
          model: User,
          as: "professor",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Format the response
    const formattedProjects = projects.map((project) => {
      const studentTeams = project.teams.filter((team) =>
        team.students.some((student) => student.id === studentId)
      );

      return {
        projectId: project.id,
        projectTitle: project.title,
        projectDescription: project.description,
        formator: project.professor ? project.professor.name : "Unknown",
        isStudentInTeam: studentTeams.length > 0,
        studentTeams: studentTeams.map((team) => ({
          teamId: team.id,
          teamName: team.name,
          deliverables: team.deliverables || [],
          lastDeliverableId:
            team.deliverables?.find((d) => d.lastDeliverable)?.id || null,
        })),
      };
    });

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
};

module.exports = { getStudentDashboard };
