const { Project, Team, User } = require("../db/models");

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
              where: { id: studentId }, // Filter teams with the logged-in student
              required: false, // Include all teams even if the student is not part of them
            },
          ],
        },
        {
          model: User,
          as: "professor", // Include the professor who created the project
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Format the projects to include all teams for the student
    const formattedProjects = projects.map((project) => {
      // Get all teams where the student is a member
      const studentTeams = project.teams.filter((team) =>
        team.students.some((student) => student.id === studentId)
      );

      return {
        projectId: project.id,
        projectTitle: project.title,
        projectDescription: project.description,
        formator: project.professor ? project.professor.name : "Unknown",
        isStudentInTeam: studentTeams.length > 0, // True if the student is part of any team
        studentTeams: studentTeams.map((team) => ({
          teamId: team.id,
          teamName: team.name,
        })), // Array of all teams the student is in
      };
    });

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
};

module.exports = { getStudentDashboard };
