
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VehicleType } from '@/models/TruckTypes';
import { getEnabledTypes, getCategoryName } from '@/lib/generated/categories';

interface VehicleTypeFilterProps {
  selectedType: VehicleType | null;
  onTypeChange: (value: VehicleType | null) => void;
}


export const VehicleTypeFilter: React.FC<VehicleTypeFilterProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const enabledTypes = new Set(getEnabledTypes());
  const options = Array.from(enabledTypes).map((value) => ({ value, label: getCategoryName(value) }));
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Loại xe</Label>
      <RadioGroup
        value={selectedType || ''}
        onValueChange={(value) => {
          const newValue = value as VehicleType | '';
          onTypeChange(newValue || null);
        }}
      >
        {options.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <RadioGroupItem value={type.value} id={`type-${type.value}`} />
            <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
