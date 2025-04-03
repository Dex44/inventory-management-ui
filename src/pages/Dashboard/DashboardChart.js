import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const DashboardChart = () => {
  // Full sales data for 12 months
  const fullData = [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 150 },
    { month: "Mar", sales: 130 },
    { month: "Apr", sales: 170 },
    { month: "May", sales: 190 },
    { month: "Jun", sales: 160 },
    { month: "Jul", sales: 200 },
    { month: "Aug", sales: 220 },
    { month: "Sep", sales: 180 },
    { month: "Oct", sales: 210 },
    { month: "Nov", sales: 230 },
    { month: "Dec", sales: 250 },
  ];

  // State to track selected month range (default: last 6 months)
  const [monthsToShow, setMonthsToShow] = useState(6);

  // Get last N months data dynamically
  const recentData = fullData.slice(-monthsToShow);
  const labels = recentData.map((entry) => entry.month);
  const salesData = recentData.map((entry) => entry.sales);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-4 rounded-lg mt-4">
      {/* Dropdown for selecting months */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">Sales Data</h2>
        <select
          className="p-2 border rounded-md text-gray-700"
          value={monthsToShow}
          onChange={(e) => setMonthsToShow(parseInt(e.target.value))}
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 1 Year</option>
        </select>
      </div>

      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
