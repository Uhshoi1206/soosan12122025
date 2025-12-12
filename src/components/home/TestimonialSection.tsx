
import React, { useMemo, useEffect } from 'react';
import SectionTitle from '@/components/SectionTitle';
import { Truck, getVehicleUrlPrefix } from '@/models/TruckTypes';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface TestimonialSectionProps {
  products: Truck[];
}

interface TestimonialItem {
  id: string;
  product: Truck;
  title: string;
  content: string;
  customerType: 'Cá nhân' | 'Công ty';
  customerName: string; // Tên cá nhân hoặc tên công ty
  honorific?: 'Anh' | 'Chị';
  rating: number; // 1-5
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
}

function getBrandName(brand: string | string[]): string {
  return Array.isArray(brand) ? brand[0] : brand;
}

// Helpers: tạo nội dung đánh giá riêng cho xe cẩu theo tải trọng/mẫu cẩu
function extractTonFromName(name: string): number | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*t(?:ấn)?/i);
  return m ? parseFloat(m[1]) : null;
}

function extractCraneModel(name: string): string | null {
  const m = name.match(/(SCS\d+[A-Z]*|UNIC|TADANO|DONGYANG|KANGLIM|PALFINGER)/i);
  return m ? m[1].toUpperCase() : null;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function buildCraneCopy(product: Truck, chassisBrand: string) {
  const ton = extractTonFromName(product.name);
  const craneBrandInName = /(soosan|unic|tadano|dongyang|kanglim|palfinger)/i.exec(product.name)?.[0];
  const craneBrand = craneBrandInName ? capitalize(craneBrandInName) : 'Cẩu';
  const model = extractCraneModel(product.name) || '';

  let title = '';
  let content = '';

  if (ton !== null) {
    if (ton <= 3) {
      title = 'Gọn nhẹ, linh hoạt – vào phố dễ, thao tác nhanh';
      content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} ra cần nhanh, điều khiển mượt. Lắp trên chassis ${chassisBrand} di chuyển linh hoạt trong ngõ hẹp, giao nhận hàng tiện lợi.`;
    } else if (ton <= 5) {
      title = 'Đa nhiệm, ổn định – hiệu quả cho đội xe vừa';
      content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} nâng đúng tải ${ton} tấn, cần vươn hợp lý, van tỉ lệ nhạy. Phù hợp bốc xếp máy móc/VLXD, chi phí vận hành thấp.`;
    } else if (ton <= 8) {
      title = 'Khung khỏe, nâng chính xác – làm việc liên tục';
      content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} lực nâng mạnh ở tầm xa, khớp xoay 360° ổn định. Chassis ${chassisBrand} bền bỉ cho cường độ cao cả ngày.`;
    } else if (ton <= 12) {
      title = 'Lực nâng lớn, vươn dài – an toàn chuẩn công trình';
      content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} dùng bơm thủy lực lưu lượng cao, giới hạn mô-men chống quá tải. Thích hợp lắp đặt thiết bị, dựng khung nhà xưởng.`;
    } else {
      title = 'Siêu khỏe, hiệu suất cao – công trình hạ tầng nặng';
      content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} tối ưu cho tải nặng, cần vươn dài ổn định, hệ thủy lực bền. Khai thác liên tục tại công trường lớn vẫn an tâm.`;
    }
  } else {
    title = 'Nâng nhanh, an toàn – hiệu suất thi công cao';
    content = `${craneBrand} ${model ? model + ' ' : ''}${product.name} thao tác mượt, đầy đủ an toàn (giới hạn mô-men, khóa cần). Phù hợp nhiều bài toán bốc xếp.`;
  }

  return { title, content };
}

function buildTestimonial(product: Truck, index: number): TestimonialItem {
  const brand = getBrandName(product.brand);
  const seed = hashString(product.slug + index.toString()); // Thêm index để tránh trùng
  const isCompany = seed % 5 < 3; // Tạo phân bố 60% công ty, 40% cá nhân

  const maleNames = [
    'Nguyễn Văn Hùng', 'Trần Quang Minh', 'Phạm Đức Thắng', 'Lê Quốc Khánh', 'Vũ Anh Tuấn',
    'Hoàng Văn Nam', 'Ngô Đình Phong', 'Bùi Thanh Tùng', 'Đặng Minh Đức', 'Lý Văn Cường',
    'Trịnh Quang Hải', 'Dương Văn Tâm', 'Phan Văn Long', 'Võ Minh Trí', 'Lê Văn Đức'
  ];
  const femaleNames = [
    'Nguyễn Thị Lan', 'Trần Thu Hằng', 'Phạm Hồng Nhung', 'Lê Thanh Hà', 'Vũ Mai Anh',
    'Hoàng Thị Linh', 'Ngô Thu Thảo', 'Bùi Thị Nga', 'Đặng Thị Hương', 'Lý Thị Phượng',
    'Trịnh Thị Hoa', 'Dương Thị Mai', 'Phan Thị Loan', 'Võ Thị Bích', 'Lê Thị Xuân'
  ];
  const companies = [
    'Công ty TNHH Vận Tải Minh Phát', 'Công ty Cổ phần Logistics Đại Việt', 'Doanh nghiệp Tư nhân Hòa Bình',
    'Công ty TNHH Giao Nhận Bắc Nam', 'Hợp tác xã Vận tải Thành Công', 'Công ty CP Vận Tải Hoàng Long',
    'Công ty TNHH Thương Mại Phát Đạt', 'Doanh nghiệp Tư nhân Kim Cương', 'Công ty CP Giao Nhận Á Châu',
    'Hợp tác xã Nông nghiệp Xanh', 'Công ty TNHH Xây Dựng Tân Tiến', 'Công ty CP Thép Việt Nam'
  ];

  let customerType: 'Cá nhân' | 'Công ty' = isCompany ? 'Công ty' : 'Cá nhân';
  let customerName = '';
  let honorific: 'Anh' | 'Chị' | undefined;

  if (customerType === 'Công ty') {
    customerName = companies[index % companies.length];
  } else {
    const isMale = seed % 2 === 0;
    honorific = isMale ? 'Anh' : 'Chị';
    customerName = (isMale ? maleNames : femaleNames)[index % (isMale ? maleNames.length : femaleNames.length)];
  }

  // Nội dung riêng theo loại/nhãn hiệu
  let title = '';
  let content = '';

  switch (product.type) {
    case 'xe-tai': {
      if (/hyundai/i.test(brand)) {
        title = 'Bền bỉ, tiết kiệm – phù hợp chạy tải liên tỉnh';
        content = `${brand} ${product.name} vận hành chắc chắn, cầu chassis khỏe. Chuyến dài ít phải dừng, mức tiêu hao dầu ổn định giúp tối ưu chi phí.`;
      } else if (/isuzu/i.test(brand)) {
        title = 'Tiết kiệm nhiên liệu vượt trội – máy Nhật là yên tâm';
        content = `${brand} ${product.name} bốc ở dải vòng tua thấp, cực kỳ tiết kiệm. Tiếng máy êm, ít hỏng vặt – chạy đơn hay chở kín đều ổn.`;
      } else if (/dongfeng/i.test(brand)) {
        title = 'Giá hợp lý, chi phí vận hành thấp';
        content = `${brand} ${product.name} phù hợp đầu tư ban đầu. Phụ tùng sẵn, chi phí bảo dưỡng rẻ, phù hợp doanh nghiệp tối ưu dòng tiền.`;
      } else if (/thaco|kia/i.test(brand)) {
        title = 'Dịch vụ phủ rộng, chạy đô thị linh hoạt';
        content = `${brand} ${product.name} nhỏ gọn, vào đường hẹp dễ. Trung tâm dịch vụ nhiều, xử lý bảo dưỡng nhanh – rất tiện cho SME.`;
      } else if (/hino/i.test(brand)) {
        title = 'Êm ái, chắc chắn – chạy hàng giá trị cao rất yên tâm';
        content = `${brand} ${product.name} lái đầm, cabin cách âm tốt. Giữ giá tốt, phù hợp các tuyến hàng nặng cần độ ổn định cao.`;
      } else {
        title = 'Vận hành ổn định, đáp ứng đa dạng nhu cầu chở hàng';
        content = `${brand} ${product.name} bền bỉ, dễ khai thác nhiều cấu hình thùng. Chi phí sử dụng hợp lý, hiệu quả đầu tư cao.`;
      }
      break;
    }
    case 'dau-keo': {
      if (/howo/i.test(brand)) {
        title = 'Sức kéo tốt, chi phí đầu tư dễ chịu';
        content = `${brand} ${product.name} kéo mooc nặng ổn, vào dốc tự tin. Chi phí sở hữu thấp – rất phù hợp đội xe cần mở rộng nhanh.`;
      } else if (/hyundai/i.test(brand)) {
        title = 'Vận hành êm, bền – chạy thẳng tuyến cảng cực ổn';
        content = `${brand} ${product.name} chuyển số mượt, ít rung. Tiêu hao dầu ổn định, xe giữ giá – phù hợp khai thác dài hạn.`;
      } else {
        title = 'Đầu kéo vận hành hiệu quả, tối ưu cung đường xa';
        content = `${brand} ${product.name} lực kéo tốt, cabin thoải mái. Phù hợp chở container, hàng nặng đường dài.`;
      }
      break;
    }
    case 'mooc': {
      const trailer = product.trailerType || '';
      if (/xương/i.test(trailer)) {
        title = 'Khung xương chắc, khóa container chuẩn quốc tế';
        content = `${brand} ${product.name} phân bố lực hợp lý, khóa container vững. Nền sàn chịu lực tốt – chạy cảng ngày đêm yên tâm.`;
      } else if (/sàn|lửng|rào/i.test(trailer)) {
        title = 'Đa năng, bốc xếp nhanh – giảm thời gian chờ bãi';
        content = `${brand} ${product.name} sàn rộng, thành bên tối ưu. Bốc xếp máy móc/hàng rời thuận tiện, quay đầu đơn cao.`;
      } else if (/ben/i.test(trailer)) {
        title = 'Khung gầm cứng, hệ thủy lực ổn định';
        content = `${brand} ${product.name} nâng ben nhanh, góc đổ lớn. Gia công khung chắc – chạy công trường rất bền.`;
      } else {
        title = 'Kết cấu chắc chắn, tải tốt – chi phí hợp lý';
        content = `${brand} ${product.name} chịu tải ổn, lốp/trục bền. Phù hợp đội xe cần hiệu quả sử dụng lâu dài.`;
      }
      break;
    }
    case 'xe-cau': {
      const crane = buildCraneCopy(product, brand);
      title = crane.title;
      content = crane.content;
      break;
    }
    default: {
      title = 'Hiệu quả khai thác cao – lựa chọn đáng tin cậy';
      content = `${brand} ${product.name} vận hành ổn định, tiết kiệm chi phí. Phù hợp nhu cầu vận chuyển đa dạng.`;
    }
  }

  return {
    id: `ts-${product.id}`,
    product,
    title,
    content,
    customerType,
    customerName,
    honorific,
    rating: 5,
  };
}

const TestimonialCard = ({ item }: { item: TestimonialItem }) => {
  const brand = getBrandName(item.product.brand);
  const vehicleUrlPrefix = getVehicleUrlPrefix(item.product.type);
  const productUrl = `/${vehicleUrlPrefix}/${item.product.slug}`;

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col h-full border border-gray-100">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-20 h-16 flex-shrink-0">
            <AspectRatio ratio={5/4} className="rounded-md overflow-hidden bg-gray-100">
              <OptimizedImage
                src={item.product.thumbnailUrl}
                alt={`Hình minh họa ${item.product.name}`}
                className="w-full h-full object-contain"
                useCase="thumbnail"
              />
            </AspectRatio>
          </div>
          <div className="flex-1">
            <a href={productUrl} className="font-semibold hover:underline text-sm line-clamp-2">
              {item.product.name}
            </a>
            <div className="text-xs text-gray-500 mt-0.5">{brand}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-primary mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>

        <h4 className="text-sm font-bold mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          "{item.content}"
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm font-medium">
            {item.customerType === 'Cá nhân' ? (
              <span>
                {item.honorific} {item.customerName}
              </span>
            ) : (
              <span className="text-gray-700">{item.customerName}</span>
            )}
            
          </div>
          <a href={productUrl} className="text-primary text-xs hover:underline">
            Xem sản phẩm
          </a>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ products }) => {
  const items = useMemo(() => {
    // Tạo seed cố định để shuffle một cách ổn định
    const shuffledProducts = [...products].sort((a, b) => {
      const hashA = hashString(a.slug);
      const hashB = hashString(b.slug);
      return hashA - hashB;
    });
    
    // Tạo testimonial cho tất cả sản phẩm với index để tránh trùng tên
    const testimonials = shuffledProducts.map((product, index) => buildTestimonial(product, index));
    
    return testimonials;
  }, [products]);
  const [api, setApi] = React.useState<CarouselApi>();

  // Tự động cuộn cứ 5 giây
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const firstFiveJsonLd = items.slice(0, 5).map((t) => ({
    '@type': 'Review',
    reviewBody: t.content,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: t.rating,
      bestRating: 5,
    },
    author: {
      '@type': t.customerType === 'Công ty' ? 'Organization' : 'Person',
      name: t.customerName,
    },
    itemReviewed: {
      '@type': 'Product',
      name: t.product.name,
      brand: getBrandName(t.product.brand),
      image: t.product.thumbnailUrl,
      category: t.product.type,
    },
  }));

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-labelledby="testimonial-heading">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Khách Hàng Nhận Xét"
          description="Đánh giá thực tế từ khách hàng cá nhân và doanh nghiệp về xe tải, cẩu, sơ mi rơ mooc chúng tôi đã bàn giao"
        />

        <div className="relative px-4 sm:px-0">
          <Carousel className="mx-auto max-w-7xl" setApi={setApi}>
            <CarouselContent className="ml-0 sm:-ml-2 md:-ml-4">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-0 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="px-2 sm:px-0">
                    <TestimonialCard item={item} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/90 hover:bg-white shadow-lg border" aria-label="Xem đánh giá trước" />
            <CarouselNext className="right-2 bg-white/90 hover:bg-white shadow-lg border" aria-label="Xem đánh giá tiếp theo" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
