
import React from 'react';
import { Truck, getVehicleUrlPrefix, getStockStatusInfo } from '@/models/TruckTypes';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContextAstro';
import { GitCompare } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface TruckItemProps {
  truck: Truck;
}

const TruckItem = ({ truck }: TruckItemProps) => {
  const vehicleUrlPrefix = getVehicleUrlPrefix(truck.type);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const { addToCompare, removeFromCompare, isInCompare, compareItems } = useCompare();

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('TruckItem: handleToggleCompare clicked for:', truck.name);

    if (isInCompare(truck.id)) {
      console.log('TruckItem: Removing from compare');
      removeFromCompare(truck.id);
    } else {
      console.log('TruckItem: Adding to compare');
      addToCompare(truck);

      if (compareItems.length >= 1) {
        setTimeout(() => {
          const shouldNavigate = window.confirm('Bạn đã thêm xe vào danh sách so sánh. Bạn có muốn đi đến trang so sánh ngay bây giờ không?');
          if (shouldNavigate) {
            window.location.href = '/so-sanh-xe';
            window.scrollTo(0, 0);
          }
        }, 300);
      }
    }
  };

  // Hàm để hiển thị thương hiệu - hỗ trợ mảng thương hiệu
  const renderBrands = () => {
    if (Array.isArray(truck.brand)) {
      return truck.brand.join(' • ');
    }
    return truck.brand;
  };

  // Get stock status info for display
  const stockInfo = getStockStatusInfo(truck.stockStatus);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
      <div className="relative">
        <a href={`/${vehicleUrlPrefix}/${truck.slug}`} onClick={() => window.scrollTo(0, 0)}>
          <OptimizedImage
            src={truck.thumbnailUrl}
            alt={truck.name}
            className="w-full h-48 object-contain bg-gray-50"
            useCase="thumbnail"
          />
        </a>

        {/* Nút so sánh với icon luôn hiển thị và văn bản chỉ hiển thị khi hover */}
        {isClient && (
          <button
            onClick={handleToggleCompare}
            className={`
              absolute bottom-2 right-2
              flex items-center justify-center gap-1
              py-1 rounded
              transition-all duration-300
              ${isInCompare(truck.id)
                ? 'bg-primary text-white hover:bg-primary-800'
                : 'bg-white/80 hover:bg-white border border-gray-200 text-gray-700 hover:text-primary'
              }
              shadow-md hover:shadow-lg
            `}
            title={isInCompare(truck.id) ? "Đã thêm vào so sánh" : "Thêm vào so sánh"}
            aria-label={isInCompare(truck.id) ? "Đã thêm vào so sánh" : "Thêm vào so sánh"}
          >
            <GitCompare className="h-5 w-5" style={{ color: isInCompare(truck.id) ? 'white' : '#ef4444' }} />
            <span className={`text-xs font-medium transition-all duration-300 max-w-0 overflow-hidden whitespace-nowrap hover:max-w-[80px] group-hover:max-w-[80px] ${isInCompare(truck.id) ? 'pl-0 group-hover:pl-1 hover:pl-1' : 'pl-0 group-hover:pl-1 hover:pl-1'}`}>
              {isInCompare(truck.id) ? "Đã thêm" : "So sánh"}
            </span>
          </button>
        )}

        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {truck.isNew && (
            <Badge className="bg-primary-600 hover:bg-primary-700 text-white">Mới</Badge>
          )}
          {truck.isHot && (
            <Badge className="bg-primary hover:bg-primary-800 text-white">Hot</Badge>
          )}
          {/* Stock status badge - only show for non-in-stock items */}
          {stockInfo.show && (
            <Badge className={stockInfo.className}>{stockInfo.label}</Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div>
          <span className="text-gray-500 text-sm">
            {renderBrands()}
          </span>
          <a href={`/${vehicleUrlPrefix}/${truck.slug}`} className="group" onClick={() => window.scrollTo(0, 0)}>
            <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
              {truck.name}
            </h3>
          </a>
        </div>

        <div className="mt-auto pt-4">
          <div className="text-sm text-gray-600 mb-2">
            <div className="flex justify-between mb-1">
              <span>Tải trọng:</span>
              <span className="font-medium">{truck.weightText}</span>
            </div>
            <div className="flex justify-between">
              <span>Kích thước:</span>
              <span className="font-medium">{truck.length} m</span>
            </div>
          </div>

          <div className="text-primary font-bold text-lg mt-2">
            {truck.priceText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckItem;
