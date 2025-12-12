import React from 'react';
import {
  TrendingUp,
  Tag,
  User,
  Wrench,
  Lightbulb,
  Zap,
  Newspaper,
  Star,
  GraduationCap,
  Settings,
  ShoppingCart
} from 'lucide-react';

export const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'industry-news': TrendingUp,
  'tin-tuc-nganh-van-tai': Newspaper,
  'product-review': Star,
  'danh-gia-xe': Star,
  'driver-tips': GraduationCap,
  'kinh-nghiem-lai-xe': GraduationCap,
  'maintenance': Wrench,
  'bao-duong': Wrench,
  'buying-guide': ShoppingCart,
  'tu-van-mua-xe': Lightbulb,
  'technology': Zap,
  'cong-nghe': Zap,
  'cong-nghe-va-doi-moi': Zap,
};

export const getCategoryIcon = (categoryId: string) => {
  return categoryIconMap[categoryId] || Tag;
};

export const CategoryIcon = ({
  categoryId,
  className = "h-6 w-6"
}: {
  categoryId: string;
  className?: string
}) => {
  const IconComponent = getCategoryIcon(categoryId);
  return <IconComponent className={className} />;
};
