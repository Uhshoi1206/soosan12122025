import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { SiZalo } from '@icons-pack/react-simple-icons';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface QuickContactProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuickContact: React.FC<QuickContactProps> = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [isOpen, setInternalIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const { contact_section, social_section } = useSiteSettings();
  const phone = contact_section?.phone || '0815555528';
  const email = contact_section?.email || 'sales@soosanmotor.com';
  const zaloPhone = social_section?.zaloPhone || phone;
  const messengerUrl = social_section?.messengerUrl || 'https://m.me/soosanmotor/';
  const tiktokUrl = social_section?.tiktokUrl || 'https://www.tiktok.com/@moocsoosan';

  // Sử dụng state từ props nếu có, nếu không thì sử dụng state nội bộ
  const actualIsOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;
  const setActualIsOpen = externalSetIsOpen || setInternalIsOpen;

  const contactLinks = [
    {
      href: messengerUrl,
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-[#0099FF]",
      hoverColor: "hover:bg-[#0088FF]",
      label: "Messenger"
    },
    {
      href: `https://zalo.me/${zaloPhone}`,
      icon: <SiZalo className="w-5 h-5" />,
      color: "bg-[#0068FF]",
      hoverColor: "hover:bg-[#0054CC]",
      label: "Zalo"
    },
    {
      href: tiktokUrl,
      icon: <FaTiktok className="w-5 h-5" />,
      color: "bg-[#000000]",
      hoverColor: "hover:bg-[#333333]",
      label: "TikTok"
    },
    {
      href: `tel:${phone}`,
      icon: <Phone className="w-5 h-5" />,
      color: "bg-[#E60019]",
      hoverColor: "hover:bg-[#CC0017]",
      label: "Điện thoại"
    },
    {
      href: `mailto:${email}`,
      icon: <Mail className="w-5 h-5" />,
      color: "bg-[#EA4335]",
      hoverColor: "hover:bg-[#D63A2D]",
      label: "Email"
    }
  ];

  // Thay đổi biểu tượng hiển thị sau mỗi 1.5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % contactLinks.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [contactLinks.length]);

  // Xử lý tự động đóng sau 6 giây nếu không có tương tác
  useEffect(() => {
    if (actualIsOpen) {
      // Xóa timeout cũ nếu có
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      // Tạo timeout mới
      timeoutRef.current = window.setTimeout(() => {
        setActualIsOpen(false);
      }, 6000);

      // Hàm cleanup
      return () => {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [actualIsOpen, setActualIsOpen]);

  // Reset timeout khi người dùng tương tác với menu
  const handleInteraction = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        setActualIsOpen(false);
      }, 6000);
    }
  };

  return (
    <div
      className="fixed left-4 bottom-32 z-50"
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
    >
      {!actualIsOpen && (
        <div
          className="relative w-[66px] h-[66px] bg-[#00aeef] rounded-full shadow-lg cursor-pointer"
          onClick={() => setActualIsOpen(true)}
        >
          <div className="absolute inset-0 rounded-full border border-[#00aeef] animate-[widgetPulse_1.5s_infinite]" />

          <div className="relative w-full h-full overflow-hidden rounded-full">
            {contactLinks.map((contact, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                  ${index === activeIconIndex ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}
              >
                <div className="text-white">
                  {contact.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {actualIsOpen && (
        <div className="flex flex-col items-end">
          <div className="flex flex-col gap-3 mb-3">
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative w-12 h-12 rounded-full ${contact.color} ${contact.hoverColor} 
                  flex items-center justify-center text-white shadow-lg
                  hover:-translate-y-1 hover:shadow-xl transition-all duration-300
                  group animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="transform transition-transform duration-300 group-hover:rotate-[360deg]">
                  {contact.icon}
                </div>

                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
                  {contact.label}
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={() => setActualIsOpen(false)}
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white shadow-lg transition-all duration-300"
            aria-label="Đóng menu liên hệ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickContact;
