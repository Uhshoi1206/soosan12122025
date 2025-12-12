
import React from 'react';
import { Button } from '@/components/ui/button';
import TruckItem from '@/components/TruckItem';
import { Truck } from '@/models/TruckTypes';

interface VehicleGridProps {
  vehicles?: Truck[];
  initialVehicles?: Truck[];
  onResetFilters?: () => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  initialVehicles = [],
  onResetFilters = () => {}
}) => {
  const displayVehicles = vehicles || initialVehicles;

  if (!displayVehicles || displayVehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">😢</div>
        <h3 className="text-2xl font-bold mb-2">Không tìm thấy kết quả</h3>
        <p className="text-gray-600 mb-4">Vui lòng thử lại với bộ lọc khác</p>
        <Button onClick={onResetFilters}>Đặt lại bộ lọc</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {displayVehicles.map(vehicle => (
        <div key={vehicle.id} className="card-hover group rounded-xl overflow-hidden shadow-md bg-white border transition-all duration-200">
          <TruckItem truck={vehicle} />
        </div>
      ))}
    </div>
  );
};

export default VehicleGrid;
