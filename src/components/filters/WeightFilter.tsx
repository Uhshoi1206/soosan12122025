
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

// Định nghĩa các phạm vi trọng lượng
const truckWeights = [
  { id: 1, name: "Dưới 1 tấn", minWeight: 0, maxWeight: 1 },
  { id: 2, name: "1 - 2 tấn", minWeight: 1, maxWeight: 2 },
  { id: 3, name: "2 - 3.5 tấn", minWeight: 2, maxWeight: 3.5 },
  { id: 4, name: "3.5 - 5 tấn", minWeight: 3.5, maxWeight: 5 },
  { id: 5, name: "5 - 8 tấn", minWeight: 5, maxWeight: 8 },
  { id: 6, name: "8 - 15 tấn", minWeight: 8, maxWeight: 15 },
  { id: 7, name: "15 - 20 tấn", minWeight: 15, maxWeight: 20 },
  { id: 8, name: "Trên 20 tấn", minWeight: 20, maxWeight: 100 }
];

interface WeightFilterProps {
  weightRange: number[];
  onWeightChange: (value: number[]) => void;
}

// Lưu trữ giá trị tải trọng tối đa
const MAX_WEIGHT = 100;

export const WeightFilter: React.FC<WeightFilterProps> = ({
  weightRange,
  onWeightChange,
}) => {
  // Theo dõi xem đã có filter nào được áp dụng chưa
  const [isFiltered, setIsFiltered] = useState(false);
  
  useEffect(() => {
    // Kiểm tra nếu giá trị hiện tại khác với giá trị mặc định
    if (weightRange[0] > 0 || weightRange[1] < MAX_WEIGHT) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [weightRange]);
  
  // Hiển thị tên phạm vi tải trọng dựa trên giá trị đã chọn
  const getWeightRangeLabel = () => {
    // Nếu chưa có filter nào được áp dụng, trả về trạng thái mặc định
    if (!isFiltered && weightRange[0] === 0 && weightRange[1] >= MAX_WEIGHT) {
      return "Tất cả tải trọng";
    }
    
    // Tìm xem phạm vi trọng lượng hiện tại có khớp với một trong các phạm vi đã định nghĩa không
    const matchingWeight = truckWeights.find(
      w => Math.abs(w.minWeight - weightRange[0]) < 0.1 && 
           Math.abs(w.maxWeight - weightRange[1]) < 0.1
    );
    
    if (matchingWeight) {
      return matchingWeight.name;
    }
    
    // Các trường hợp khác, hiển thị theo khoảng giá trị
    return `${weightRange[0]} - ${weightRange[1]} tấn`;
  };

  return (
    <div>
      <h3 className="text-base font-medium mb-2">Tải trọng</h3>
      <div className="px-2">
        <Slider
          defaultValue={[0, MAX_WEIGHT]}
          max={MAX_WEIGHT}
          step={0.5}
          value={weightRange}
          onValueChange={onWeightChange}
          className="mb-6"
        />
        <div className="flex justify-between text-sm">
          <span>{weightRange[0]} tấn</span>
          <span>{weightRange[1] >= MAX_WEIGHT ? `Trên ${MAX_WEIGHT} tấn` : `${weightRange[1]} tấn`}</span>
        </div>
        
        {/* Hiển thị thông tin chi tiết về phạm vi tải trọng đang chọn */}
        <div className="text-xs text-muted-foreground mt-2 text-center font-medium">
          Đang chọn: <span className="text-primary">{getWeightRangeLabel()}</span>
        </div>
      </div>
    </div>
  );
};
