import React, { useState } from "react";
import axios from "axios";
import ChartComponent from "../components/ChartComponent";
import { Button } from "@app/components/ui/button";

const Reports: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const downloadReport = async (format: "pdf" | "excel") => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/inventory/reports/usage/export?format=${format}`, {
        responseType: "blob", // to handle file download
      });

      const blob = new Blob([response.data], {
        type: format === "pdf" ? "application/pdf" : "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report.${format == "pdf" ? "pdf" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to download report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2E7D32] mb-6">Reports</h1>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <ChartComponent />

      <div className="mt-8 flex justify-center gap-4">
        <Button
          className={`bg-[#2E7D32] text-white transition duration-300 ease-in-out transform hover:scale-105 hover:bg-[#1B5E20] w-[20%] h-[15%]`}
          variant="primary"
          size="medium"
          onClick={() => downloadReport("pdf")}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download PDF Report"}
        </Button>

        <Button
          className={`bg-[#2E7D32] text-white transition duration-300 ease-in-out transform hover:scale-105 hover:bg-[#1B5E20] w-[20%] h-[15%]`}
          variant="primary"
          size="medium"
          onClick={() => downloadReport("excel")}
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download CSV Report"}
        </Button>
      </div>
    </div>
  );
};

export default Reports;
