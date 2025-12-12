import React from 'react';
import { CompareProvider } from '@/contexts/CompareContextAstro';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';
import { Toaster } from '../ui/toaster';
import Hero from '../Hero';
import VehicleCarousel from './VehicleCarousel';
import BrandCategories from './BrandCategories';
import ContactSection from './ContactSection';
import BlogSection from './BlogSection';
import WeightCategories from './WeightCategories';
import TestimonialSection from './TestimonialSection';
import { Truck } from '@/models/TruckTypes';
import type { Banner } from '../BannerCarousel';
import type { SiteSettings } from '@/types/siteSettings';

interface HomePageWithProviderProps {
  featuredTrucks: Truck[];
  specializedCranes: Truck[];
  semiTrailers: Truck[];
  tractors: Truck[];
  trucks: Truck[];
  sortedPosts: any[];
  categoryMap: any;
  categoryInfoMap: any;
  extraCategories: any[];
  enabledTypes: string[];
  banners?: Banner[];
  siteSettings?: Partial<SiteSettings>;
}

const HomePageWithProvider: React.FC<HomePageWithProviderProps> = ({
  featuredTrucks,
  specializedCranes,
  semiTrailers,
  tractors,
  trucks,
  sortedPosts,
  categoryMap,
  categoryInfoMap,
  extraCategories,
  enabledTypes,
  banners,
  siteSettings
}) => {
  const isTypeEnabled = (type: string) => enabledTypes.includes(type);
  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Hero banners={banners} />

            <div className="w-full overflow-hidden">
              {isTypeEnabled('xe-tai') && (
                <VehicleCarousel
                  vehicles={featuredTrucks}
                  title="Xe Tải"
                  description="Các dòng xe tải được nhiều khách hàng tin dùng, đa dạng tải trọng và thương hiệu"
                  viewAllUrl="/danh-muc-xe?type=xe-tai"
                  viewAllText="Xem tất cả xe tải"
                />
              )}

              {isTypeEnabled('xe-cau') && (
                <VehicleCarousel
                  vehicles={specializedCranes}
                  title="Cẩu"
                  description="Các dòng xe cẩu chuyên dụng, đa dạng tải trọng và thương hiệu"
                  viewAllUrl="/danh-muc-xe?type=xe-cau"
                  viewAllText="Xem tất cả cẩu"
                />
              )}

              {isTypeEnabled('mooc') && (
                <VehicleCarousel
                  vehicles={semiTrailers}
                  title="Sơ Mi Rơ Mooc"
                  description="Các dòng mooc chuyên dụng, đa dạng loại và thương hiệu"
                  viewAllUrl="/danh-muc-xe?type=mooc"
                  viewAllText="Xem tất cả sơ mi rơ mooc"
                />
              )}

              {isTypeEnabled('dau-keo') && (
                <VehicleCarousel
                  vehicles={tractors}
                  title="Xe Đầu Kéo"
                  description="Các dòng xe đầu kéo, đa dạng công suất và thương hiệu"
                  viewAllUrl="/danh-muc-xe?type=dau-keo"
                  viewAllText="Xem tất cả xe đầu kéo"
                />
              )}

              {extraCategories.map(cat => (
                isTypeEnabled(cat.data.id) && (
                  <VehicleCarousel
                    key={cat.data.id}
                    vehicles={trucks.filter(t => t.type === cat.data.id)}
                    title={cat.data.name}
                    description={cat.data.description || `Các dòng ${cat.data.name.toLowerCase()} chuyên dụng, đa dạng mẫu mã`}
                    viewAllUrl={`/danh-muc-xe?type=${cat.data.id}`}
                    viewAllText={`Xem tất cả ${cat.data.name.toLowerCase()}`}
                  />
                )
              ))}

              <div className="bg-gray-50 w-full">
                <WeightCategories />
              </div>

              <BrandCategories trucks={trucks} />

              <TestimonialSection products={trucks} />

              <ContactSection />

              <BlogSection
                posts={sortedPosts.slice(0, 6)}
                categories={categoryMap}
                categoryInfoMap={categoryInfoMap}
              />
            </div>
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </div>
      </CompareProvider>
    </SiteSettingsProvider>
  );
};

export default HomePageWithProvider;

