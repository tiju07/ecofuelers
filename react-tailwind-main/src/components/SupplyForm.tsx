// FILE: SupplyForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getCookie } from "src/context/Services";

interface SupplyFormProps {
  supplyToEdit?: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    expiration_date: string;
  };
  onSuccess: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ supplyToEdit, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: supplyToEdit?.name || "",
    category: supplyToEdit?.category || "",
    quantity: supplyToEdit?.quantity || 0,
    expiration_date: supplyToEdit?.expiration_date || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== "admin") {
    return <p className="text-red-500">Access denied. Admins only.</p>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(0, Number(value)) : value, // Prevent negative quantity
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getCookie("auth_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (supplyToEdit) {
        // Update existing supply
        await axios.put(`http://127.0.0.1:8000/inventory/supplies/${supplyToEdit.id}`, formData, config);
      } else {
        // Add new supply
        await axios.post("http://127.0.0.1:8000/inventory/supplies", formData, config);
      }

      onSuccess(); // Callback to refresh data or close the form
    } catch (err) {
      setError("Failed to save supply. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">
        {supplyToEdit ? "Edit Supply" : "Add Supply"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
        <div>
          <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            id="expiration_date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-[#2E7D32] focus:border-[#2E7D32]"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplyForm;