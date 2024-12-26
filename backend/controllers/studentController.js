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
        formator: project.formator,
        isStudentInTeam: !!studentTeam, // True if the student is in a team
        studentTeamName: studentTeam ? studentTeam.name : null, // Team name or null
      };
    });

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
};

module.exports = { getStudentDashboard };
