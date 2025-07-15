import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardTitle, CardDescription } from "@app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@app/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import "../styles/AnimatedBackground.css";

const greeneryImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSupplies: 0,
    recentAlerts: 0,
    estimatedSavings: 0,
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingsPercentage, setSavingsPercentage] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [suppliesRes, alertsRes, savingsRes, recsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/inventory/supplies"),
          axios.get("http://127.0.0.1:8000/inventory/alerts"),
          axios.get("http://127.0.0.1:8000/inventory/savings"),
          axios.get("http://127.0.0.1:8000/inventory/recommendations"),
        ]);

        setStats({
          totalSupplies: suppliesRes?.data?.length || 0,
          recentAlerts: alertsRes?.data?.length || 0,
          estimatedSavings: Array.isArray(savingsRes?.data)
            ? savingsRes.data.reduce((sum: number, item: any) => sum + (item.estimated_savings || 0), 0)
            : 0,
        });

        setRecommendations(recsRes?.data?.slice(0, 3) || []);
        setAlerts(alertsRes?.data || []);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const fetchAndCalculateSavings = async () => {
      try {
        const [suppliesRes, recommendationsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/inventory/supplies"),
          axios.get("http://127.0.0.1:8000/inventory/recommendations"),
        ]);

        const supplies = suppliesRes.data;
        const recommendations = recommendationsRes.data;
        const COST_PER_UNIT = 10;

        let originalCost = 0;
        let optimizedCost = 0;

        supplies.forEach((supply: any) => {
          const recommendation = recommendations.find((r: any) => r.supply_id === supply.id);
          const currentQty = supply.quantity || 0;
          const recommendedQty = recommendation?.recommended_order_quantity || 0;

          // Total current cost
          originalCost += (currentQty + recommendedQty) * COST_PER_UNIT;

          // Optimized cost assumes only ordering what is required
          optimizedCost += Math.max(currentQty, recommendation?.average_weekly_usage * 2 || 0) * COST_PER_UNIT;
        });

        const estimatedSavings = originalCost - optimizedCost;
        const savingsPercent = originalCost > 0 ? (estimatedSavings / originalCost) * 100 : 0;

        setSavingsPercentage(Number(savingsPercent.toFixed(2)));
      } catch (err) {
        console.error("Failed to calculate savings percentage:", err);
        setSavingsPercentage(null);
      }
    };

    fetchAndCalculateSavings();

  }, []);

  return (
    <>
      <div className="animated-bg"></div>

      {/* Greenery Banner with Notification Bell */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden shadow-md mb-8 relative">
        <img
          src={greeneryImg}
          alt="Greenery"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <div className="flex items-center gap-3 mb-2 ">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">
              Sustainable Office Inventory
            </h1>
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute p-2 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none transition right-10 top-10">
                <Bell className="w-6 h-6 text-red-600" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full animate-ping">
                    {alerts.length}
                  </span>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-xl border border-gray-200 animate-in fade-in zoom-in-90">
                <DropdownMenuLabel inset className="text-lg font-semibold text-gray-800 px-4 py-2">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                {alerts.length === 0 ? (
                  <DropdownMenuItem inset className="text-sm text-gray-500 px-4 py-2">
                    No new alerts 🎉
                  </DropdownMenuItem>
                ) : (
                  alerts.slice(0, 5).map((alert, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      inset
                      className="flex flex-col items-start gap-1 px-4 py-2 hover:bg-green-50 cursor-pointer transition"
                    >
                      <span className="font-medium text-gray-800">{alert.alert}</span>
                      <span className="text-xs text-gray-500">{alert.name}</span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  inset
                  onClick={() => navigate("/alerts")}
                  className="text-blue-600 font-medium text-center justify-center px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
                >
                  View All Alerts →
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Cards */}
              <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                <img src="https://img.icons8.com/ios-filled/50/2E7D32/box.png" alt="Supplies" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Total Supplies</h2>
                <p className="text-4xl font-bold text-[#2E7D32]">{stats.totalSupplies}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                <img src="https://img.icons8.com/ios-filled/50/FF5252/error.png" alt="Alerts" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Recent Alerts</h2>
                <p className="text-4xl font-bold text-red-600">{stats.recentAlerts}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
                <img src="https://img.icons8.com/ios-filled/50/388E3C/leaf.png" alt="Savings" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Estimated Savings</h2>
                <p className="text-4xl font-bold text-[#388E3C]">${stats.estimatedSavings}</p>
                <span className="mt-2 text-green-700 text-sm font-semibold bg-green-200 px-2 py-1 rounded">
                  Up to {savingsPercentage}% savings!
                </span>
              </div>
            </div>

            {/* 📦 Recommendations Preview */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Smart Order Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec, idx) => (
                  <Card key={idx} className="shadow-md hover:shadow-xl transition">
                    <CardContent className="p-4 space-y-2">
                      <CardTitle className="font-bold">{rec.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Avg Weekly: {rec.average_weekly_usage?.toFixed(2)}<br />
                        Stock: {rec.current_stock} → Suggest: <strong>{rec.recommended_order_quantity}</strong><br />
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/recommendations"
                  className="text-[#2E7D32] font-medium hover:underline"
                >
                  View More Recommendations →
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Call to Action + Navigation */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div>
            <h3 className="text-lg font-bold text-green-800 mb-1">Ready to optimize your office supplies?</h3>
            <p className="text-green-700">Check recommendations and reports to reduce waste and save more!</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/recommendations" className="bg-[#2E7D32] text-white px-4 py-2 rounded shadow hover:bg-[#1B5E20] transition">
              Recommendations
            </Link>
            <Link to="/reports" className="bg-[#388E3C] text-white px-4 py-2 rounded shadow hover:bg-[#27632a] transition">
              Reports
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/inventory" className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300">
            Inventory
          </Link>
          <Link to="/recommendations" className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300">
            Recommendations
          </Link>
          <Link to="/alerts" className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300">
            Alerts
          </Link>
          <Link to="/reports" className="bg-[#2E7D32] text-white p-4 rounded-lg shadow-md text-center hover:bg-[#1B5E20] transition duration-300">
            Reports
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
