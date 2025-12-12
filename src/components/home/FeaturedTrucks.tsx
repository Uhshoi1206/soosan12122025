
import React from 'react';
import { Button } from '@/components/ui/button';
import TruckItem from '@/components/TruckItem';
import { Truck } from '@/models/TruckTypes';
import SectionTitle from '@/components/SectionTitle';

interface FeaturedTrucksProps {
  trucks: Truck[];
}

const FeaturedTrucks = ({ trucks }: FeaturedTrucksProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Xe Tải Nổi Bật"
          description="Những dòng xe tải bán chạy nhất với chất lượng vượt trội và giá thành hợp lý, đang được nhiều doanh nghiệp vận tải lựa chọn."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.slice(0, 3).map(truck => (
            <TruckItem key={truck.id} truck={truck} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="px-6 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold">
            <a href="/danh-muc-xe?type=xe-tai" className="flex items-center gap-2">
              Xem tất cả xe tải
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrucks;
