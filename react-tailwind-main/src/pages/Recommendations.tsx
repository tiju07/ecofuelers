import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { Card } from "@app/components/ui/card";

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("http://localhost:8000/inventory/recommendations");
        setRecommendations(res.data || []);
      } catch (err) {
        setError("Failed to fetch recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div
      className="min-h-screen bg-green-50 bg-opacity-40 py-10 px-4 md:px-10"
      style={{
        backgroundImage: "url('/image.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card className="max-w-6xl mx-auto p-6 bg-white bg-opacity-90 rounded-xl shadow-lg border-green-200">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-6 text-center">
          AI-Powered Supply Recommendations 🌿
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading recommendations...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : recommendations.length === 0 ? (
          <p className="text-center text-gray-700">No recommendations at this time.</p>
        ) : (
          <div className="overflow-auto rounded-lg border border-green-300 shadow-sm">
            <Table className="w-full">
              <TableHeader className="bg-green-100">
                <TableRow className="hover:bg-green-50 transition">
                  <TableHead className="text-[#1B5E20] font-semibold">Item</TableHead>
                  <TableHead className="text-[#1B5E20] font-semibold">Current Stock</TableHead>
                  <TableHead className="text-[#1B5E20] font-semibold">Recommended Order</TableHead>
                  <TableHead className="text-[#1B5E20] font-semibold">Issue</TableHead>
                  {/* <TableHead className="text-[#1B5E20] font-semibold">Supplier</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {recommendations.map((rec, index) => (
                  <TableRow key={index} className="hover:bg-green-50 transition">
                    <TableCell className="p-2">{rec.name}</TableCell>
                    <TableCell className="p-2">{rec.current_stock}</TableCell>

                    {/* <TableCell className="p-2">{rec.conflicts}</TableCell> */}
                    <TableCell className="text-[#2E7D32] font-bold p-2">
                      {rec.recommended_order_quantity}
                    </TableCell>
                    <TableCell className="p-2">{Array.isArray(rec.conflicts) ? rec.conflicts.join(', ') : rec.conflicts}</TableCell>
                    {/* <TableCell className="p-2">{rec.supplier}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecommendationPage;
