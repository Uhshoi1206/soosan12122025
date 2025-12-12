
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { Truck } from '@/models/TruckTypes';

interface BrandFilterProps {
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  vehicles: Truck[]; // Nhận danh sách xe từ props
}

// Helper function để lấy danh sách thương hiệu từ vehicles
const getTruckBrands = (vehicles: Truck[]) => {
  const CANONICAL_BRAND_MAP: Record<string, string> = {
    'hyundai': 'Hyundai',
    'isuzu': 'Isuzu',
    'hino': 'Hino',
    'dongfeng': 'Dongfeng',
    'thaco': 'Thaco',
    'kia': 'Kia',
    'suzuki': 'Suzuki',
    'veam': 'VEAM',
    'soosan': 'Soosan',
    'doosung': 'DOOSUNG',
    'cimc': 'CIMC',
    'koksan': 'KOKSAN',
    'howo': 'HOWO',
  };

  const toCanonical = (raw: string) => {
    const key = raw.trim().toLowerCase();
    return CANONICAL_BRAND_MAP[key] || raw.trim();
  };

  const map = new Map<string, string>();
  for (const v of vehicles) {
    const brands = Array.isArray(v.brand) ? v.brand : [v.brand];
    brands.filter(Boolean).forEach((b) => {
      const key = String(b).trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) map.set(key, toCanonical(String(b)));
    });
  }

  const names = Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'vi'));
  return names.map((name, idx) => ({ id: idx + 1, name }));
};

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onBrandChange,
  vehicles,
}) => {
  const truckBrands = getTruckBrands(vehicles);
  console.log("BrandFilter được render với selectedBrand:", selectedBrand);

  return (
    <div>
      <h3 className="text-base font-medium mb-2">Thương hiệu</h3>
      <div className="space-y-2">
        {truckBrands.map((brand) => (
          <div key={brand.id} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand.id}`}
              checked={selectedBrand === brand.name}
              onCheckedChange={(checked) => {
                console.log(`Chọn brand ${brand.name}:`, checked);
                onBrandChange(checked ? brand.name : null);
              }}
            />
            <Label
              htmlFor={`brand-${brand.id}`}
              className="cursor-pointer text-sm flex-1"
            >
              {brand.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
