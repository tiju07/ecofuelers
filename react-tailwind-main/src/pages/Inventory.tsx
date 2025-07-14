// FILE: Inventory.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SupplyTable, { useSuppliesRefresh } from "../components/SupplyTable";
import SupplyForm from "../components/SupplyForm";
import UsageForm from "../components/UsageForm";
import "../styles/AnimatedBackground.css";

const greeneryImg = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80";
const recycleImg = "/assets/recycle.png"; // Recycle image path

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useSuppliesRefresh();
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savings, setSavings] = useState<number>(0);
  const [wasteReduction, setWasteReduction] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<string>("");

  const fetchSupplies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suppliesRes, savingsRes, wasteRes, recRes] = await Promise.all([
        await axios.get("http://127.0.0.1:8000/inventory/supplies"),
        await axios.get("http://127.0.0.1:8000/inventory/savings"),
        await axios.get("http://127.0.0.1:8000/inventory/alerts"),
        await axios.get("http://localhost:8000/inventory/recommendations"),
      ]);
      const totalSavings = Array.isArray(savingsRes.data)
        ? savingsRes.data.reduce((sum: number, item: any) => sum + (item.estimated_savings || 0), 0)
        : 0
      setSupplies(suppliesRes.data);
      setSavings(totalSavings || 0);
      setWasteReduction(wasteRes.data.percent || 0);
      setRecommendation(recRes.data.recommendation || "No recommendations at this time.");
    } catch (err) {
      setError("Failed to fetch inventory data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return (
    <>
      <div className="animated-bg"></div>
      {/* Greenery Banner */}
      <div className="relative w-full h-40 md:h-56 rounded-lg overflow-hidden shadow-lg mb-8">
        <img
          src={greeneryImg}
          alt="Greenery"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              Smart Inventory Management
            </h1>
            <img
              src={recycleImg}
              alt="Recycle"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          <p className="text-md md:text-lg text-green-100 font-medium">
            Track, Save, and Go Green 🌱
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 relative z-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                <img src="https://img.icons8.com/ios-filled/50/2E7D32/box.png" alt="Supplies" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Total Supplies</h2>
                <p className="text-3xl font-bold text-[#2E7D32]">{supplies?.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                <img src="https://img.icons8.com/ios-filled/50/388E3C/leaf.png" alt="Savings" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Estimated Savings</h2>
                <p className="text-3xl font-bold text-[#388E3C]">${savings}</p>
                <span className="mt-2 text-green-700 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
                  Up to 30% savings!
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                <img src="https://img.icons8.com/ios-filled/50/81C784/recycle.png" alt="Waste Reduction" className="mb-2" />
                <h2 className="text-lg font-bold text-gray-800">Waste Reduction</h2>
                <p className="text-3xl font-bold text-[#388E3C]">{wasteReduction}%</p>
                <span className="mt-2 text-green-700 text-xs font-semibold bg-green-100 px-2 py-1 rounded">
                  Zero-waste goal
                </span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-8 flex items-center">
              <img src="https://img.icons8.com/ios-filled/40/2E7D32/artificial-intelligence.png" alt="AI" className="mr-4" />
              <div>
                <h3 className="text-md font-bold text-green-800 mb-1">AI Recommendation</h3>
                <p className="text-green-700">{recommendation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Supply Table */}
              <div className="lg:col-span-2 bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Supplies</h2>
                <SupplyTable refreshKey={refreshKey} />
              </div>

              {/* Admin-only Supply Form */}
              {user?.role === "admin" && (
                <div className="bg-white p-4 rounded shadow-md">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Add/Update Supplies</h2>
                  <SupplyForm onSuccess={fetchSupplies} />
                </div>
              )}

              {/* Usage Form (visible to all users) */}
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Record Supply Usage</h2>
                <UsageForm onSuccess={triggerRefresh} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Inventory;
