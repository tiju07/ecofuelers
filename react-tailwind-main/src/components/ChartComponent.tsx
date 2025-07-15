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

  // Fetch from real backend APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usageRes, savingsRes] = await Promise.all([
          axios.get("http://localhost:8000/inventory/usage/history"),
          axios.get("http://localhost:8000/inventory/savings/history"),
        ]);

        setUsageData(usageRes.data);
        setSavingsData(savingsRes.data);
        console.log(savingsRes)
      } catch (err) {
        setError("Failed to fetch chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usageChartData = {
    labels: usageData?.dates || [],
    datasets: [
      {
        label: "Supply Usage",
        data: usageData?.values || [],
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46, 125, 50, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const savingsChartData = {
    labels: savingsData?.months || [],
    datasets: [
      {
        label: "Cost Savings",
        data: savingsData?.values || [],
        backgroundColor: "rgba(46, 125, 50, 0.6)",
        borderColor: "#1B5E20",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center text-gray-500">Loading charts...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usage Line Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold text-[#2E7D32] mb-2">
              Usage Trends
            </h2>
            <div className="h-[300px]">
              <Line
                data={usageChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Savings Bar Chart */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold text-[#2E7D32] mb-2">
              Cost Savings
            </h2>
            <div className="h-[300px]">
              <Bar
                data={savingsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
