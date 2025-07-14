// FILE: AlertCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "axios"; // Ensures type declarations are loaded

interface Alert {
  id: number;
  supply_name: string;
  issue: string;
  urgency: "low" | "medium" | "high";
}

const AlertCard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from the backend
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ alerts: Alert[] }>("/alerts");
      setAlerts(response.data.alerts);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to fetch alerts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Dismiss an alert
  const dismissAlert = async (alertId: number) => {
    try {
      await axios.post(`/alerts/${alertId}/resolve`);
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to dismiss the alert. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2E7D32] mb-4">Waste Reduction Alerts</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : alerts.length === 0 ? (
        <p className="text-center text-gray-500">No alerts to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded shadow-md border ${
                alert.urgency === "high"
                  ? "border-red-500"
                  : alert.urgency === "medium"
                  ? "border-yellow-500"
                  : "border-green-500"
              }`}
            >
              <h2 className="text-lg font-bold text-gray-800">{alert.supply_name}</h2>
              <p className="text-gray-700">Issue: {alert.issue}</p>
              <p
                className={`font-semibold ${
                  alert.urgency === "high"
                    ? "text-red-500"
                    : alert.urgency === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Urgency: {alert.urgency.charAt(0).toUpperCase() + alert.urgency.slice(1)}
              </p>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="mt-4 bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertCard;