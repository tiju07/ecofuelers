import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { useAuth } from 'src/context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        withCredentials: true,
      });
      login();

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-green-50/80 backdrop-blur-md'>
      <Card className='animate-fade-in w-full max-w-md rounded-xl border border-green-200 bg-white p-6 shadow-lg'>
        <CardHeader className='mb-4'>
          <CardTitle className='text-center text-3xl font-bold text-[#2E7D32]'>Login 🌿</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && <p className='mb-4 text-center text-red-500'>{error}</p>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username' className='text-sm font-medium text-gray-700'>
                Username
              </Label>
              <Input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
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
                value={formData.password}
                onChange={handleInputChange}
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
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
