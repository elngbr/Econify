import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../../services/api"; 

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ProfessorStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching data from /professor/project-stats...");
        const response = await api.get("/users/professor/project-stats");
        console.log("Response Data:", response.data);

        const projects = response.data.projects;

        if (projects && projects.length > 0) {
          const projectTitles = projects.map((project) => project.projectTitle);
          const teamCounts = projects.map((project) => project.teamCount);
          const deliverablesCounts = projects.map(
            (project) => project.deliverablesCount
          );
          const memberCounts = projects.map((project) =>
            project.teams.reduce((sum, team) => sum + team.memberCount, 0)
          );

          setChartData({
            labels: projectTitles,
            datasets: [
              {
                label: "Number of Teams",
                data: teamCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
              {
                label: "Total Number of Deliverables",
                data: deliverablesCounts,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
              {
                label: "Total Number of Team Members",
                data: memberCounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        } else {
          console.warn("No projects found.");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        if (error.response) {
          console.error("Response Error Data:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return <p>No data available to display.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Professor Project Statistics</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Figure 1: Visualization regarding distribution of Teams, Deliverables and Team Members across your projects.",
            },
            legend: {
              position: "top",
            },
          },
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Projects",
              },
            },
            y: {
              title: {
                display: true,
                text: "Count",
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default ProfessorStatsChart;
