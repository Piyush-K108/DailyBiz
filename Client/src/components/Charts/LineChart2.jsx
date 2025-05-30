
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const chartData = {
    labels: data.map((entry) => `Day ${entry.day}`),
    datasets: [
      {
        label: "Active Users",
        data: data.map((entry) => entry.activeUsers),
        borderColor: "#eab308",
        backgroundColor: "rgba(234, 179, 8, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#eab308",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
