const { Project, Team, User } = require("../db/models");

const getStudentDashboard = async (req, res) => {
  try {
    // Fetch all projects and include professor details
    const allProjects = await Project.findAll({
      include: [
        {
          model: User,
          as: "professor", // Alias for the professor who created the project
          attributes: ["name"], // Include only the professor's name
        },
      ],
    });

    const formattedProjects = allProjects.map((project) => ({
      projectId: project.id,
      projectTitle: project.title,
      projectDescription: project.description,
      formator: project.professor?.name || "Unknown", // Display professor's name
    }));

    res.status(200).json({
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching student dashboard." });
  }
};

module.exports = { getStudentDashboard };
