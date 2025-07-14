// FILE: Reports.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChartComponent from "../components/ChartComponent";
import jsPDF from "jspdf";

const Reports: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [savingsData, setSavingsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage history and savings data
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
      setError("Failed to fetch report data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Export report as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Supply Usage and Savings Report", 10, 10);

    doc.setFontSize(12);
    doc.text("Usage Trends:", 10, 20);
    if (usageData) {
      usageData.dates.forEach((date: string, index: number) => {
        doc.text(`${date}: ${usageData.values[index]} units`, 10, 30 + index * 10);
      });
    } else {
      doc.text("No usage data available.", 10, 30);
    }

    doc.text("Savings Data:", 10, 50);
    if (savingsData) {
      savingsData.months.forEach((month: string, index: number) => {
        doc.text(`${month}: $${savingsData.values[index]}`, 10, 60 + index * 10);
      });
    } else {
      doc.text("No savings data available.", 10, 60);
    }

    doc.save("report.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2E7D32] mb-6">Reports</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div>
          {/* Render ChartComponent */}
          <ChartComponent />

          {/* Export to PDF Button */}
          <div className="mt-6 text-center">
            <button
              onClick={exportToPDF}
              className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;