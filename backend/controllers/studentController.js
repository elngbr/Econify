const { Project, Team, User } = require("../db/models");
const { Op } = require("sequelize");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id; // Logged-in student's ID

    // Step 1: Fetch teams where the student is a member
    const teamsWithStudent = await Team.findAll({
      include: [
        {
          model: User,
          as: "students", // Use the correct alias here
          where: { id: studentId }, // Check if the student is a member
        },
        {
          model: Project,
          as: "project",
          attributes: ["id", "title", "description"], // Include project details
        },
      ],
    });

    // Extract projects where the student is part of a team
    const projectsWithStudent = teamsWithStudent.map((team) => ({
      projectId: team.project.id,
      projectTitle: team.project.title,
      projectDescription: team.project.description,
      teamId: team.id,
      teamName: team.name,
    }));

    // Step 2: Fetch all other projects excluding those the student is already part of
    const projectIdsWithStudent = projectsWithStudent.map(
      (project) => project.projectId
    );

    const otherProjects = await Project.findAll({
      where: {
        id: { [Op.notIn]: projectIdsWithStudent },
      },
      attributes: ["id", "title", "description"], // Include relevant fields
    });

    const formattedOtherProjects = otherProjects.map((project) => ({
      projectId: project.id,
      projectTitle: project.title,
      projectDescription: project.description,
    }));

    // Step 3: Respond with both categories
    res.status(200).json({
      projectsWithStudent,
      otherProjects: formattedOtherProjects,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res.status(500).json({
      error: "Server error while fetching student dashboard.",
    });
  }
};

module.exports = { getStudentDashboard };
