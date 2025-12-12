import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import QuickContact from './QuickContact';
import { CompareProvider } from '../contexts/CompareContextAstro';
import { SiteSettingsProvider } from '../contexts/SiteSettingsContext';
import { Toaster } from './ui/toaster';
import './blog/BlogStyles.css';
import type { SiteSettings } from '@/types/siteSettings';

interface LayoutProps {
  children: React.ReactNode;
  siteSettings?: Partial<SiteSettings>;
}

const Layout: React.FC<LayoutProps> = ({ children, siteSettings }) => {
  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
          <QuickContact />
          <Toaster />
        </div>
      </CompareProvider>
    </SiteSettingsProvider>
  );
};

export default Layout;
