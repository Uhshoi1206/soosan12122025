import React from 'react';
import { CompareProvider } from '@/contexts/CompareContextAstro';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';
import { Toaster } from '../ui/toaster';
import CatalogPage from './CatalogPage';
import CatalogHeader from './CatalogHeader';
import { Truck } from '@/models/TruckTypes';
import type { SiteSettings } from '@/types/siteSettings';

interface CatalogPageWithProviderProps {
  initialVehicles: Truck[];
  initialVehicleCount: number;
  initialSearchQuery?: string;
  siteSettings?: Partial<SiteSettings>;
}

const CatalogPageWithProvider: React.FC<CatalogPageWithProviderProps> = ({
  initialVehicles,
  initialVehicleCount,
  initialSearchQuery,
  siteSettings
}) => {
  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <CatalogHeader />
            <div className="container mx-auto px-4 py-8">
              <CatalogPage initialVehicles={initialVehicles} initialSearchQuery={initialSearchQuery} />
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

export default CatalogPageWithProvider;
