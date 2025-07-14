// FILE: ChartComponent.tsx
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [savingsData, setSavingsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage trends and savings data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usageResponse, savingsResponse] = await Promise.all([
          axios.get("/usage/history"),
          axios.get("/savings"),
        ]);
        setUsageData(usageResponse.data);
        setSavingsData(savingsResponse.data);
      } catch (err) {
        setError("Failed to fetch chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare data for usage trends chart
  const usageChartData = {
    labels: usageData?.dates || [],
    datasets: [
      {
        label: "Supply Usage",
        data: usageData?.values || [],
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46, 125, 50, 0.5)",
        fill: true,
      },
    ],
  };

  // Prepare data for savings chart
  const savingsChartData = {
    labels: savingsData?.months || [],
    datasets: [
      {
        label: "Cost Savings",
        data: savingsData?.values || [],
        backgroundColor: "#2E7D32",
        borderColor: "#1B5E20",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2E7D32] mb-4">Supply Usage & Cost Savings</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usage Trends Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Usage Trends</h2>
            <Line data={usageChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          {/* Cost Savings Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Cost Savings</h2>
            <Bar data={savingsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;