// src/components/TruckDetail/CostEstimator.tsx
import React from 'react';
import { Truck } from '@/models/TruckTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RollingCostCalculator from './RollingCostCalculator';
import LoanCalculator from './LoanCalculator';

interface CostEstimatorProps {
  truck?: Truck;
}

const CostEstimator: React.FC<CostEstimatorProps> = ({ truck }) => {
  const defaultTruck: Truck = {
    id: 'default',
    slug: 'default',
    name: 'Xe tải mẫu',
    shortName: 'Xe tải mẫu',
    brand: 'default',
    category: 'xe-tai',
    type: 'xe-tai',
    price: 500000000,
    priceNote: '',
    payload: 5000,
    images: [],
    description: '',
    features: [],
    specifications: {}
  };

  const vehicleData = truck || defaultTruck;

  if (!vehicleData && !truck) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Công Cụ Dự Toán Chi Phí</h2>
      <Tabs defaultValue="rolling-cost" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="rolling-cost">Dự toán chi phí lăn bánh</TabsTrigger>
          <TabsTrigger value="loan-estimation">Dự toán vay mua xe</TabsTrigger>
        </TabsList>
        <TabsContent value="rolling-cost">
          <RollingCostCalculator truck={vehicleData} />
        </TabsContent>
        <TabsContent value="loan-estimation">
          <LoanCalculator truckPrice={vehicleData.price ?? 500000000} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostEstimator;
