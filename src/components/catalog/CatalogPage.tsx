import React, { useState, useEffect } from 'react';
import VehicleTypeTabs from './VehicleTypeTabs';
import FilterSidebar from '../FilterSidebar';
import VehicleGrid from './VehicleGrid';
import { Truck, TruckFilters, VehicleType } from '@/models/TruckTypes';
import { useVehicleFiltering } from '@/hooks/useVehicleFiltering';

interface CatalogPageProps {
  initialVehicles: Truck[];
  initialSearchQuery?: string;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ initialVehicles, initialSearchQuery = '' }) => {
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [filters, setFilters] = useState<TruckFilters>({
    brand: null,
    minPrice: null,
    maxPrice: null,
    minWeight: null,
    maxWeight: null,
    vehicleType: null,
    search: initialSearchQuery || null
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type') as VehicleType | null;
      const brandParam = params.get('brand');
      const searchParam = params.get('search') || params.get('q');
      const minWeightParam = params.get('minWeight');
      const maxWeightParam = params.get('maxWeight');

      if (typeParam) {
        setSelectedType(typeParam);
        setFilters(prev => ({ ...prev, vehicleType: typeParam }));
      }

      if (brandParam) {
        setFilters(prev => ({ ...prev, brand: brandParam }));
      }

      if (searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam }));
      }

      if (minWeightParam && maxWeightParam) {
        const minWeight = parseFloat(minWeightParam);
        const maxWeight = parseFloat(maxWeightParam);
        if (!isNaN(minWeight) && !isNaN(maxWeight)) {
          setFilters(prev => ({
            ...prev,
            minWeight: minWeight,
            maxWeight: maxWeight
          }));
        }
      }
    }
  }, []);

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    setFilters(prev => ({ ...prev, vehicleType: type }));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('type', type);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleFilterChange = (keyOrFilters: keyof TruckFilters | TruckFilters, value?: any) => {
    let newFilters: TruckFilters;

    if (typeof keyOrFilters === 'object') {
      newFilters = { ...keyOrFilters };
    } else {
      newFilters = { ...filters, [keyOrFilters]: value };
    }

    setFilters(newFilters);

    // Sync selectedType with vehicleType from filters
    if (newFilters.vehicleType !== selectedType) {
      setSelectedType(newFilters.vehicleType);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (newFilters.vehicleType) params.set('type', newFilters.vehicleType);
      if (newFilters.brand) params.set('brand', newFilters.brand);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.minWeight !== null && newFilters.maxWeight !== null) {
        params.set('minWeight', String(newFilters.minWeight));
        params.set('maxWeight', String(newFilters.maxWeight));
      }

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleResetFilters = () => {
    const emptyFilters: TruckFilters = {
      brand: null,
      minPrice: null,
      maxPrice: null,
      minWeight: null,
      maxWeight: null,
      vehicleType: null,
      search: null
    };
    setFilters(emptyFilters);
    setSelectedType(null);

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const { filteredVehicles } = useVehicleFiltering(initialVehicles, selectedType, {
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minWeight: filters.minWeight,
    maxWeight: filters.maxWeight,
    search: filters.search
  });

  return (
    <>
      <VehicleTypeTabs
        selectedType={selectedType || 'xe-tai'}
        onTypeChange={handleTypeChange}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <aside className="lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            vehicles={filteredVehicles}
          />
        </aside>

        <main className="flex-1">
          <VehicleGrid
            vehicles={filteredVehicles}
            initialVehicles={initialVehicles}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </>
  );
};

export default CatalogPage;
