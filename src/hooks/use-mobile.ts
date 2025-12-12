
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra kích thước màn hình ban đầu
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Thêm event listener để kiểm tra khi resize
    window.addEventListener('resize', checkScreenSize);
    
    // Kiểm tra lần đầu
    checkScreenSize();
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile;
};

export default useIsMobile;
