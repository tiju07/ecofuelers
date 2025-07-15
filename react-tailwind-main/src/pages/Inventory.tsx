import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import SupplyTable, { useSuppliesRefresh } from "../components/SupplyTable";
import SupplyForm from "../components/SupplyForm";
import UsageForm from "../components/UsageForm";
import { Button } from "@app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@app/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table";

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useSuppliesRefresh();
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savings, setSavings] = useState<number>(0);
  const [wasteReduction, setWasteReduction] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchSupplies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suppliesRes, savingsRes, , recRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/inventory/supplies"),
        axios.get("http://127.0.0.1:8000/inventory/savings"),
        axios.get("http://127.0.0.1:8000/inventory/alerts"),
        axios.get("http://localhost:8000/inventory/recommendations"),
      ]);

      const totalStock = recRes.data.reduce(
        (sum: number, item: any) => sum + item.current_stock,
        0
      );

      const totalOverstock = savingsRes.data.reduce(
        (sum: number, item: any) => sum + item.overstock_quantity,
        0
      );

      const wasteReduction = totalStock > 0 ? (totalOverstock / totalStock) * 100 : 0;

      const totalSavings = Array.isArray(savingsRes.data)
        ? savingsRes.data.reduce((sum: number, item: any) => sum + (item.estimated_savings || 0), 0)
        : 0;

      setSupplies(suppliesRes.data);
      setSavings(totalSavings || 0);
      setWasteReduction(wasteReduction || 0);
      setRecommendations(recRes.data || []);
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
    <div className="container mx-auto p-4 relative z-10">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
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
              <img src="https://img.icons8.com/?size=100&id=13446&format=png&color=000000" alt="Waste Reduction" className="mb-2 w-[60px]" />
              <h2 className="text-lg font-bold text-gray-800">Waste Reduction</h2>
              <p className="text-3xl font-bold text-[#388E3C]">{wasteReduction.toFixed(2)}%</p>
              <span className="mt-2 text-green-700 text-xs font-semibold bg-green-100 px-2 py-1 rounded">
                Zero-waste goal
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-start mb-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#2E7D32] text-white" variant="primary" size="medium">View AI Recommendations</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
              <DialogHeader className="bg-white">
                  <DialogTitle className="text-lg font-bold">AI Recommendations</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.slice(0, 4).map((rec, index) => (
                    <Card key={index} className="bg-white">
                      <CardHeader className="bg-gray-100">
                        <CardTitle className="text-lg font-semibold">Supply ID: {rec.supply_id}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p><strong>Current Stock:</strong> {rec.current_stock}</p>
                        <p><strong>Avg Weekly Usage:</strong> {rec.average_weekly_usage}</p>
                        <p><strong>Recommended Order:</strong> {rec.recommended_order_quantity}</p>
                        <p><strong>Supplier:</strong> {rec.supplier}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#2E7D32] text-white" variant="primary" size="medium">View Supplies</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-lg font-bold">Supplies List</DialogTitle>
                </DialogHeader>
                <div className="overflow-auto max-h-[400px]">
                  <Table className="w-full">
                    <TableHeader className="bg-gray-100">
                      <TableRow className="hover:bg-gray-100">
                        <TableHead className="text-left">ID</TableHead>
                        <TableHead className="text-left">Name</TableHead>
                        <TableHead className="text-left">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="border">
                      {supplies.map((supply: any) => (
                        <TableRow key={supply.id} className="hover:bg-gray-100">
                          <TableCell className="border">{supply.id}</TableCell>
                          <TableCell className="border">{supply.name}</TableCell>
                          <TableCell className="border">{supply.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#2E7D32] text-white" variant="primary" size="medium">Add/Update Supply</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-lg font-bold">Supply Form</DialogTitle>
                </DialogHeader>
                <SupplyForm onSuccess={fetchSupplies} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#2E7D32] text-white" variant="primary" size="medium">Record Usage</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-lg font-bold">Usage Form</DialogTitle>
                </DialogHeader>
                <UsageForm onSuccess={triggerRefresh} />
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default Inventory;
