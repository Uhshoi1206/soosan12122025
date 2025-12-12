
import React, { useState } from 'react';
import { Search, Phone, Calculator, CreditCard, GitCompare } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';
import SearchBox from './SearchBox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import CompareBadge from './CompareBadge';
import { useCompare } from '@/contexts/CompareContextAstro';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { generateCompareUrl } = useCompare();

  // Get settings from context
  const { images_section, contact_section } = useSiteSettings();
  const logo = images_section.logo;
  const logoAlt = images_section.logoAlt;
  const phone = contact_section.phone;
  const phoneDisplay = contact_section.phoneDisplay;

  const handleCompareClick = () => {
    const compareUrl = generateCompareUrl();
    window.location.href = compareUrl;
  };

  return (
    <header
      className="shadow-sm sticky top-0 z-50"
      style={{ backgroundColor: 'var(--header-bg)' }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt={logoAlt}
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="/"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--header-text)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--header-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--header-text)'}
              >
                Trang chủ
              </a>
              <a href="/danh-muc-xe" className="text-sm font-medium hover:text-primary transition-colors">
                Danh mục xe
              </a>
              <div
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                onClick={handleCompareClick}
              >
                <GitCompare className="h-3 w-3" />
                <span className="relative">
                  So sánh xe
                  <CompareBadge className="absolute -top-2 -right-6" />
                </span>
              </div>
              <a href="/du-toan-chi-phi-lan-banh" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                Dự toán chi phí lăn bánh
              </a>
              <a href="/tinh-lai-vay-mua-xe" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Tính lãi vay mua xe
              </a>
              <a href="/gioi-thieu" className="text-sm font-medium hover:text-primary transition-colors">
                Giới thiệu
              </a>
              <a href="/danh-muc-bai-viet" className="text-sm font-medium hover:text-primary transition-colors">
                Tin tức
              </a>
              <a href="/lien-he" className="text-sm font-medium hover:text-primary transition-colors">
                Liên hệ
              </a>
            </nav>
          )}

          {/* Contact & Search Button */}
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary animate-pulse" />
                <a
                  href={`tel:${phone}`}
                  className="text-sm font-bold hover:text-primary transition-colors text-black"
                  aria-label={`Gọi ngay: ${phoneDisplay}`}
                >
                  {phoneDisplay}
                </a>
              </div>
            )}

            {!isMobile ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center text-xs">
                    <Search className="h-3 w-3 mr-1" />
                    Tìm kiếm
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4" align="end">
                  <SearchBox onClose={() => setOpen(false)} />
                </PopoverContent>
              </Popover>
            ) : (
              <MobileMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
