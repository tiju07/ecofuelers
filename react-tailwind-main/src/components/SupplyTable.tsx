// FILE: SupplyTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export const useSuppliesRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);
  return { refreshKey, triggerRefresh };
};

interface Supply {
  id: number;
  name: string;
  category: string;
  quantity: number;
  last_updated: string;
  expiration_date: string;
}

const SupplyTable: React.FC<{ refreshKey?: number }> = ({ refreshKey = 0 }) => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchSupplies = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/inventory/supplies`);
      setSupplies(response.data);
    } catch (err) {
      setError("Failed to fetch supplies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies(currentPage);
    // eslint-disable-next-line
  }, [currentPage, refreshKey]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2E7D32] mb-4">Office Supplies</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#2E7D32] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
                <th className="px-4 py-2 text-left">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {supplies?.map((supply) => (
                <tr key={supply.id} className="border-t border-gray-200 hover:bg-gray-100">
                  <td className="px-4 py-2">{supply.name}</td>
                  <td className="px-4 py-2">{supply.category}</td>
                  <td className="px-4 py-2">{supply.quantity}</td>
                  <td className="px-4 py-2">{new Date(supply.last_updated).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(supply.expiration_date).toLocaleDateString() ?? "No Date"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default SupplyTable;