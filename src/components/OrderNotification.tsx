
import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface OrderNotificationProps {
  onOpenQuickContact?: () => void;
  products?: Array<{ name: string; type: string; slug: string }>;
}

// Mock customer names - Diverse mix of individuals and companies
const mockCustomers = [
  // Individuals
  { name: 'Anh Nguyễn Văn Hùng', phone: '0901234***' },
  { name: 'Chị Trần Thị Lan', phone: '0987654***' },
  { name: 'Anh Lê Minh Tuấn', phone: '0912345***' },
  { name: 'Chị Phạm Thị Hoa', phone: '0923456***' },
  { name: 'Anh Hoàng Văn Nam', phone: '0945678***' },
  { name: 'Chị Đỗ Thị Mai', phone: '0956789***' },
  { name: 'Anh Vũ Đức Thắng', phone: '0967890***' },
  { name: 'Chị Bùi Thị Hương', phone: '0978901***' },
  { name: 'Anh Trương Minh Khải', phone: '0989012***' },
  { name: 'Chị Lương Thị Tâm', phone: '0990123***' },
  // Companies
  { name: 'Công ty TNHH Vận Tải Phương Đông', phone: '0961234***' },
  { name: 'Công ty TNHH Vận Tải Sài Gòn', phone: '0934567***' },
  { name: 'Công ty CP Logistics Miền Nam', phone: '0912567***' },
  { name: 'Công ty TNHH Vận Tải Hòa Bình', phone: '0923678***' },
  { name: 'Công ty CP Vận Tải Đông Á', phone: '0945789***' },
  { name: 'Công ty TNHH Thương Mại Hà Nội', phone: '0956890***' },
  { name: 'Công ty CP Xây Dựng Hưng Phát', phone: '0967901***' },
  { name: 'Công ty TNHH Logistics Thành Đạt', phone: '0978012***' },
  { name: 'Công ty CP Vận Tải Phương Nam', phone: '0989123***' },
  { name: 'Công ty TNHH TM Thiên Long', phone: '0990234***' },
];

// Generate time between 15 minutes to 3 hours ago for more recent feeling
const getRandomTimestamp = () => {
  const minutesAgo = Math.floor(Math.random() * 165) + 15; // 15-180 minutes
  return Date.now() - (minutesAgo * 60000);
};

const OrderNotification: React.FC<OrderNotificationProps> = ({ onOpenQuickContact, products = [] }) => {
  const [currentNotification, setCurrentNotification] = useState<{
    id: number;
    customerName: string;
    phone: string;
    productName: string;
    productUrl: string;
    timestamp: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const notificationCountRef = useRef(0);
  const [currentProduct, setCurrentProduct] = useState<{ name: string; type: string; slug: string } | null>(null);
  const [categoryType, setCategoryType] = useState<string | null>(null);

  // Detect current product from URL and category type from query params
  useEffect(() => {
    if (typeof window === 'undefined' || products.length === 0) return;

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');

    // Check if on category page with type filter
    if (typeParam) {
      setCategoryType(typeParam);
      console.log('📂 Detected category page with type:', typeParam);
    } else {
      setCategoryType(null);
    }

    // Match pattern: /{type}/{slug}
    const match = pathname.match(/^\/([^\/]+)\/([^\/]+)\/?$/);

    if (match) {
      const [, type, slug] = match;
      // Case-insensitive matching for slug
      const product = products.find(
        p => p.type === type && p.slug.toLowerCase() === slug.toLowerCase()
      );
      if (product) {
        setCurrentProduct(product);
        console.log('🎯 Detected current product:', product.name, '(type:', product.type, ')');
      } else {
        setCurrentProduct(null);
        console.log('❌ No product match for URL:', pathname);
      }
    } else {
      setCurrentProduct(null);
    }
  }, [products]);

  // Generate random notification with smart priority
  const generateNotification = () => {
    if (products.length === 0) return null;

    let selectedProduct;
    const random = Math.random();

    // Priority 1: If on a category page, ONLY show products of that category type
    if (categoryType) {
      const categoryProducts = products.filter(p => p.type === categoryType);
      if (categoryProducts.length > 0) {
        selectedProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
        console.log('📂 Category filter active - Showing', categoryType, 'product:', selectedProduct.name);
      } else {
        // No products in this category, don't show notification
        console.log('⚠️ No products found for category:', categoryType);
        return null;
      }
    }
    // Priority 2: If on a product page, use smart prioritization
    else if (currentProduct) {
      if (random < 0.7) {
        // 70% chance: Show notification for current product
        selectedProduct = currentProduct;
        console.log('✅ 70% - Showing current product:', selectedProduct.name);
      } else {
        // 30% chance: Show notification for products of same type
        const sameTypeProducts = products.filter(p => p.type === currentProduct.type);
        if (sameTypeProducts.length > 0) {
          selectedProduct = sameTypeProducts[Math.floor(Math.random() * sameTypeProducts.length)];
          console.log('✅ 30% - Showing same type product:', selectedProduct.name, '(type:', selectedProduct.type, ')');
        } else {
          selectedProduct = products[Math.floor(Math.random() * products.length)];
          console.log('⚠️ No same type products, showing random:', selectedProduct.name);
        }
      }
    }
    // Priority 3: Homepage or other pages - prioritize mooc ben
    else {
      if (random < 0.7) {
        // 70% chance: Show mooc ben (dump trailers)
        const moocBenProducts = products.filter(p =>
          p.type === 'mooc' && (
            p.name.toLowerCase().includes('ben') ||
            p.slug.toLowerCase().includes('ben')
          )
        );
        if (moocBenProducts.length > 0) {
          selectedProduct = moocBenProducts[Math.floor(Math.random() * moocBenProducts.length)];
          console.log('🚛 70% - Showing mooc ben product:', selectedProduct.name);
        } else {
          // Fallback to random if no mooc ben products
          selectedProduct = products[Math.floor(Math.random() * products.length)];
          console.log('⚠️ No mooc ben products, showing random:', selectedProduct.name);
        }
      } else {
        // 30% chance: Show random from all types
        selectedProduct = products[Math.floor(Math.random() * products.length)];
        console.log('🎲 30% - Showing random product:', selectedProduct.name);
      }
    }

    const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];

    return {
      id: notificationCountRef.current++,
      customerName: randomCustomer.name,
      phone: randomCustomer.phone,
      productName: selectedProduct.name,
      productUrl: `/${selectedProduct.type}/${selectedProduct.slug}`,
      timestamp: getRandomTimestamp(),
    };
  };

  // Hiệu ứng chạy khi component được mount hoặc current product/category thay đổi
  useEffect(() => {
    if (products.length === 0) return;

    // Reset dismissed state when navigating to new product or category
    setDismissed(false);

    // Đặt thời gian hiển thị thông báo sau khi trang web tải
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 3000); // Reduced to 3s for faster engagement

    return () => {
      clearTimeout(initialDelay);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [products, currentProduct, categoryType]);

  // Hiển thị thông báo tiếp theo
  const showNextNotification = () => {
    if (dismissed) return;

    // Generate new notification
    const newNotification = generateNotification();
    if (!newNotification) return;

    setCurrentNotification(newNotification);
    setIsVisible(true);

    // Sau 8 giây, ẩn thông báo (shorter for more engagement)
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);

      // Sau khi ẩn, đợi 15-25 giây ngẫu nhiên trước khi hiển thị tiếp
      const randomWait = Math.floor(Math.random() * 10000) + 15000; // 15-25s
      const nextTimeout = setTimeout(() => {
        showNextNotification();
      }, randomWait);

      timeoutRef.current = nextTimeout;
    }, 8000);

    timeoutRef.current = hideTimeout;
  };

  // Xử lý khi người dùng đóng thông báo
  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setDismissed(true);
  };

  if (!currentNotification || !isVisible) return null;
  
  // Định dạng thời gian
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = {
      'năm': 31536000,
      'tháng': 2592000,
      'tuần': 604800,
      'ngày': 86400,
      'giờ': 3600,
      'phút': 60,
      'giây': 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval > 0) {
        return `${interval} ${unit}${interval === 1 ? '' : ''} trước`;
      }
    }
    
    return 'vừa xong';
  };

  return (
    <div
      className={`fixed bottom-2 left-4 max-w-xs sm:max-w-sm w-full z-50 transform transition-all duration-500 ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0'
      }`}
    >
      <a
        href={currentNotification.productUrl}
        className="block bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
        aria-label={`Xem chi tiết sản phẩm ${currentNotification.productName}`}
      >
        {/* Hiệu ứng gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 pointer-events-none" />

        {/* Nút đóng */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Đóng thông báo"
          type="button"
        >
          <X size={14} />
        </button>

        <div className="flex items-start">
          {/* Icon check */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="bg-primary/10 rounded-full p-1.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Nội dung */}
          <div className="ml-3 pr-6">
            <p className="text-sm font-semibold text-gray-800">
              {currentNotification.customerName} - <span className="text-primary font-bold">{currentNotification.phone}</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Vừa đặt mua <span className="font-semibold text-primary">{currentNotification.productName}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatTimeAgo(currentNotification.timestamp)}
            </p>
          </div>
        </div>

        {/* Hiệu ứng gợn sóng khi hover */}
        <span className="absolute right-0 bottom-0 h-full w-16 bg-gradient-to-l from-white to-transparent opacity-50 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out pointer-events-none" />
      </a>
    </div>
  );
};

export default OrderNotification;
