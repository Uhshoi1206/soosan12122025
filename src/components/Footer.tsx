import React, { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import AddressRegions from './AddressRegions';
import { useToast } from './ui/use-toast';
import { submitToGoogleSheets, ContactData } from '@/services/googleSheetsService';
import { getEnabledTypes, getCategoryName } from '@/lib/generated/categories';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Footer: React.FC = () => {
  // Get settings from context
  const { organization_section, contact_section, branches, social_section } = useSiteSettings();

  const organizationName = organization_section.organizationName;
  const phone = contact_section.phone;
  const phoneDisplay = contact_section.phoneDisplay;
  const email = contact_section.email;
  const facebookUrl = social_section.facebookUrl || "https://www.facebook.com/soosanmotor";
  const facebookUsername = social_section.facebookUsername || "@soosanmotor";
  const messengerUrl = social_section.messengerUrl || "https://m.me/soosanmotor";
  const youtubeUrl = social_section.youtubeUrl || "https://youtube.com";
  const youtubeChannelName = social_section.youtubeChannelName || "Soosan Vina Motor";
  const tiktokUrl = social_section.tiktokUrl || "https://www.tiktok.com/@moocsoosan";
  const tiktokUsername = social_section.tiktokUsername || "@moocsoosan";

  const { toast } = useToast();
  const [inputPhone, setInputPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputPhone.trim()) {
      toast({
        title: "Vui lòng nhập số điện thoại!",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData: ContactData = {
        timestamp: new Date().toLocaleString('vi-VN'),
        source: 'footer',
        phone: inputPhone,
        message: 'Yêu cầu gọi lại'
      };

      const success = await submitToGoogleSheets(contactData);

      if (success) {
        toast({
          title: "Gửi thành công!",
          description: "Chúng tôi sẽ gọi lại cho bạn trong thời gian sớm nhất.",
        });

        setInputPhone('');
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra!",
        description: "Vui lòng thử lại sau hoặc gọi trực tiếp hotline.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className="pt-12 pb-8"
      style={{
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-text)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">{organizationName}</h3>
            <p className="mb-4" style={{ color: 'var(--footer-muted)' }}>
              Nhà sản xuất sơ mi rơ moóc, cẩu, thùng xe tải đông lạnh, xe xitéc (bồn) chở xăng dầu và các loại xe chuyên dụng khác.
              Đa dạng tải trọng và mẫu mã, giá cả cạnh tranh trên thị trường.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                <a
                  href={`tel:${phone}`}
                  className="hover:underline font-semibold"
                  style={{ color: 'var(--footer-text)' }}
                  aria-label={`Gọi ngay: ${phoneDisplay}`}
                >
                  {phoneDisplay}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary)' }} />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-primary transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/gioi-thieu" className="text-gray-300 hover:text-primary transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/lien-he" className="text-gray-300 hover:text-primary transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/danh-muc-bai-viet" className="text-gray-300 hover:text-primary transition-colors">
                  Tin tức
                </a>
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <a href="/danh-muc-bai-viet/tin-tuc-nganh-van-tai" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Tin Tức Ngành Vận Tải
                    </a>
                  </li>
                  <li>
                    <a href="/danh-muc-bai-viet/danh-gia-xe" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Đánh Giá Xe
                    </a>
                  </li>
                  <li>
                    <a href="/danh-muc-bai-viet/kinh-nghiem-lai-xe" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Kinh Nghiệm Lái Xe
                    </a>
                  </li>
                  <li>
                    <a href="/danh-muc-bai-viet/bao-duong" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Bảo Dưỡng
                    </a>
                  </li>
                  <li>
                    <a href="/danh-muc-bai-viet/tu-van-mua-xe" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Tư Vấn Mua Xe
                    </a>
                  </li>
                  <li>
                    <a href="/danh-muc-bai-viet/cong-nghe-va-doi-moi" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      Công Nghệ & Đổi Mới
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">Danh mục xe</h3>
            <ul className="space-y-2">
              {getEnabledTypes().map((key) => (
                <li key={key}>
                  <a href={`/danh-muc-xe?type=${key}`} className="text-gray-300 hover:text-primary transition-colors">
                    {getCategoryName(key)}
                  </a>
                </li>
              ))}
            </ul>

            {/* Phân cách và Tiện ích */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-heading text-lg font-bold mb-3 text-primary-100">Tiện ích</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/so-sanh-xe" className="text-gray-300 hover:text-primary transition-colors">
                    So sánh xe
                  </a>
                </li>
                <li>
                  <a href="/du-toan-chi-phi-lan-banh" className="text-gray-300 hover:text-primary transition-colors">
                    Dự toán chi phí lăn bánh
                  </a>
                </li>
                <li>
                  <a href="/tinh-lai-vay-mua-xe" className="text-gray-300 hover:text-primary transition-colors">
                    Tính lãi vay mua xe
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media & Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-bold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex flex-col space-y-4">
                <a
                  href="https://www.facebook.com/soosanmotor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#1877F2] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#1877F2] transition-colors">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <span>@soosanmotor</span>
                </a>

                <a
                  href="https://m.me/soosanmotor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#0099FF] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#0099FF] transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span>@soosanmotor</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-[#FF0000] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <span>Soosan Vina Motor</span>
                </a>

                <a
                  href="https://www.tiktok.com/@moocsoosan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-black transition-colors">
                    <div className="flex items-center justify-center">
                      <FaTiktok className="h-5 w-5" />
                    </div>
                  </div>
                  <span>@moocsoosan</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold mb-4">Liên hệ trực tuyến</h3>
              <p className="text-gray-300 mb-4">
                Để lại số điện thoại, chúng tôi sẽ gọi lại cho bạn ngay!
              </p>
              <form onSubmit={handlePhoneSubmit} className="flex space-x-2">
                <input
                  type="tel"
                  placeholder="Số điện thoại của bạn"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Địa chỉ theo khu vực */}
        {branches && branches.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h3 className="font-heading text-xl font-bold mb-6 text-center">Hệ thống chi nhánh toàn quốc</h3>
            <AddressRegions regions={branches} />
          </div>
        )}

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-gray-400">© 2025 Soosan (Doosung). Tất cả các quyền được bảo lưu.</p>
            <div className="flex space-x-4">
              <a href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-primary">
                Chính sách bảo mật
              </a>
              <a href="/dieu-khoan-su-dung" className="text-gray-400 hover:text-primary">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
