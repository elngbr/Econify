const { Project, Team, User } = require("../db/models");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const projects = await Project.findAll({
      include: [
        {
          model: Team,
          as: "teams",
          include: [
            {
              model: User,
              as: "students",
              where: { id: studentId }, // Check if the student is in this team
              required: false,
            },
          ],
        },
        {
          model: User, // Include the professor who created the project
          as: "professor", // Keep the alias as "professor"
          attributes: ["id", "name", "email"], // Fetch professor details
        },
      ],
    });

    const formattedProjects = projects.map((project) => {
      const studentTeam = project.teams.find((team) =>
        team.students.some((student) => student.id === studentId)
      );
      return {
        projectId: project.id,
        projectTitle: project.title,
        projectDescription: project.description,
        formator: project.professor ? project.professor.name : "Unknown", // Rename "professor" to "formator"
        isStudentInTeam: !!studentTeam,
        studentTeamName: studentTeam ? studentTeam.name : null,
      };
    });

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
};

module.exports = { getStudentDashboard };
