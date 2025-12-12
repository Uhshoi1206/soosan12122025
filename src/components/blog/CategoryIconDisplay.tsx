import React from 'react';
import { CategoryIcon } from '@/utils/categoryIcons';

interface CategoryIconDisplayProps {
  categoryId: string;
  className?: string;
}

const CategoryIconDisplay = ({ categoryId, className = "h-8 w-8" }: CategoryIconDisplayProps) => {
  return <CategoryIcon categoryId={categoryId} className={className} />;
};

export default CategoryIconDisplay;
