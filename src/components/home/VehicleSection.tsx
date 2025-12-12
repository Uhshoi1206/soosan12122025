
import React from 'react';
import { Button } from '@/components/ui/button';
import TruckItem from '@/components/TruckItem';
import { Truck, VehicleType } from '@/models/TruckTypes';
import SectionTitle from '@/components/SectionTitle';

interface VehicleSectionProps {
  title: string;
  description: string;
  vehicles: Truck[];
  type: VehicleType;
  linkText: string;
  className?: string;
}

const VehicleSection = ({
  title,
  description,
  vehicles,
  type,
  linkText,
  className = ''
}: VehicleSectionProps) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionTitle 
          title={title}
          description={description}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <TruckItem key={vehicle.id} truck={vehicle} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="px-6 border-primary text-primary hover:bg-primary/10">
            <a href={`/danh-muc-xe?type=${type}`} className="flex items-center gap-2">
              {linkText}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VehicleSection;
