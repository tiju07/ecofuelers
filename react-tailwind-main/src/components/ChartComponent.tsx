import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card } from '@app/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [savingsData, setSavingsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usageRes, savingsRes] = await Promise.all([
          axios.get('http://localhost:8000/inventory/usage/history'),
          axios.get('http://localhost:8000/inventory/savings/history'),
        ]);

        setUsageData(usageRes.data);
        setSavingsData(savingsRes.data);
      } catch (err) {
        setError('Failed to fetch chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usageChartData = {
    labels: usageData?.dates || [],
    datasets: [
      {
        label: 'Supply Usage',
        data: usageData?.values || [],
        borderColor: '#2E7D32',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(46, 125, 50, 0.3)');
          gradient.addColorStop(1, 'rgba(46, 125, 50, 0.1)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2E7D32',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#1B5E20',
      },
    ],
  };

  const savingsChartData = {
    labels: savingsData?.months || [],
    datasets: [
      {
        label: 'Cost Savings',
        data: savingsData?.values || [],
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(46, 125, 50, 0.6)');
          gradient.addColorStop(1, 'rgba(46, 125, 50, 0.2)');
          return gradient;
        },
        borderColor: '#1B5E20',
        borderWidth: 1,
        hoverBackgroundColor: '#2E7D32',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#2E7D32',
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: '#1B5E20',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#2E7D32',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#2E7D32' },
      },
      y: {
        grid: { color: 'rgba(46, 125, 50, 0.1)' },
        ticks: { color: '#2E7D32' },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
  };

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {loading ? (
        <div className='col-span-2 flex items-center justify-center gap-6'>
          <div className='w-full md:w-1/2'>
            <div className='animate-pulse rounded-lg border border-green-200 bg-gray-100 p-4 shadow-md'>
              <div className='mb-4 h-6 w-1/3 rounded bg-green-200'></div>
              <div className='h-[300px] rounded bg-green-100'></div>
            </div>
          </div>
          <div className='w-full md:w-1/2'>
            <div className='animate-pulse rounded-lg border border-green-200 bg-gray-100 p-4 shadow-md'>
              <div className='mb-4 h-6 w-1/3 rounded bg-green-200'></div>
              <div className='h-[300px] rounded bg-green-100'></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className='col-span-2 text-center text-red-500'>{error}</p>
      ) : (
        <>
          <Card
            className='animate-fade-in rounded-lg border border-green-200 bg-white p-4 shadow-md transition-transform duration-300 hover:scale-102 hover:shadow-lg'
            style={{ animationDelay: '0.1s' }}
          >
            <h2 className='mb-2 text-lg font-semibold text-[#2E7D32]'>Usage Trends</h2>
            <div className='h-[300px]'>
              <Line data={usageChartData} options={chartOptions} />
            </div>
          </Card>
          <Card
            className='animate-fade-in rounded-lg border border-green-200 bg-white p-4 shadow-md transition-transform duration-300 hover:scale-102 hover:shadow-lg'
            style={{ animationDelay: '0.2s' }}
          >
            <h2 className='mb-2 text-lg font-semibold text-[#2E7D32]'>Cost Savings</h2>
            <div className='h-[300px]'>
              <Bar data={savingsChartData} options={chartOptions} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChartComponent;
