export type VehicleType = string;

export interface TruckBrand {
  id: number;
  name: string;
}

export interface TruckWeight {
  id: number;
  name: string;
  minWeight: number;
  maxWeight: number;
  value?: number | string; // Thêm thuộc tính value để hỗ trợ mã trong useTruckFilters
}

export interface TruckFilters {
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  vehicleType: VehicleType | null;
  search: string | null;
}

// Chi tiết kết cấu thùng cho xe tải thùng đông lạnh, bảo ôn
export interface CoolingBoxStructure {
  wallLayers?: number;
  wallMaterials?: string[];
  floorLayers?: number;
  floorMaterials?: string[];
  roofLayers?: number;
  roofMaterials?: string[];
  doorType?: string;
  insulationThickness?: string;
  refrigerationSystem?: string;
  temperatureRange?: string;

  // Thêm các thông số chi tiết hơn cho thùng đông lạnh
  coolingUnit?: string;        // Đơn vị làm lạnh
  compressorType?: string;     // Loại máy nén
  refrigerantType?: string;    // Loại môi chất lạnh
  temperatureControl?: string; // Hệ thống điều khiển nhiệt độ
  doorSize?: string;           // Kích thước cửa
  doorCount?: number;          // Số lượng cửa
  insideHeight?: number;       // Chiều cao bên trong thùng
  insideWidth?: number;        // Chiều rộng bên trong thùng
  insideLength?: number;       // Chiều dài bên trong thùng
  outsideMaterial?: string;    // Vật liệu bên ngoài
  insideMaterial?: string;     // Vật liệu bên trong
  floorMaterial?: string;      // Vật liệu sàn
  loadingSecurity?: string;    // Hệ thống an toàn hàng hóa
}

// Chi tiết về thùng bảo ôn
export interface InsulatedBoxStructure {
  wallThickness?: string;      // Độ dày vách
  floorThickness?: string;     // Độ dày sàn
  roofThickness?: string;      // Độ dày mái
  insulationMaterial?: string; // Vật liệu cách nhiệt
  outerMaterial?: string;      // Vật liệu bên ngoài
  innerMaterial?: string;      // Vật liệu bên trong
  doorType?: string;           // Loại cửa
  doorCount?: number;          // Số lượng cửa
  temperatureRange?: string;   // Phạm vi nhiệt độ duy trì
  insideDimension?: string;    // Kích thước bên trong
  loadingCapacity?: string;    // Khả năng chịu tải
}

// Chi tiết về thùng kín
export interface ClosedBoxStructure {
  frameStructure?: string;     // Cấu trúc khung
  panelMaterial?: string;      // Vật liệu panel
  thickness?: string;          // Độ dày
  doorType?: string;           // Loại cửa
  doorCount?: number;          // Số lượng cửa
  roofType?: string;           // Loại mái
  floorMaterial?: string;      // Vật liệu sàn
  loadingSecurity?: string;    // Hệ thống an toàn hàng hóa
  reinforcement?: string;      // Gia cường
  waterproofing?: string;      // Chống thấm nước
}

// Chi tiết về thùng bạt
export interface TarpaulinBoxStructure {
  frameStructure?: string;     // Cấu trúc khung
  tarpaulinMaterial?: string;  // Vật liệu bạt
  tarpaulinThickness?: string; // Độ dày bạt
  frameType?: string;          // Loại khung
  sideAccess?: boolean;        // Khả năng tiếp cận từ bên hông
  coverType?: string;          // Loại mui phủ
  floorMaterial?: string;      // Vật liệu sàn
}

// Chi tiết về thùng lửng
export interface FlatbedStructure {
  floorMaterial?: string;      // Vật liệu sàn
  sideHeight?: number | string; // Chiều cao thành bên (có thể là số hoặc chuỗi như "1.3-1.6m")
  sideType?: string;           // Loại thành bên
  sideAccess?: string;         // Khả năng tiếp cận bên hông
  floorThickness?: string;     // Độ dày sàn
  reinforcement?: string;      // Gia cường
}

// Chi tiết về bồn xi téc
export interface TankSpecification {
  capacity?: number;
  capacityText?: string;
  compartments?: number;
  material?: string;
  thickness?: string;
  valveSystem?: string;
  pressureRating?: string;
  dischargingSystem?: string;
  liningMaterial?: string;      // Vật liệu lót trong
  safetyEquipment?: string;     // Thiết bị an toàn
  insulationPresent?: boolean;  // Có cách nhiệt không
  heatingSystem?: string;       // Hệ thống làm nóng
  measurementSystem?: string;   // Hệ thống đo lường
}

// Chi tiết về cẩu
export interface CraneSpecification {
  liftingCapacity?: number; // Sức nâng lớn nhất (kg)
  liftingCapacityText?: string; // Hiển thị dạng text (ví dụ: 10,000 kg / 2.0 m)
  maxLiftingMoment?: string; // Moment nâng lớn nhất (tấn.m)
  maxLiftingHeight?: string; // Chiều cao nâng lớn nhất (m)
  maxWorkingRadius?: string; // Bán kính làm việc lớn nhất (m)

  // Thông số cần cẩu (Boom)
  boomType?: string; // Loại cần (ví dụ: Cần lục giác)
  boomSections?: number; // Số đoạn cần
  boomLength?: string; // Chiều dài cần (m) - ví dụ: 5.6 m ~ 21.8 m
  boomExtensionSpeed?: string; // Tốc độ ra cần (m/s) - ví dụ: 16.25 / 40 (m/s)
  boomLuffingAngle?: string; // Góc nâng cần (độ) - ví dụ: 0° ~ 80°
  boomLuffingSpeed?: string; // Tốc độ nâng cần (độ/s) - ví dụ: 1 ~ 80 / 18 (°/s)

  // Thông số tời (Winch)
  winchRatedSpeed?: string; // Tốc độ tời định mức (m/phút) - ví dụ: 16 (m/phút) (tại lớp thứ 4)
  winchHookSpeed?: string; // Tốc độ móc tời (m/phút)
  winchRopeType?: string; // Loại cáp tời (ø x m) - ví dụ: 10 x 120 IWRC 6xWS(26)

  // Thông số xoay (Swing)
  swingAngle?: string; // Góc xoay (độ) - ví dụ: 360° liên tục
  swingSpeed?: string; // Tốc độ xoay (vòng/phút) - ví dụ: 2.0 (rpm)
  swingReductionType?: string; // Kiểu giảm tốc xoay - ví dụ: Bánh răng trục vít, mô tơ thủy lực

  // Chân chống (Outriggers)
  outriggersFrontExtension?: string; // Chân chống trước - Mở rộng tối đa (m)
  outriggersRearExtension?: string; // Chân chống sau - Mở rộng tối đa (m)
  outriggersType?: string; // Loại chân chống - ví dụ: Mô tơ thủy lực, bánh răng nêm và hộp giảm tốc hành tinh

  // Hệ thống thủy lực (Hydraulic System)
  hydraulicPumpType?: string; // Loại bơm thủy lực
  hydraulicTankCapacity?: string; // Dung tích thùng dầu thủy lực (L) - ví dụ: 65 Lít
  hydraulicOilFlow?: string; // Lưu lượng dầu thủy lực (L/phút) - ví dụ: 65 (L/phút)
  hydraulicOperatingPressure?: string; // Áp suất vận hành thủy lực (kg/cm²) - ví dụ: 210 (kg/cm²)

  // Các thông số cũ nếu vẫn cần thiết
  reachLength?: number; // Tầm với (m) - có thể thay bằng maxWorkingRadius
  reachLengthText?: string;
  rotationAngle?: string; // Đã có swingAngle
  stabilizers?: string; // Đã có outriggers...
  controlSystem?: string; // Hệ thống điều khiển
  operatingPressure?: string; // Đã có hydraulicOperatingPressure
  mountingType?: string;
  cabinPresent?: boolean;
  remoteControl?: boolean;
  maxWorkingHeight?: string; // Đã có maxLiftingHeight
  foldedHeight?: string;
  powerSource?: string;
  safetySystem?: string;
  winchCapacity?: string; // Có thể hiển thị chi tiết hơn ở winchRatedSpeed, winchHookSpeed

  // Thông tin bổ sung (lấy từ hình ảnh)
  craneModelName?: string; // Tên model cẩu, ví dụ: SOOSAN SCS1015LS
  detailedLiftingCapacity?: string[]; // Chi tiết tải trọng nâng theo tầm với, ví dụ: ["8,000 kg / 2.5 m", "2,050 kg / 6.0 m", ...]
}

// Chi tiết về sơ mi rơ mooc
export interface TrailerSpecification {
  axleCount?: number;
  axleType?: string;
  axleWeight?: number;
  kingpinLoad?: number;
  suspensionType?: string;
  brakeSystem?: string;
  floorType?: string;
  floorThickness?: string;
  sideHeight?: number | string; // Cho phép cả number và string
  rampType?: string;
  extensionLength?: number;
  totalLength?: string;          // Chiều dài tổng thể
  wheelbase?: string;            // Khoảng cách trục bánh
  loadingHeight?: string;        // Chiều cao sàn
  turningRadius?: string;        // Bán kính quay vòng
  hydraulicSystem?: string;      // Hệ thống thủy lực (cho mooc ben)
  liftingAngle?: string;         // Góc nâng (cho mooc ben)
  dumpingTime?: string;          // Thời gian đổ (cho mooc ben)
  containerLock?: string;        // Khóa container (cho mooc xương)
  containerDimensions?: string;  // Kích thước lòng thùng (cho mooc ben)
  paintProcess?: string;         // Quy trình sơn
  paintColor?: string;           // Màu sơn
  paintTechnology?: {            // Công nghệ sơn (gộp quy trình và màu)
    paintProcess?: string;       // Quy trình sơn
    paintColor?: string;         // Màu sơn
  };
  tireSpec?: string;             // Thông số lốp
  electricSystem?: string;       // Hệ thống điện
  specialFeatures?: string[];    // Tính năng đặc biệt
}

// Chi tiết về đầu kéo
export interface TractorSpecification {
  horsepower?: number;
  torque?: string;
  transmission?: string;
  transmissionType?: string;
  clutchType?: string;
  cabinType?: string;
  wheelbase?: number;
  fuelTankCapacity?: number;
  fuelTankCapacityText?: string;
  saddleHeight?: number;
  fifthWheelType?: string;
  maxTowingCapacity?: number;
  maxTowingCapacityText?: string;
  brakingSystem?: string;        // Hệ thống phanh
  retarderSystem?: string;       // Hệ thống hãm
  sleepingBerth?: boolean;       // Có giường nằm không
  axleConfiguration?: string;    // Cấu hình trục (6x4, 4x2, etc.)
  interiorFeatures?: string[];   // Tính năng nội thất
  airConditioner?: boolean;      // Có điều hòa không
  electricSystem?: string;       // Hệ thống điện
}

export interface Truck {
  id: string;
  name: string;
  slug: string;
  brand: string | string[];
  price?: number | null;
  priceText?: string;
  weightText: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  dimensions: string;
  type: VehicleType;
  isNew?: boolean;
  isHot?: boolean;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  origin?: string;
  thumbnailUrl: string;
  images: string[];

  // Thông số kỹ thuật cơ bản
  specifications?: Record<string, any>;

  // Mô tả và tính năng
  description?: string;
  detailedDescription?: string;  // Thêm thuộc tính này để lưu mô tả chi tiết riêng cho từng sản phẩm
  features?: string[];

  // Thông số chi tiết cho động cơ
  engineModel?: string;       // Model động cơ
  engineCapacity?: string;    // Dung tích động cơ
  enginePower?: string;       // Công suất động cơ
  engineTorque?: string;      // Mô-men xoắn
  emissionStandard?: string;  // Tiêu chuẩn khí thải

  // Chi tiết chuyên biệt theo loại xe
  boxType?: 'đông-lạnh' | 'bảo-ôn' | 'kín' | 'bạt' | 'lửng' | 'xi-téc';
  craneType?: 'cẩu-rời' | 'cẩu-gắn-xe';
  trailerType?: 'ben' | 'sàn' | 'sàn-rút' | 'lùn' | 'cổ-cò' | 'xương' | 'lửng' | 'rào' | 'xi-téc' | 'bồn-xi-măng' | 'bồn-sắt' | 'bồn-bột-mì';

  // Thông số kỹ thuật chi tiết theo loại xe
  coolingBox?: CoolingBoxStructure;
  insulatedBox?: InsulatedBoxStructure;
  closedBox?: ClosedBoxStructure;
  tarpaulinBox?: TarpaulinBoxStructure;
  flatbedBox?: FlatbedStructure;
  tankSpec?: TankSpecification;
  craneSpec?: CraneSpecification;
  trailerSpec?: TrailerSpecification;
  tractorSpec?: TractorSpecification;

  // Thông số kỹ thuật phổ biến
  engineType?: string;
  fuel?: string;
  transmission?: string;
  wheelbase?: number;
  wheelbaseText?: string;
  tires?: string;
  brakeSystem?: string;
  cabinType?: string;
  seats?: number;
  steeringSystem?: string;
  suspensionType?: string;

  // Thông số khung gầm
  chassisMaterial?: string;  // Vật liệu khung gầm
  frontSuspension?: string;  // Hệ thống treo trước
  rearSuspension?: string;   // Hệ thống treo sau
  frontBrake?: string;       // Phanh trước
  rearBrake?: string;        // Phanh sau
  parkingBrake?: string;     // Phanh tay/phanh đỗ
  steeringType?: string;     // Loại hệ thống lái

  // Kích thước
  insideDimension?: string;  // Kích thước thùng bên trong (DxRxC)
  groundClearance?: number;  // Khoảng sáng gầm xe (mm)
  wheelTrack?: string;       // Vết bánh xe (trước/sau) (mm)
  turningRadius?: number;    // Bán kính quay vòng (m)

  // Trọng lượng chi tiết
  grossWeight?: string;      // Tổng tải trọng
  kerbWeight?: string;       // Trọng lượng không tải
  frontAxleLoad?: string;    // Tải trọng cầu trước
  rearAxleLoad?: string;     // Tải trọng cầu sau

  // Thông số hiệu suất
  maxSpeed?: string;         // Tốc độ tối đa
  climbingAbility?: string;  // Khả năng leo dốc
  fuelConsumption?: string;  // Mức tiêu thụ nhiên liệu

  // Trang bị tiện nghi
  cabinFeatures?: string[];  // Tính năng cabin

  // Cho phép mở rộng thêm các trường khác
  [key: string]: any;
}

// ... keep existing code (utility functions getVehicleUrlPrefix, getVehicleTypeName, getBoxTypeName, getTrailerTypeName)
export function getVehicleUrlPrefix(type: VehicleType): string {
  // Trả về chính mã loại xe làm prefix URL để tự động hỗ trợ danh mục mới
  return String(type || '').trim();
}

export function getVehicleTypeName(type: VehicleType): string {
  switch (type) {
    case 'xe-tai':
      return 'Xe Tải';
    case 'xe-cau':
      return 'Xe Cẩu';
    case 'mooc':
      return 'Sơ Mi Rơ Mooc';
    case 'dau-keo':
      return 'Xe Đầu Kéo';
    case 'xe-lu':
      return 'Xe Lu';
    case 'xe-nang-nguoi':
      return 'Xe Nâng Người';
    case 'xe-nang':
      return 'Xe Nâng';
  }
  const pretty = String(type || '')
    .split('-')
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(' ');
  return pretty || '';
}

export function getBoxTypeName(type?: string): string {
  switch (type) {
    case 'đông-lạnh':
      return 'Thùng Đông Lạnh';
    case 'bảo-ôn':
      return 'Thùng Bảo Ôn';
    case 'kín':
      return 'Thùng Kín';
    case 'bạt':
      return 'Thùng Bạt';
    case 'lửng':
      return 'Thùng Lửng';
    case 'xi-téc':
      return 'Xi Téc Chở Xăng Dầu';
    default:
      return '';
  }
}

export function getTrailerTypeName(type?: string): string {
  switch (type) {
    case 'ben':
      return 'Mooc Ben';
    case 'sàn':
      return 'Mooc Sàn';
    case 'sàn-rút':
      return 'Mooc Sàn Rút Dài';
    case 'lùn':
      return 'Mooc Lùn';
    case 'cổ-cò':
      return 'Mooc Cổ Cò';
    case 'xương':
      return 'Mooc Xương';
    case 'lửng':
      return 'Mooc Lửng';
    case 'rào':
      return 'Mooc Rào';
    case 'xi-téc':
      return 'Mooc Xi Téc Chở Xăng Dầu';
    case 'bồn-xi-măng':
      return 'Mooc Bồn Chở Xi Măng Rời';
    case 'bồn-sắt':
      return 'Mooc Bồn Chở Bụi Sắt';
    case 'bồn-bột-mì':
      return 'Mooc Bồn Chở Bột Mì';
    default:
      return '';
  }
}

// Get stock status display info for UI
export function getStockStatusInfo(status?: string): { label: string; className: string; show: boolean } {
  switch (status) {
    case 'out-of-stock':
      return {
        label: 'Hết hàng',
        className: 'bg-gray-500 hover:bg-gray-600 text-white',
        show: true
      };
    case 'pre-order':
      return {
        label: 'Đặt trước',
        className: 'bg-amber-500 hover:bg-amber-600 text-white',
        show: true
      };
    case 'discontinued':
      return {
        label: 'Ngừng KD',
        className: 'bg-red-800 hover:bg-red-900 text-white',
        show: true
      };
    case 'in-stock':
    default:
      return {
        label: 'Sẵn hàng',
        className: 'bg-green-500 hover:bg-green-600 text-white',
        show: true // Hiển thị badge sẵn hàng để thu hút khách hàng
      };
  }
}

