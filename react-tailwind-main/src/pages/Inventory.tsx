import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SupplyForm from '../components/SupplyForm';
import UsageForm from '../components/UsageForm';
import { Button } from '@app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@app/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Package, Leaf, Recycle, Lightbulb, Box, BarChart, PlusCircle, Truck } from 'lucide-react';
import { getCookie } from 'src/context/Services';
import { toast } from 'sonner';

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savings, setSavings] = useState<number>(0);
  const [wasteReduction, setWasteReduction] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [savingsPercentage, setSavingsPercentage] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchSupplies = async (input: string) => {
    if (input.trim() === 'add_supplies') toast.success('Supply added successfully!');
    if (input.trim() === 'update_supplies') toast.success('Supply updated successfully!');
    if (input.trim() === 'record_usage') toast.success('Usage recorded successfully!');

    setLoading(true);
    setError(null);
    try {
      const jwtToken = getCookie('auth_token');
      const [suppliesRes, savingsRes, , recRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/inventory/supplies', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
        axios.get('http://127.0.0.1:8000/inventory/savings', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
        axios.get('http://127.0.0.1:8000/inventory/alerts', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
        axios.get('http://localhost:8000/inventory/recommendations', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
      ]);

      const totalStock = recRes.data.reduce(
        (sum: number, item: any) => sum + item.current_stock,
        0
      );

      const totalOverstock = savingsRes.data.reduce(
        (sum: number, item: any) => sum + item.overstock_quantity,
        0
      );

      const wasteReduction = totalStock > 0 ? (totalOverstock / totalStock) * 100 : 0;

      const totalSavings = Array.isArray(savingsRes.data)
        ? savingsRes.data.reduce((sum: number, item: any) => sum + (item.estimated_savings || 0), 0)
        : 0;

      setSupplies(suppliesRes.data);
      setSavings(totalSavings || 0);
      setWasteReduction(wasteReduction || 0);
      setRecommendations(recRes.data || []);

      let originalCost = 0;
      let optimizedCost = 0;

      suppliesRes.data.forEach((supply: any) => {
        console.log(supply);
        const recommendation = recRes.data.find((r: any) => r.supply_id === supply.id);
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
      setError('Failed to fetch inventory data. Please try again later.');
      toast.error('Failed to fetch inventory data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies('');
  }, []);

  const totalPages = Math.ceil(supplies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSupplies = supplies.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='relative z-10 container mx-auto p-4'>
      {loading ? (
        <div className='animate-pulse space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-32 rounded-xl bg-gray-200 p-6' />
            ))}
          </div>
          <div className='flex justify-end gap-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-10 w-32 rounded bg-gray-200' />
            ))}
          </div>
          <div className='rounded-xl bg-gray-200 p-6'>
            <div className='mb-4 h-6 w-1/4 rounded bg-gray-300' />
            <div className='mb-2 h-10 w-full rounded bg-gray-300' />
            <div className='mb-2 h-10 w-full rounded bg-gray-300' />
            <div className='h-10 w-full rounded bg-gray-300' />
          </div>
        </div>
      ) : error ? (
        <p className='text-center text-red-500'>{error}</p>
      ) : (
        <>
          <h1 className='mb-6 text-center text-3xl font-bold text-[#2E7D32]'>Inventory</h1>
          <div className='mb-8 grid transform grid-cols-1 gap-6 transition-transform md:grid-cols-3'>
            <Card className='flex transform flex-col items-center rounded-xl bg-white p-6 shadow-md transition-transform hover:scale-105'>
              <Package className='h-12 w-12 text-[#2E7D32]' />
              <h2 className='mt-2 text-lg font-bold text-gray-800'>Total Supplies</h2>
              <p className='text-3xl font-bold text-[#2E7D32]'>{supplies?.length}</p>
            </Card>
            <Card className='flex flex-col items-center rounded-xl bg-white p-6 shadow-md transition-transform hover:scale-105'>
              <Leaf className='h-12 w-12 text-[#388E3C]' />
              <h2 className='mt-2 text-lg font-bold text-gray-800'>Estimated Savings</h2>
              <p className='text-3xl font-bold text-[#388E3C]'>
                ₹{savings.toLocaleString('en-IN')}
              </p>
              <span className='mt-2 rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-700'>
                Up to {savingsPercentage}% savings!
              </span>
            </Card>
            <Card className='flex flex-col items-center rounded-xl bg-white p-6 shadow-md transition-transform hover:scale-105'>
              <Recycle className='h-12 w-12 text-[#388E3C]' />
              <h2 className='mt-2 text-lg font-bold text-gray-800'>Waste Reduction</h2>
              <p className='text-3xl font-bold text-[#388E3C]'>{wasteReduction.toFixed(2)}%</p>
              <span className='mt-2 rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-700'>
                Zero-waste goal
              </span>
            </Card>
          </div>
          <div className='mb-4 flex justify-end gap-4'>
            {user.role === 'admin' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='bg-[#2E7D32] text-white' size={'sm'} variant={'default'}>
                    Add/Update Supply
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-lg'>
                  <DialogHeader className={''}>
                    <DialogTitle className={''}>Supply Form</DialogTitle>
                  </DialogHeader>
                  <SupplyForm onSuccess={() => fetchSupplies('add_supplies')} />
                </DialogContent>
              </Dialog>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button className='bg-[#2E7D32] text-white' size={'sm'} variant={'default'}>
                  Record Usage
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-lg'>
                <DialogHeader className={''}>
                  <DialogTitle className={''}>Usage Form</DialogTitle>
                </DialogHeader>
                <UsageForm onSuccess={() => fetchSupplies('record_usage')} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='bg-[#2E7D32] text-white' size={'sm'} variant={'primary'}>
                  View AI Recommendations
                </Button>
              </DialogTrigger>
              <DialogContent className='min-w-[50vw]' showCloseButton={true}>
                <DialogHeader className={''}>
                  <DialogTitle className={''}>AI Recommendations</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {recommendations.slice(0, 4).map((rec, index) => (
                    <Card
                      key={index}
                      className='animate-fade-in rounded-lg border-2 border-green-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className={''}>
                        <div className='flex items-center space-x-2'>
                          <Lightbulb className='h-6 w-6 text-[#2E7D32]' />
                          <CardTitle className='text-xl font-semibold text-[#2E7D32]'>
                            Item: {rec.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <Box className='h-5 w-5 text-gray-500' />
                          <span className='text-gray-600'>Current Stock:</span>
                          <span className='text-gray-800'>{rec.current_stock}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <BarChart className='h-5 w-5 text-gray-500' />
                          <span className='text-gray-600'>Avg Weekly Usage:</span>
                          <span className='text-gray-800'>
                            {rec.avg_weekly_usage ? Math.round(rec.avg_weekly_usage) : 'N/A'}
                          </span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <PlusCircle className='h-5 w-5 text-[#2E7D32]' />
                          <span className='text-gray-600'>Recommended Quantity:</span>
                          <span className='font-bold text-[#2E7D32]'>
                            {rec.recommended_order_quantity
                              ? Math.round(rec.recommended_order_quantity)
                              : 'N/A'}
                          </span>
                        </div>
                        {/* <div className='flex items-center space-x-2'>
                          <Truck className='h-5 w-5 text-gray-500' />
                          <span className='text-gray-600'>Supplier:</span>
                          <span className='text-gray-800'>{rec.supplier}</span>
                        </div> */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card className='rounded-xl shadow-md'>
            <CardHeader className=''>
              <CardTitle className=''>Supplies List</CardTitle>
            </CardHeader>
            <CardContent className=''>
              <Table className='w-full'>
                <TableHeader className='bg-gray-100'>
                  <TableRow className=''>
                    <TableHead className='text-left'>ID</TableHead>
                    <TableHead className='text-left'>Name</TableHead>
                    <TableHead className='text-left'>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className=''>
                  {currentSupplies.length === 0 ? (
                    <TableRow className=''>
                      <TableCell colSpan={3} className='text-center text-gray-500'>
                        No supplies found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentSupplies.map((supply: any) => (
                      <TableRow key={supply.id} className='hover:bg-gray-50'>
                        <TableCell className=''>{supply.id}</TableCell>
                        <TableCell className=''>{supply.name}</TableCell>
                        <TableCell className=''>{supply.quantity}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className='mt-4 flex items-center justify-between'>
                <Button
                  size={'sm'}
                  variant={'default'}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className=''
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size={'sm'}
                  variant={'default'}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className=''
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Inventory;
