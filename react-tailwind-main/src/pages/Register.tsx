import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register', form, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setSuccess('Registration successful!');
      setForm({ username: '', password: '', first_name: '', last_name: '' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-green-50/80 backdrop-blur-md'>
      <Card className='animate-fade-in w-full max-w-md rounded-xl border border-green-200 bg-white p-6 shadow-lg'>
        <CardHeader className='mb-4'>
          <CardTitle className='text-center text-3xl font-bold text-[#2E7D32]'>
            Register 🌿
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && <p className='mb-4 text-center text-red-500'>{error}</p>}
          {success && <p className='mb-4 text-center text-green-500'>{success}</p>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username' className='text-sm font-medium text-gray-700'>
                Username
              </Label>
              <Input
                type='text'
                id='username'
                name='username'
                value={form.username}
                onChange={handleChange}
                required
                className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
                Password
              </Label>
              <Input
                type='password'
                id='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                required
                className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='first_name' className='text-sm font-medium text-gray-700'>
                First Name
              </Label>
              <Input
                type='text'
                id='first_name'
                name='first_name'
                value={form.first_name}
                onChange={handleChange}
                required
                className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='last_name' className='text-sm font-medium text-gray-700'>
                Last Name
              </Label>
              <Input
                type='text'
                id='last_name'
                name='last_name'
                value={form.last_name}
                onChange={handleChange}
                required
                className='rounded-lg border-gray-300 transition-all duration-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
              />
            </div>
            <div className='flex justify-center'>
              <Button
                variant={'primary'}
                size={'lg'}
                type='submit'
                disabled={loading}
                className='rounded-lg bg-[#2E7D32] px-6 py-2 text-white transition-transform duration-300 hover:scale-105 hover:bg-[#1B5E20] disabled:opacity-50'
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
