import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AnimatedBackground.css";

const greeneryImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; // Example Unsplash greenery

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSupplies: 0,
    recentAlerts: 0,
    estimatedSavings: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [suppliesResponse, alertsResponse, savingsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/inventory/supplies"),
          axios.get("http://127.0.0.1:8000/inventory/alerts"),
          axios.get("http://127.0.0.1:8000/inventory/savings"),
        ]);
        setStats({
          totalSupplies: suppliesResponse?.data?.length || 0,
          recentAlerts: alertsResponse?.data?.length || 0,
          estimatedSavings: Array.isArray(savingsResponse?.data)
            ? savingsResponse.data.reduce((sum: number, item: any) => sum + (item.estimated_savings || 0), 0)
            : 0,
        });
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <div className="animated-bg"></div>
      {/* Greenery Banner */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden shadow-md mb-8">
        <img
          src={greeneryImg}
          alt="Greenery"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">
              Sustainable Office Inventory
            </h1>
            <img
              src="/recyclelogo.png"
              alt="Recycle"
              className="w-12 h-12 object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          <p className="text-xl text-green-300 font-medium">
            Track, Save, and Go Green 🌱
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 relative z-10">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Supplies Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <img src="https://img.icons8.com/ios-filled/50/2E7D32/box.png" alt="Supplies" className="mb-2" />
              <h2 className="text-lg font-bold text-gray-800">Total Supplies</h2>
              <p className="text-4xl font-bold text-[#2E7D32]">{stats?.totalSupplies}</p>
            </div>
            {/* Recent Alerts Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <img src="https://img.icons8.com/ios-filled/50/FF5252/error.png" alt="Alerts" className="mb-2" />
              <h2 className="text-lg font-bold text-gray-800">Recent Alerts</h2>
              <p className="text-4xl font-bold text-red-600">{stats?.recentAlerts}</p>
            </div>
            {/* Estimated Savings Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <img src="https://img.icons8.com/ios-filled/50/388E3C/leaf.png" alt="Savings" className="mb-2" />
              <h2 className="text-lg font-bold text-gray-800">Estimated Savings</h2>
              <p className="text-4xl font-bold text-[#388E3C]">${stats?.estimatedSavings}</p>
              <span className="mt-2 text-green-700 text-sm font-semibold bg-green-200 px-2 py-1 rounded">
                Up to 30% savings!
              </span>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div>
            <h3 className="text-lg font-bold text-green-800 mb-1">Ready to optimize your office supplies?</h3>
            <p className="text-green-700">Check recommendations and reports to reduce waste and save more!</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              to="/recommendations"
              className="bg-[#2E7D32] text-white px-4 py-2 rounded shadow hover:bg-[#1B5E20] transition"
            >
              Recommendations
            </Link>
            <Link
              to="/reports"
              className="bg-[#388E3C] text-white px-4 py-2 rounded shadow hover:bg-[#27632a] transition"
            >
              Reports
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link
            to="/inventory"
            className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300"
          >
            Inventory
          </Link>
          <Link
            to="/recommendations"
            className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300"
          >
            Recommendations
          </Link>
          <Link
            to="/alerts"
            className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300"
          >
            Alerts
          </Link>
          <Link
            to="/reports"
            className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300"
          >
            Reports
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
