
import { Truck, VehicleType } from '@/models/TruckTypes';

// Lưu trữ giá trị tối đa tải trọng
const MAX_WEIGHT = 100;

export const useVehicleFiltering = (vehicles: Truck[], selectedType: VehicleType | null, filters: {
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  search: string | null;
}) => {
  console.log("useVehicleFiltering được gọi với:", { selectedType, filters });
  
  // Bắt đầu với tất cả xe
  const uniqueVehicles = [...new Map(vehicles.map(item => [item.id, item])).values()];
  let filteredVehicles = [...uniqueVehicles];
  
  // Lọc theo loại xe
  if (selectedType) {
    console.log(`Lọc theo loại xe: ${selectedType}`);
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === selectedType);
  }
  console.log(`Sau khi lọc theo loại xe: ${filteredVehicles.length} xe`);
  
  // Áp dụng các bộ lọc khác
  filteredVehicles = filteredVehicles.filter(vehicle => {
    // Lọc theo thương hiệu - cập nhật để hỗ trợ mảng thương hiệu
    if (filters.brand) {
      const vehicleBrands = Array.isArray(vehicle.brand) ? vehicle.brand : [vehicle.brand];
      const brandMatches = vehicleBrands.some(brand => 
        brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
      if (!brandMatches) {
        return false;
      }
    }
    
    // Lọc theo giá (bỏ qua nếu xe chưa có giá)
    if (filters.minPrice !== null && vehicle.price != null && vehicle.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && vehicle.price != null && vehicle.price > filters.maxPrice) {
      return false;
    }
    
    // Lọc theo tải trọng - điều kiện quan trọng!
    if (filters.minWeight !== null && filters.maxWeight !== null) {
      // Xử lý trường hợp đặc biệt cho giá trị tối đa (lọc tất cả tải trọng)
      if (filters.minWeight === 0 && filters.maxWeight >= MAX_WEIGHT) {
        return true; // Không lọc khi chọn toàn bộ phạm vi
      }
      
      // Kiểm tra xem xe có nằm trong phạm vi tải trọng đã chọn không
      if (vehicle.weight < filters.minWeight || vehicle.weight > filters.maxWeight) {
        console.log(`Xe ${vehicle.name} (${vehicle.weight} tấn) bị loại vì không nằm trong khoảng [${filters.minWeight}, ${filters.maxWeight}]`);
        return false;
      }
    }
    
    // Lọc theo từ khóa tìm kiếm - cập nhật để hỗ trợ mảng thương hiệu
    if (filters.search && filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = vehicle.name.toLowerCase().includes(searchLower);
      
      // Cập nhật để tìm kiếm trong mảng thương hiệu
      const vehicleBrands = Array.isArray(vehicle.brand) ? vehicle.brand : [vehicle.brand];
      const brandMatch = vehicleBrands.some(brand => 
        brand.toLowerCase().includes(searchLower)
      );
      
      const descriptionMatch = vehicle.description?.toLowerCase().includes(searchLower);
      
      if (!nameMatch && !brandMatch && !descriptionMatch) {
        return false;
      }
    }
    
    return true;
  });

  console.log("Kết quả lọc cuối cùng:", filteredVehicles.length, "xe");
  
  // Thông tin debug để kiểm tra chi tiết
  if (filters.minWeight !== null && filters.maxWeight !== null) {
    console.log("Chi tiết xe trong kết quả sau lọc:");
    filteredVehicles.forEach(v => {
      console.log(`- ${v.name} (${v.type}): ${v.weight} tấn`);
    });
  }
  
  return { filteredVehicles };
};
