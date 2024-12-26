const { Project } = require("../db/models");

const getProfessorDashboard = async (req, res) => {
  try {
    const professorId = req.user.id; // Logged-in professor's ID

    // Fetch projects created by the professor
    const projects = await Project.findAll({
      where: { userId: professorId },
      attributes: ["id", "title", "description"], // Fetch title and description
    });

    const formattedProjects = projects.map((project) => ({
      projectId: project.id,
      projectTitle: project.title,
      projectDescription: project.description,
    }));

    res.status(200).json({
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching professor dashboard:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching professor dashboard." });
  }
};

module.exports = { getProfessorDashboard };
