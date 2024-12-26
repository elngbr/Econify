const { Project, Team, Deliverable, Grade } = require("../db/models");

const getProfessorDashboard = async (req, res) => {
  try {
    const professorId = req.user.id; // Logged-in professor's ID

    // Fetch all projects created by the professor
    const projects = await Project.findAll({
      where: { userId: professorId }, // Filter by professor's userId
      attributes: ["id", "title", "description"], // Only include necessary fields
    });

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ error: "No projects found for this professor." });
    }

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching professor dashboard:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching dashboard data." });
  }
};

module.exports = { getProfessorDashboard };
