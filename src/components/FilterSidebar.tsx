
import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Filter, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { TruckFilters, Truck } from '@/models/TruckTypes';
import { VehicleTypeFilter } from './filters/VehicleTypeFilter';
import { BrandFilter } from './filters/BrandFilter';
import { PriceFilter } from './filters/PriceFilter';
import { WeightFilter } from './filters/WeightFilter';

interface FilterSidebarProps {
  filters?: TruckFilters;
  onFilterChange?: (key: keyof TruckFilters | TruckFilters, value?: any) => void;
  onResetFilters?: () => void;
  className?: string;
  vehicles: Truck[]; // Nhận danh sách xe từ props để truyền vào BrandFilter
}

const defaultFilters: TruckFilters = {
  brand: null,
  minPrice: null,
  maxPrice: null,
  minWeight: null,
  maxWeight: null,
  vehicleType: null,
  search: null
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters = defaultFilters,
  onFilterChange = () => {},
  onResetFilters = () => {},
  className = "",
  vehicles
}) => {
  const [localFilters, setLocalFilters] = useState<TruckFilters>(filters);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000000]);
  const [weightRange, setWeightRange] = useState<number[]>([0, 100]);
  const [searchInput, setSearchInput] = useState<string>(filters?.search || '');

  useEffect(() => {
    setLocalFilters(filters);
    if (filters.minPrice !== null && filters.maxPrice !== null) {
      setPriceRange([filters.minPrice, filters.maxPrice]);
    }
    if (filters.minWeight !== null && filters.maxWeight !== null) {
      setWeightRange([filters.minWeight, filters.maxWeight]);
    }
    setSearchInput(filters.search || '');
  }, [filters]);

  const handleFilterChange = (key: keyof TruckFilters, value: any) => {
    console.log(`Thay đổi filter ${key}:`, value);
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setLocalFilters({
      ...localFilters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleWeightChange = (value: number[]) => {
    setWeightRange(value);
    setLocalFilters({
      ...localFilters,
      minWeight: value[0],
      maxWeight: value[1],
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
    onFilterChange('search', searchInput);
  };

  const handleApplyFilters = () => {
    console.log("Áp dụng bộ lọc:", localFilters);
    
    // Truyền toàn bộ object filters
    onFilterChange(localFilters);
    
    toast({
      title: "Đã áp dụng bộ lọc",
      description: "Danh sách sản phẩm đã được cập nhật.",
    });
  };

  const handleResetFilters = () => {
    setLocalFilters({
      brand: null,
      minPrice: null,
      maxPrice: null,
      minWeight: null,
      maxWeight: null,
      vehicleType: null,
      search: null
    });
    setPriceRange([0, 1000000000]);
    setWeightRange([0, 100]);
    setSearchInput('');
    onResetFilters();
    
    toast({
      title: "Đã đặt lại bộ lọc",
      description: "Tất cả bộ lọc đã được xóa.",
    });
  };

  return (
    <div className={`bg-white p-5 rounded-lg shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Bộ lọc tìm kiếm
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-gray-500 hover:text-primary"
        >
          Đặt lại
        </Button>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder="Tìm xe tải..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Separator />

        <VehicleTypeFilter
          selectedType={localFilters.vehicleType}
          onTypeChange={(value) => handleFilterChange('vehicleType', value)}
        />

        <Separator />

        <BrandFilter
          selectedBrand={localFilters.brand}
          onBrandChange={(value) => handleFilterChange('brand', value)}
          vehicles={vehicles}
        />

        <Separator />

        <PriceFilter
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
        />

        <Separator />

        <WeightFilter
          weightRange={weightRange}
          onWeightChange={handleWeightChange}
        />

        <Button
          onClick={handleApplyFilters}
          className="w-full bg-primary hover:bg-primary-700"
        >
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
