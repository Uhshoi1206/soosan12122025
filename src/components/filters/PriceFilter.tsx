
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onPriceChange,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <h3 className="text-base font-medium mb-2">Giá xe</h3>
      <div className="px-2">
        <Slider
          defaultValue={[0, 1000000000]}
          max={1000000000}
          step={10000000}
          value={priceRange}
          onValueChange={onPriceChange}
          className="mb-6"
        />
        <div className="flex justify-between text-sm">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
};
