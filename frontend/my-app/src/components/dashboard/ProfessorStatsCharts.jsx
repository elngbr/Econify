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

// Register required components for Chart.js
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
    // Mocked data
    const mockData = [
      {
        projectId: 1,
        projectTitle: "Statistics pj",
        teamCount: 0,
        deliverablesCount: 0,
        teams: [],
      },
      {
        projectId: 2,
        projectTitle: "Geography pj",
        teamCount: 1,
        deliverablesCount: 2,
        teams: [
          {
            teamId: 4,
            teamName: "Fluturasii gingasi",
            deliverableCount: 2,
            memberCount: 2,
          },
        ],
      },
      {
        projectId: 3,
        projectTitle: "Medicine Project",
        teamCount: 2,
        deliverablesCount: 6,
        teams: [
          {
            teamId: 7,
            teamName: "PowerPraf",
            deliverableCount: 6,
            memberCount: 1,
          },
          {
            teamId: 6,
            teamName: "Stelele",
            deliverableCount: 0,
            memberCount: 1,
          },
        ],
      },
      {
        projectId: 4,
        projectTitle: "Sciences Project",
        teamCount: 1,
        deliverablesCount: 1,
        teams: [
          {
            teamId: 8,
            teamName: "Stelutele",
            deliverableCount: 1,
            memberCount: 1,
          },
        ],
      },
      {
        projectId: 5,
        projectTitle: "Multimedia Project",
        teamCount: 1,
        deliverablesCount: 2,
        teams: [
          {
            teamId: 9,
            teamName: "Calutii",
            deliverableCount: 2,
            memberCount: 1,
          },
        ],
      },
      {
        projectId: 6,
        projectTitle: "Databases Project",
        teamCount: 0,
        deliverablesCount: 0,
        teams: [],
      },
    ];

    console.log("Mocked data:", mockData);

    if (mockData && mockData.length > 0) {
      const projectTitles = mockData.map((project) => project.projectTitle);
      const teamCounts = mockData.map((project) => project.teamCount);
      const deliverablesCounts = mockData.map(
        (project) => project.deliverablesCount
      );
      const memberCounts = mockData.map((project) =>
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
            label: "Number of Deliverables",
            data: deliverablesCounts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
          {
            label: "Number of Team Members",
            data: memberCounts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } else {
      console.warn("No projects found in the mock data.");
    }

    setLoading(false);
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
              text: "Professor's Project Statistics",
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
