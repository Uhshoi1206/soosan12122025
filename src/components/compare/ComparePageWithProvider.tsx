import React from 'react';
import { CompareProvider } from '@/contexts/CompareContextAstro';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';
import { Toaster } from '../ui/toaster';
import ComparePageContent from './ComparePageContent';
import type { SiteSettings } from '@/types/siteSettings';

interface ComparePageWithProviderProps {
  siteSettings?: Partial<SiteSettings>;
}

const ComparePageWithProvider: React.FC<ComparePageWithProviderProps> = ({ siteSettings }) => {
  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {/* Page Header */}
            <div className="page-header-bg page-header-text py-12">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">So Sánh Xe</h1>
                <p className="max-w-2xl mx-auto opacity-80">
                  Chọn tối đa 3 xe để so sánh chi tiết thông số kỹ thuật và giá cả
                </p>
              </div>
            </div>

            <div className="container mx-auto px-4 py-12">
              <ComparePageContent />
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

export default ComparePageWithProvider;
