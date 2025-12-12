
import React from 'react';
import { Button } from './ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import BannerCarousel, { type Banner } from './BannerCarousel';

interface HeroProps {
  banners?: Banner[];
}

const Hero: React.FC<HeroProps> = ({ banners }) => {
  if (banners && banners.length > 0) {
    return <BannerCarousel banners={banners} />;
  }

  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src="https://tongkhoxetai.vn/upload/images/banner-xe-tai.jpg"
          alt="Các loại phương tiện thương mại"
          className="w-full h-full object-cover opacity-30"
          useCase="hero"
          lazy={false}
        />
      </div>
      <div className="container mx-auto relative z-10 py-16 md:py-24">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Chuyên Cung Cấp <span className="text-primary-400">Xe Tải, Cẩu, Mooc & Đầu Kéo</span> Chính Hãng
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-200">
            Đa dạng sản phẩm từ xe tải nhẹ 500kg đến đầu kéo 40 tấn, với nhiều thương hiệu uy tín.
            Cam kết giá tốt nhất thị trường và dịch vụ sau bán hàng chuyên nghiệp.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-700 text-white font-medium">
              <a href="/danh-muc-xe">Xem danh mục xe</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
              <a href="/lien-he">Liên hệ tư vấn</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
