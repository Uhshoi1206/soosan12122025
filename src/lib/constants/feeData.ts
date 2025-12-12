
// src/data/feeData.ts
export const REGISTRATION_PLATE_FEES: Record<string, number> = {
  HANOI_HCM: 500000, // Hà Nội & TP.HCM
  CITIES_TOWNS: 150000, // Các thành phố trực thuộc tỉnh, thị xã
  OTHERS: 150000, // Các khu vực khác
};

// Phí bảo trì đường bộ 1 năm (VNĐ)
export const ROAD_MAINTENANCE_FEES_TRUCK: Record<string, number> = {
  UNDER_4_TONS: 2160000,
  FROM_4_TO_UNDER_8_5_TONS: 3240000,
  FROM_8_5_TO_UNDER_13_TONS: 4680000,
  FROM_13_TO_UNDER_19_TONS: 7080000,
  FROM_19_TO_UNDER_27_TONS: 8640000,
  FROM_27_TONS_UP: 12480000,
};

export const ROAD_MAINTENANCE_FEES_TRACTOR: Record<string, number> = {
  UNDER_19_TONS: 7080000,
  FROM_19_TO_UNDER_27_TONS: 8640000,
  FROM_27_TO_UNDER_40_TONS: 12480000,
  FROM_40_TONS_UP: 17160000,
};

// Phí đăng kiểm (Phí kiểm định + Lệ phí cấp GCN là 50.000)
export const INSPECTION_FEE_DATA = {
  TRUCK: { // Xe tải và xe cẩu theo tải trọng
    UNDER_4_TONS: 290000 + 50000,
    FROM_4_TO_UNDER_8_5_TONS: 330000 + 50000,
    FROM_8_5_TO_UNDER_13_TONS: 330000 + 50000,
    FROM_13_TO_UNDER_19_TONS: 360000 + 50000,
    FROM_19_TO_UNDER_27_TONS: 570000 + 50000,
    FROM_27_TONS_UP: 570000 + 50000,
  },
  TRACTOR: { // Xe đầu kéo theo tải trọng
    UNDER_19_TONS: 360000 + 50000,
    FROM_19_TO_UNDER_27_TONS: 570000 + 50000,
    FROM_27_TO_UNDER_40_TONS: 570000 + 50000,
    FROM_40_TONS_UP: 570000 + 50000,
  },
  TRAILER: 190000 + 50000, // Sơ mi rơ moóc
};

// Bảo hiểm TNDS bắt buộc 1 năm (CHƯA bao gồm VAT)
export const CIVIL_LIABILITY_INSURANCE_FEES_PRE_VAT = {
  TRUCK: { // Xe tải và xe cẩu theo tải trọng
    UNDER_4_TONS: 853000,
    FROM_4_TO_UNDER_8_5_TONS: 1660000,
    FROM_8_5_TO_UNDER_13_TONS: 2746000,
    FROM_13_TO_UNDER_19_TONS: 2746000,
    FROM_19_TO_UNDER_27_TONS: 3200000,
    FROM_27_TONS_UP: 3200000,
  },
  TRACTOR: { // Xe đầu kéo theo tải trọng
    UNDER_19_TONS: 3200000,
    FROM_19_TO_UNDER_27_TONS: 4800000,
    FROM_27_TO_UNDER_40_TONS: 4800000,
    FROM_40_TONS_UP: 4800000,
  },
  TRAILER: 0, // Sơ mi rơ moóc thường được bảo hiểm chung với xe đầu kéo
};

export const PROVINCES: { value: string; label: string; area_key: keyof typeof REGISTRATION_PLATE_FEES }[] = [
  { value: 'hanoi', label: 'Hà Nội', area_key: 'HANOI_HCM' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh', area_key: 'HANOI_HCM' },
  { value: 'haiphong', label: 'Hải Phòng', area_key: 'CITIES_TOWNS' },
  { value: 'danang', label: 'Đà Nẵng', area_key: 'CITIES_TOWNS' },
  { value: 'cantho', label: 'Cần Thơ', area_key: 'CITIES_TOWNS' },
  // Thêm các tỉnh thành phố lớn khác nếu có mức phí biển số riêng
  { value: 'other_cities', label: 'Thành phố trực thuộc tỉnh / Thị xã khác', area_key: 'CITIES_TOWNS' },
  { value: 'other_areas', label: 'Khu vực khác (Nông thôn, Huyện)', area_key: 'OTHERS' },
];

export const BEFORE_REGISTRATION_FEE_RATE = 0.02; // 2% cho xe tải, đầu kéo, chuyên dùng
export const PHYSICAL_INSURANCE_RATE = 0.015; // Ước tính 1.2% - 1.5%
export const VAT_RATE = 0.1; // 10%
