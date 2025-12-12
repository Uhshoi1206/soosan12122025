
import React from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompareEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <GitCompare className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Chưa có xe nào để so sánh</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Thêm các xe bạn muốn so sánh từ trang danh mục hoặc trang chi tiết sản phẩm
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary-700">
        <a href="/danh-muc-xe">
          Chọn xe để so sánh
        </a>
      </Button>
    </div>
  );
};

export default CompareEmptyState;
