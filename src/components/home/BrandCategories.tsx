
import React, { useState } from 'react';
import { Truck } from '@/models/TruckTypes';
import SectionTitle from '@/components/SectionTitle';

interface BrandCategoriesProps {
  trucks: Truck[];
}

const BrandCategories = ({ trucks }: BrandCategoriesProps) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  // Tạo danh sách thương hiệu duy nhất từ sản phẩm, chuẩn hóa chữ hoa/thường và tên hiển thị
  const getUniqueBrands = () => {
    const CANONICAL_BRAND_MAP: Record<string, string> = {
      hyundai: 'Hyundai',
      isuzu: 'Isuzu',
      hino: 'Hino',
      dongfeng: 'Dongfeng',
      thaco: 'Thaco',
      kia: 'Kia',
      suzuki: 'Suzuki',
      veam: 'VEAM',
      soosan: 'Soosan',
      doosung: 'DOOSUNG',
      cimc: 'CIMC',
      koksan: 'KOKSAN',
      howo: 'HOWO',
      jac: 'JAC',
      'mercedes-benz': 'Mercedes-Benz',
      volvo: 'Volvo',
      scania: 'Scania',
      man: 'MAN',
      foton: 'Foton',
      daewoo: 'Daewoo',
      fuso: 'Fuso',
      iveco: 'Iveco'
    };

    const toCanonical = (raw: string) => {
      const key = raw.trim().toLowerCase();
      return CANONICAL_BRAND_MAP[key] || raw.trim();
    };

    const map = new Map<string, string>();
    trucks.forEach(truck => {
      const brands = Array.isArray(truck.brand) ? truck.brand : [truck.brand];
      brands.filter(Boolean).forEach(b => {
        const key = String(b).trim().toLowerCase();
        if (!key) return;
        if (!map.has(key)) map.set(key, toCanonical(String(b)));
      });
    });

    const names = Array.from(map.values()).sort((a,b)=>a.localeCompare(b,'vi'));
    return names.map((name, index)=>({ id: index + 1, name }));
  };

  const brands = getUniqueBrands();

  const handleImageError = (brandName: string) => {
    setFailedImages(prev => new Set(prev).add(brandName));
  };

  // Mapping logo cho từng thương hiệu với URL CDN-friendly
  const getBrandLogo = (brandName: string) => {
    const logoMap: Record<string, string> = {
      'Hyundai': 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Hyundai.webp',
      'Thaco': 'https://upload.wikimedia.org/wikipedia/vi/thumb/b/b3/Logo_Thaco.png/512px-Logo_Thaco.png',
      'Isuzu': 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Isuzu.webp',
      'Hino': 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Hino.webp',
      'Dongfeng': 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Dongfeng.webp',
      'JAC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/JAC_Motors_logo.png/512px-JAC_Motors_logo.png',
      'Mitsubishi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mitsubishi_logo.svg/512px-Mitsubishi_logo.svg.png',
      'Fuso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Mitsubishi_Fuso_logo.svg/512px-Mitsubishi_Fuso_logo.svg.png',
      'Daewoo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Daewoo_logo.svg/512px-Daewoo_logo.svg.png',
      'Foton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Foton_logo.png/512px-Foton_logo.png',
      'Iveco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Iveco_logo.svg/512px-Iveco_logo.svg.png',
      'Mercedes-Benz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/512px-Mercedes-Logo.svg.png',
      'Volvo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Volvo_logo.svg/512px-Volvo_logo.svg.png',
      'Scania': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Scania_logo.svg/512px-Scania_logo.svg.png',
      'MAN': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/MAN_logo.svg/512px-MAN_logo.svg.png',
      'Soosan': 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Soosan.webp',
      'VEAM': 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/9f/Logo_VEAM.png/512px-Logo_VEAM.png',
      'DOOSUNG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Doosung_logo.png/512px-Doosung_logo.png',
      'CIMC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/CIMC_logo.png/512px-CIMC_logo.png',
      'KOKSAN': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Koksan_logo.png/512px-Koksan_logo.png',
      'HOWO': 'https://upload.wikimedia.org/wikipedia/commons/thumb/h/h9/HOWO_logo.png/512px-HOWO_logo.png',
      'Suzuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/512px-Suzuki_logo_2.svg.png',
      'Kia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kia_logo2.svg/512px-Kia_logo2.svg.png'
    };

    // Sử dụng logo từ logoMap hoặc tạo placeholder text đơn giản
    return logoMap[brandName] || '';
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Thương Hiệu Nổi Tiếng"
          description="Chúng tôi phân phối đa dạng các loại phương tiện thương mại (xe tải, xe cẩu, mooc, xe đầu kéo) từ những thương hiệu uy tín, đảm bảo chất lượng và độ tin cậy."
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.length > 0 ? (
            brands.map(brand => (
              <a
                key={brand.id}
                href={`/danh-muc-xe?brand=${brand.name}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border border-gray-100 hover:border-primary/20 group min-h-[120px]"
              >
                <div className="flex flex-col items-center justify-center w-full">
                  {getBrandLogo(brand.name) && !failedImages.has(brand.name) ? (
                    <img
                      src={getBrandLogo(brand.name)}
                      alt={`Logo thương hiệu ${brand.name}`}
                      className="w-[120px] h-[60px] object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={() => handleImageError(brand.name)}
                    />
                  ) : (
                    <div className="w-[120px] h-[60px] flex items-center justify-center">
                      <span className="text-base font-semibold text-gray-700 px-3 py-2 text-center group-hover:text-primary transition-colors">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Chưa có thương hiệu nào trong danh mục
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandCategories;
