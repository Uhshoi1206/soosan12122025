
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-6 bottom-6 z-50
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-primary hover:bg-primary/90
        text-white shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        hover:shadow-primary/20 hover:shadow-xl
        group
      `}
      aria-label="Lên đầu trang"
    >
      <ArrowUp 
        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" 
      />
      
      {/* Hiệu ứng gợn sóng khi hover */}
      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
    </button>
  );
};

export default ScrollToTop;
