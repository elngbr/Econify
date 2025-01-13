const { Project, Team, Deliverable, User } = require("../db/models");

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

const getProfessorProjectStats = async (req, res) => {
  try {
    console.log("Fetching stats for professor:", req.user.id);

    const professorId = req.user.id;

    const projects = await Project.findAll({
      where: { userId: professorId },
      attributes: ["id", "title"],
      include: [
        {
          model: Team,
          as: "teams",
          attributes: ["id", "name"],
          include: [
            { model: Deliverable, as: "deliverables", attributes: ["id"] },
            { model: User, as: "students", attributes: ["id"] },
          ],
        },
      ],
    });

    console.log("Projects fetched:", projects);

    const formattedData = projects.map((project) => {
      const teams = project.teams.map((team) => ({
        teamId: team.id,
        teamName: team.name,
        deliverableCount: team.deliverables.length,
        memberCount: team.students.length,
      }));

      return {
        projectId: project.id,
        projectTitle: project.title,
        teamCount: teams.length,
        deliverablesCount: teams.reduce(
          (sum, team) => sum + team.deliverableCount,
          0
        ),
        teams,
      };
    });

    console.log("Formatted data:", formattedData);

    res.status(200).json({ projects: formattedData });
  } catch (error) {
    console.error("Error in getProfessorProjectStats:", error.message);
    res
      .status(500)
      .json({ error: "Server error while fetching project statistics." });
  }
};

module.exports = { getProfessorDashboard, getProfessorProjectStats };
