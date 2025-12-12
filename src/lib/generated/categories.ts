/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from src/content/categories/*.json
 * Run: npm run cms:sync
 */

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  isHidden: boolean;
  order: number;
}

export const categories: CategoryData[] = [
  {
    "id": "xe-tai",
    "name": "Xe Tải",
    "slug": "xe-tai",
    "description": "Các dòng xe tải từ nhẹ đến nặng phục vụ vận chuyển hàng hóa",
    "keywords": [
      "xe tải",
      "truck",
      "tải trọng",
      "thùng",
      "vận chuyển",
      "hàng hóa"
    ],
    "isHidden": false,
    "order": 1
  },
  {
    "id": "xe-cau",
    "name": "Xe Cẩu",
    "slug": "xe-cau",
    "description": "Xe cẩu chuyên dụng cho công trình xây dựng và vận chuyển hàng nặng",
    "keywords": [
      "cẩu",
      "crane",
      "nâng",
      "cần cẩu",
      "xe cẩu",
      "lifting"
    ],
    "isHidden": false,
    "order": 2
  },
  {
    "id": "mooc",
    "name": "Sơ Mi Rơ Mooc",
    "slug": "mooc",
    "description": "Các loại sơ mi rơ mooc phục vụ vận tải đường dài",
    "keywords": [
      "mooc",
      "sơ mi rơ mooc",
      "rơ mooc",
      "semi-trailer",
      "trailer",
      "container"
    ],
    "isHidden": false,
    "order": 3
  },
  {
    "id": "dau-keo",
    "name": "Xe Đầu Kéo",
    "slug": "dau-keo",
    "description": "Xe đầu kéo mạnh mẽ cho vận tải container và hàng nặng",
    "keywords": [
      "đầu kéo",
      "tractor",
      "kéo",
      "xe đầu kéo"
    ],
    "isHidden": false,
    "order": 4
  }
];

// Helper functions for client-side use
export function getAllCategories(): CategoryData[] {
  return categories;
}

export function getVisibleCategories(): CategoryData[] {
  return categories.filter(c => !c.isHidden);
}

export function getCategoryById(id: string): CategoryData | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id;
}

export function getEnabledTypes(): string[] {
  return getVisibleCategories().map(c => c.id);
}

export function getTypeKeywords(type: string): string[] {
  const cat = getCategoryById(type);
  return cat?.keywords || [];
}

export function filterVisibleTrucks<T extends { type: string; isHidden?: boolean }>(trucks: T[]): T[] {
  const visibleTypes = new Set(getEnabledTypes());
  return trucks.filter(t => visibleTypes.has(t.type) && !t.isHidden);
}
