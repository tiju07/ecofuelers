import React, { useState } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';
import { Button } from '@app/components/ui/button';
import { Card } from '@app/components/ui/card';

// Simple skeleton component
const Skeleton: React.FC = () => (
  <div className='animate-pulse space-y-4'>
    <div className='mx-auto h-8 w-1/2 rounded bg-gray-200' />
    <div className='h-64 rounded bg-gray-200' />
  </div>
);

const Reports: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'excel' | ''>('');
  const downloadReport = async (format: 'pdf' | 'excel') => {
    try {
      setFileType(format);
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/inventory/reports/usage/export?format=${format}`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download report. Please try again later.');
    } finally {
      setLoading(false);
      setFileType('');
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='animate-fade-in mx-auto max-w-6xl rounded-xl border border-green-200 bg-white p-6 shadow-lg'>
        <h1 className='mb-6 text-center text-3xl font-bold text-[#2E7D32]'>
          Sustainability Reports 📊
        </h1>

        {error && <p className='mb-4 text-center text-red-500'>{error}</p>}

        <div className='mb-6 flex justify-end gap-4'>
          <Button
            className='transform rounded-lg bg-[#2E7D32] px-6 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#1B5E20]'
            onClick={() => downloadReport('pdf')}
            disabled={loading}
            variant={'primary'}
            size={'sm'}
          >
            {loading && fileType == 'pdf' ? 'Downloading...' : 'Download PDF Report'}
          </Button>
          <Button
            variant={'primary'}
            size={'sm'}
            className='transform rounded-lg bg-[#2E7D32] px-6 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#1B5E20]'
            onClick={() => downloadReport('excel')}
            disabled={loading}
          >
            {loading && fileType == 'excel' ? 'Downloading...' : 'Download CSV Report'}
          </Button>
        </div>

        {loading ? <Skeleton /> : <ChartComponent />}
      </Card>
    </div>
  );
};

export default Reports;
