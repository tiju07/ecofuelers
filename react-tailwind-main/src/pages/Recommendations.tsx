import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Box, Lightbulb, PlusCircle } from 'lucide-react';

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get('http://localhost:8000/inventory/recommendations');
        setRecommendations(res.data || []);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className='min-h-screen bg-green-50 px-4 py-10 md:px-10'>
      <Card className='mx-auto max-w-6xl rounded-xl bg-white p-6 shadow-lg'>
        <h1 className='mb-6 text-center text-3xl font-bold text-[#2E7D32]'>
          AI-Powered Supply Recommendations 🌿
        </h1>

        {loading ? (
          <div className='animate-pulse space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-32 rounded-xl bg-gray-200 p-6' />
              ))}
            </div>
          </div>
        ) : error ? (
          <p className='text-center text-red-600'>{error}</p>
        ) : recommendations.length === 0 ? (
          <p className='text-center text-gray-700'>No recommendations at this time.</p>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {recommendations.map((rec, index) => (
              <Card
                key={index}
                className='animate-fade-in transform rounded-lg border border-green-200 bg-white shadow-md transition duration-300 hover:scale-105 hover:shadow-lg'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className={''}>
                  <div className='flex items-center space-x-2'>
                    <Lightbulb className='h-6 w-6 text-[#2E7D32]' />
                    <CardTitle className='text-xl font-semibold text-[#2E7D32]'>
                      {rec.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                    <Box className='h-5 w-5 text-gray-500' />
                    <span className='text-gray-600'>Current Stock:</span>
                    <span className='text-gray-800'>{rec.current_stock}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <PlusCircle className='h-5 w-5 text-[#2E7D32]' />
                    <span className='text-gray-600'>Recommended Order:</span>
                    <span className='font-bold text-[#2E7D32]'>
                      {rec.recommended_order_quantity ? rec.recommended_order_quantity : 'N/A'}
                    </span>
                  </div>
                  <div>
                    {/* <span className='text-gray-600'>Issues:</span> */}
                    {Array.isArray(rec.conflicts) && rec.conflicts.length > 0 && (
                      <div className='mt-1 flex flex-wrap gap-2'>
                        {Array.isArray(rec.conflicts) && rec.conflicts.length > 0 ? (
                          rec.conflicts.map((conflict: string, idx: number) => (
                            <span
                              key={idx}
                              className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'
                            >
                              {conflict}
                            </span>
                          ))
                        ) : rec.conflicts ? (
                          <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
                            {rec.conflicts}
                          </span>
                        ) : (
                          <span className='text-gray-500'>None</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecommendationPage;
