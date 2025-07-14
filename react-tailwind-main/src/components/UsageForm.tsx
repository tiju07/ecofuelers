// FILE: UsageForm.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Supply {
  id: number;
  name: string;
}

interface UsageFormProps {
  onSuccess?: () => void;
}

const UsageForm: React.FC<UsageFormProps> = ({ onSuccess }) => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [formData, setFormData] = useState({
    supply_id: "",
    quantity_used: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch supplies for the dropdown
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/inventory/supplies");
        setSupplies(response.data);
      } catch (err) {
        setError("Failed to fetch supplies. Please try again later.");
      }
    };
    fetchSupplies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "quantity_used" ? Math.max(0, Number(value)) : value, // Prevent negative quantity
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://127.0.0.1:8000/inventory/usage", formData);
      setSuccess("Usage recorded successfully.");
      setFormData({ supply_id: "", quantity_used: 0 }); // Reset form
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to record usage. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">Record Supply Usage</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supply_id" className="block text-sm font-medium text-gray-700">
            Supply
          </label>
          <select
            id="supply_id"
            name="supply_id"
            value={formData.supply_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          >
            <option value="" disabled>
              Select a supply
            </option>
            {supplies?.map((supply) => (
              <option key={supply.id} value={supply.id}>
                {supply.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity_used" className="block text-sm font-medium text-gray-700">
            Quantity Used
          </label>
          <input
            type="number"
            id="quantity_used"
            name="quantity_used"
            value={formData.quantity_used}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Recording..." : "Record Usage"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsageForm;