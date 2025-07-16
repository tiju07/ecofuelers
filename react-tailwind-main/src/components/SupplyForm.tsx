// FILE: SupplyForm.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getCookie } from 'src/context/Services';

interface SupplyFormProps {
  supplyToEdit?: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    expiration_date: string;
    cost_per_unit?: number; // Optional field for cost per unit
    primary_supplier?: string; // Optional field for primary supplier
  };
  onSuccess: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ supplyToEdit, onSuccess }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: supplyToEdit?.name || '',
    category: supplyToEdit?.category || '',
    quantity: supplyToEdit?.quantity || 0,
    expiration_date: supplyToEdit?.expiration_date || '',
    cost_per_unit: supplyToEdit?.cost_per_unit || undefined, // Optional field
    primary_supplier: supplyToEdit?.primary_supplier || undefined, // Optional field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== 'admin') {
    console.log(user);

    return <p className='text-red-500'>Access denied. Admins only.</p>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(0, Number(value)) : value, // Prevent negative quantity
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    if (!formData.name || !formData.category || formData.quantity < 0 || !formData.expiration_date) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    if (formData.expiration_date <= currentDate) {
      setError('Expiration date must be greater than the current date.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (supplyToEdit) {
        // Update existing supply
        await axios.put(
          `http://127.0.0.1:8000/inventory/supplies/${supplyToEdit.id}`,
          formData,
          config
        );
      } else {
        // Add new supply
        await axios.post('http://127.0.0.1:8000/inventory/supplies', formData, config);
      }

      onSuccess(); // Callback to refresh data or close the form
    } catch (err) {
      console.log(err)
      setError('Failed to save supply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-md rounded bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-2xl font-bold text-[#2E7D32]'>
        {supplyToEdit ? 'Edit Supply' : 'Add Supply'}
      </h2>
      {error && <p className='mb-4 text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            required
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
          />
        </div>
        <div>
          <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
            Category
          </label>
          <input
            type='text'
            id='category'
            name='category'
            value={formData.category}
            onChange={handleInputChange}
            required
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
          />
        </div>
        <div>
          <label htmlFor='quantity' className='block text-sm font-medium text-gray-700'>
            Quantity
          </label>
          <input
            type='number'
            id='quantity'
            name='quantity'
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min='0'
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
          />
        </div>
        <div>
          <label htmlFor='expiration_date' className='block text-sm font-medium text-gray-700'>
            Expiration Date
          </label>
          <input
            type='date'
            id='expiration_date'
            name='expiration_date'
            value={formData.expiration_date}
            onChange={handleInputChange}
            required
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
          />
        </div>
        <div>
          <label htmlFor='cost_per_unit' className='block text-sm font-medium text-gray-700'>
            Cost per Unit
          </label>
          <input
            type='number'
            id='cost_per_unit'
            name='cost_per_unit'
            value={formData.cost_per_unit || ''}
            onChange={handleInputChange}
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            placeholder='Enter cost per unit'
          />
        </div>
        <div>
          <label htmlFor='primary_supplier' className='block text-sm font-medium text-gray-700'>
            Primary Supplier
          </label>
          <input
            type='text'
            id='primary_supplier'
            name='primary_supplier'
            value={formData.primary_supplier || ''}
            onChange={handleInputChange}
            className='mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            placeholder='Enter primary supplier'
          />
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={loading}
            className='rounded bg-[#2E7D32] px-4 py-2 text-white transition duration-300 hover:bg-[#1B5E20] disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplyForm;
