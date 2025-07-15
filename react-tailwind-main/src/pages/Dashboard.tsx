import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardTitle, CardDescription } from '@app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@app/components/ui/dropdown-menu';
import { Button } from '@app/components/ui/button';
import { Bell, Package, AlertTriangle, Leaf, Lightbulb, BarChart } from 'lucide-react';
import '../styles/AnimatedBackground.css';

const greeneryImg =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSupplies: 0,
    recentAlerts: 0,
    estimatedSavings: 0,
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingsPercentage, setSavingsPercentage] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [suppliesRes, alertsRes, savingsRes, recsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/inventory/supplies'),
          axios.get('http://127.0.0.1:8000/inventory/alerts'),
          axios.get('http://127.0.0.1:8000/inventory/savings'),
          axios.get('http://127.0.0.1:8000/inventory/recommendations'),
        ]);

        setStats({
          totalSupplies: suppliesRes?.data?.length || 0,
          recentAlerts: alertsRes?.data?.length || 0,
          estimatedSavings: Array.isArray(savingsRes?.data)
            ? savingsRes.data.reduce(
                (sum: number, item: any) => sum + (item.estimated_savings || 0),
                0
              )
            : 0,
        });

        setRecommendations(recsRes?.data?.slice(0, 3) || []);
        setAlerts(alertsRes?.data || []);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    const fetchAndCalculateSavings = async () => {
      try {
        const [suppliesRes, recommendationsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/inventory/supplies'),
          axios.get('http://127.0.0.1:8000/inventory/recommendations'),
        ]);

        const supplies = suppliesRes.data;
        const recommendations = recommendationsRes.data;

        let originalCost = 0;
        let optimizedCost = 0;

        supplies.forEach((supply: any) => {
          const recommendation = recommendations.find((r: any) => r.supply_id === supply.id);
          const currentQty = supply.quantity || 0;
          const recommendedQty = recommendation?.recommended_order_quantity || 0;

          originalCost += (currentQty + recommendedQty) * supply.cost_per_unit;
          optimizedCost +=
            Math.max(currentQty, recommendation?.average_weekly_usage * 2 || 0) *
            supply.cost_per_unit;
        });

        const estimatedSavings = originalCost - optimizedCost;
        const savingsPercent = originalCost > 0 ? (estimatedSavings / originalCost) * 100 : 0;

        setSavingsPercentage(Number(savingsPercent.toFixed(2)));
      } catch (err) {
        console.error('Failed to calculate savings percentage:', err);
        setSavingsPercentage(null);
      }
    };

    fetchAndCalculateSavings();
  }, []);

  return (
    <>
      <div className='animated-bg'></div>

      {/* Banner */}
      <div className='relative top-0 mb-8 h-90 w-full overflow-hidden shadow-xl md:h-90'>
        <img src={greeneryImg} alt='Greenery' className='h-full w-full object-cover opacity-80' />
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/50 to-transparent'>
          <div className='mb-2 flex items-center gap-4'>
            <h1 className='text-4xl font-bold text-white drop-shadow-lg md:text-5xl'>
              Sustainable Office Inventory
            </h1>
          </div>
          <p className='text-xl font-medium text-green-200 drop-shadow-md'>
            Track, Save, and Go Green 🌱
          </p>
        </div>
      </div>

      <div className='relative z-10 container mx-auto p-6'>
        {loading ? (
          <>
            <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex animate-pulse flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'
                >
                  <div className='mb-2 h-12 w-12 rounded-full bg-gray-200' />
                  <div className='mb-2 h-5 w-24 rounded bg-gray-200' />
                  <div className='h-8 w-16 rounded bg-gray-200' />
                </div>
              ))}
            </div>
            <div className='mb-12'>
              <div className='mb-4 h-7 w-64 animate-pulse rounded bg-gray-200' />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='animate-pulse rounded-lg border border-green-100 p-4 shadow-md'
                  >
                    <div className='mb-2 h-5 w-32 rounded bg-gray-200' />
                    <div className='h-4 w-40 rounded bg-gray-200' />
                  </div>
                ))}
              </div>
              <div className='mt-4 text-center'>
                <div className='mx-auto h-5 w-48 animate-pulse rounded bg-gray-200' />
              </div>
            </div>
            <div className='mb-10 flex animate-pulse flex-col items-center justify-between rounded-lg border-l-4 border-green-400 bg-green-50 p-6 shadow-lg md:flex-row'>
              <div>
                <div className='mb-2 h-5 w-48 rounded bg-gray-200' />
                <div className='h-4 w-64 rounded bg-gray-200' />
              </div>
              <div className='mt-4 flex gap-4 md:mt-0'>
                <div className='h-8 w-32 rounded bg-gray-200' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-10 w-full animate-pulse rounded bg-gray-200' />
              ))}
            </div>
          </>
        ) : error ? (
          <p className='text-center text-red-600'>{error}</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='flex transform flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:scale-105'>
                <Package className='h-12 w-12 text-[#2E7D32]' />
                <h2 className='mt-2 text-lg font-bold text-gray-800'>Total Supplies</h2>
                <p className='text-4xl font-bold text-[#2E7D32]'>{stats.totalSupplies}</p>
              </div>
              <div className='flex transform flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:scale-105'>
                <AlertTriangle className='h-12 w-12 text-red-600' />
                <h2 className='mt-2 text-lg font-bold text-gray-800'>Recent Alerts</h2>
                <p className='text-4xl font-bold text-red-600'>{stats.recentAlerts}</p>
              </div>
              <div className='flex transform flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:scale-105'>
                <Leaf className='h-12 w-12 text-[#388E3C]' />
                <h2 className='mt-2 text-lg font-bold text-gray-800'>Estimated Savings</h2>
                <p className='text-4xl font-bold text-[#388E3C]'>
                  ₹{stats.estimatedSavings.toLocaleString('en-IN')}
                </p>
                <span className='mt-2 rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700'>
                  Up to {savingsPercentage}% savings!
                </span>
              </div>
            </div>
            {/* Recommendations Preview */}
            <div className='mb-12'>
              <h2 className='mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800'>
                <Lightbulb className='h-6 w-6 text-[#2E7D32]' /> Smart Order Suggestions
              </h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {recommendations.map((rec, idx) => (
                  <Card
                    key={idx}
                    className='transform border border-green-100 shadow-md transition-transform hover:scale-102 hover:shadow-xl'
                  >
                    <CardContent className='space-y-2 p-4'>
                      <CardTitle className='font-bold text-[#2E7D32]'>{rec.name}</CardTitle>
                      <CardDescription className='text-gray-600'>
                        Avg Weekly: {rec.average_weekly_usage?.toFixed(2)}
                        <br />
                        Stock:{' '}
                        <strong className='text-[#b40202]'>
                          {Math.round(rec.current_stock)}
                        </strong>{' '}
                        → Suggest:{' '}
                        <strong className='text-[#2E7D32]'>
                          {Math.round(rec.recommended_order_quantity)}
                        </strong>
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className='mt-4 text-center'>
                <Link
                  to='/recommendations'
                  className='font-medium text-[#2E7D32] transition hover:underline'
                >
                  View More Recommendations →
                </Link>
              </div>
            </div>

            {/* Call to Action */}
            <div className='mb-10 flex flex-col items-center justify-between rounded-lg border-l-4 border-green-400 bg-green-50 p-6 shadow-lg md:flex-row'>
              <div>
                <h3 className='mb-2 text-lg font-bold text-green-800'>
                  Ready to optimize your office supplies?
                </h3>
                <p className='text-green-700'>
                  Reduce waste and save more with smart recommendations!
                </p>
              </div>
              <div className='mt-4 flex gap-4 md:mt-0'>
                <Button
                  size={'sm'}
                  asChild
                  variant='default'
                  className='bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                >
                  <Link to='/recommendations' className='flex items-center justify-center gap-2'>
                    <Lightbulb className='h-5 w-5' /> Recommendations
                  </Link>
                </Button>
              </div>
            </div>
            {/* Navigation Links */}
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
              <Button
                size={'sm'}
                asChild
                variant='default'
                className='bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
              >
                <Link to='/inventory' className='flex items-center justify-center gap-2'>
                  <Package className='h-5 w-5' /> Inventory
                </Link>
              </Button>
              {/* <Button
                size={'sm'}
                asChild
                variant='default'
                className='bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
              >
                <Link to='/recommendations' className='flex items-center justify-center gap-2'>
                  <Lightbulb className='h-5 w-5' /> Recommendations
                </Link>
              </Button> */}
              <Button
                size={'sm'}
                asChild
                variant='default'
                className='bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
              >
                <Link to='/alerts' className='flex items-center justify-center gap-2'>
                  <AlertTriangle className='h-5 w-5' /> Alerts
                </Link>
              </Button>
              <Button
                size={'sm'}
                asChild
                variant='default'
                className='bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
              >
                <Link to='/reports' className='flex items-center justify-center gap-2'>
                  <BarChart className='h-5 w-5' /> Reports
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
