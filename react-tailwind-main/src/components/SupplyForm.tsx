import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getCookie } from 'src/context/Services';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';

interface SupplyFormProps {
  initialData?: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    expiration_date: string;
    cost_per_unit?: number;
    primary_supplier?: string;
  };
  onSuccess: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ initialData, onSuccess }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || 0,
    expiration_date: initialData?.expiration_date || '',
    cost_per_unit: initialData?.cost_per_unit || undefined,
    primary_supplier: initialData?.primary_supplier || undefined,
  });
  console.log(new Date('2025-09-14T23:50:40.013106'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.role !== 'admin') {
    return <p className='text-center text-red-500'>Access denied. Admins only.</p>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    if (
      !formData.name ||
      !formData.category ||
      formData.quantity < 0 ||
      !formData.expiration_date
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
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

      if (initialData) {
        // Update existing supply
        await axios.put(
          `http://127.0.0.1:8000/inventory/supplies/${initialData.id}`,
          formData,
          config
        );
      } else {
        // Add new supply
        await axios.post('http://127.0.0.1:8000/inventory/supplies', formData, config);
      }

      onSuccess();
    } catch (err) {
      setError('Failed to save supply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='animate-fade-in w-full max-w-md rounded-xl border border-green-200 bg-white p-6 shadow-lg'>
      <CardHeader className=''>
        <CardTitle className='text-center text-2xl font-bold text-[#2E7D32]'>
          {initialData ? 'Edit Supply 🌿' : 'Add Supply 🌿'}
        </CardTitle>
      </CardHeader>
      <CardContent className={''}>
        {error && <p className='mb-4 text-center text-red-500'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
              Name
            </Label>
            <Input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='category' className='text-sm font-medium text-gray-700'>
              Category
            </Label>
            <Input
              type='text'
              id='category'
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              required
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quantity' className='text-sm font-medium text-gray-700'>
              Quantity
            </Label>
            <Input
              type='number'
              id='quantity'
              name='quantity'
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min='0'
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='expiration_date' className='text-sm font-medium text-gray-700'>
              Expiration Date
            </Label>
            <Input
              type='date'
              id='expiration_date'
              name='expiration_date'
              value={
                formData.expiration_date
                  ? new Date(formData.expiration_date).toISOString().split('T')[0]
                  : ''
              }
              onChange={handleInputChange}
              required
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='cost_per_unit' className='text-sm font-medium text-gray-700'>
              Cost per Unit
            </Label>
            <Input
              type='number'
              id='cost_per_unit'
              name='cost_per_unit'
              value={formData.cost_per_unit || ''}
              onChange={handleInputChange}
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              placeholder='Enter cost per unit'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='primary_supplier' className='text-sm font-medium text-gray-700'>
              Primary Supplier
            </Label>
            <Input
              type='text'
              id='primary_supplier'
              name='primary_supplier'
              value={formData.primary_supplier || ''}
              onChange={handleInputChange}
              className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              placeholder='Enter primary supplier'
            />
          </div>
          <div className='flex justify-end'>
            <Button
              variant={'primary'}
              size={'sm'}
              type='submit'
              disabled={loading}
              className='rounded-lg bg-[#2E7D32] px-6 py-2 text-white transition-transform duration-300 hover:scale-105 hover:bg-[#1B5E20] disabled:opacity-50'
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupplyForm;
