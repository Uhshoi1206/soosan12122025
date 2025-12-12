import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronUp, List, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const tocContainerRef = useRef<HTMLDivElement>(null);

  // Phát hiện thiết bị mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trích xuất các heading từ content HTML
  useEffect(() => {
    const extractHeadings = () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        let id = heading.id;
        
        // Nếu heading chưa có id, tạo id từ text content
        if (!id && heading.textContent) {
          id = heading.textContent
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
            .replace(/^-+|-+$/g, '');
          
          // Đảm bảo id là duy nhất
          let finalId = id;
          let counter = 1;
          while (items.some(item => item.id === finalId)) {
            finalId = `${id}-${counter}`;
            counter++;
          }
          id = finalId;
        }
        
        if (id && heading.textContent) {
          // Đảm bảo heading có id trong DOM
          heading.id = id;
          
          items.push({
            id,
            title: heading.textContent.trim(),
            level: parseInt(heading.tagName.charAt(1))
          });
        }
      });
      
      console.log('Extracted TOC items:', items); // Debug log
      setTocItems(items);
      
      // Cập nhật lại content trong DOM
      const contentElement = document.querySelector('.prose-content');
      if (contentElement) {
        contentElement.innerHTML = tempDiv.innerHTML;
      }
    };

    if (content) {
      extractHeadings();
    }
  }, [content]);

  // Tự động cuộn mục lục theo active item
  const scrollToActiveItem = useCallback((activeItemId: string) => {
    if (!tocContainerRef.current || !activeItemId) return;

    const activeItemElement = tocContainerRef.current.querySelector(`[data-toc-id="${activeItemId}"]`);
    if (activeItemElement && tocContainerRef.current) {
      const container = tocContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItemElement.getBoundingClientRect();
      
      // Tính toán vị trí cần cuộn
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const itemTop = itemRect.top;
      const itemBottom = itemRect.bottom;
      
      // Kiểm tra nếu item không nằm trong vùng nhìn thấy
      if (itemTop < containerTop || itemBottom > containerBottom) {
        // Cuộn để item ở giữa container
        const scrollTop = container.scrollTop + (itemTop - containerTop) - (containerRect.height / 2) + (itemRect.height / 2);
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Tính toán progress và active heading
  const updateScrollInfo = useCallback(() => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Tính toán progress dựa trên vị trí cuộn
    let progress = 0;
    if (documentHeight > 0) {
      progress = Math.min((scrollTop / documentHeight) * 100, 100);
    }
    
    // Tìm heading hiện tại với logic cải tiến
    const headingElements = tocItems.map(item => {
      const element = document.getElementById(item.id);
      return element ? { element, item } : null;
    }).filter(Boolean);

    let currentActiveId = '';
    let readingProgress = 0;
    
    if (headingElements.length > 0) {
      // Nếu đã cuộn gần đến cuối trang (90% trở lên), đặt progress = 100% và chọn heading cuối
      if (progress >= 90 || scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 50) {
        readingProgress = 100;
        currentActiveId = headingElements[headingElements.length - 1]!.item.id;
      } else {
        // Logic thông thường: tìm heading gần nhất đã vượt qua
        let activeIndex = -1;
        
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const { element, item } = headingElements[i]!;
          const rect = element.getBoundingClientRect();
          
          // Sử dụng threshold linh hoạt hơn
          if (rect.top <= 150) {
            currentActiveId = item.id;
            activeIndex = i;
            break;
          }
        }
        
        // Nếu không tìm thấy heading nào, nhưng đã cuộn xuống
        if (!currentActiveId && scrollTop > 100 && headingElements.length > 0) {
          currentActiveId = headingElements[0]!.item.id;
          activeIndex = 0;
        }
        
        // Tính toán reading progress dựa trên heading hiện tại
        if (activeIndex >= 0) {
          const baseProgress = (activeIndex / Math.max(headingElements.length - 1, 1)) * 100;
          
          // Điều chỉnh progress trong khoảng của heading hiện tại
          const currentHeading = headingElements[activeIndex]!;
          const nextHeading = headingElements[activeIndex + 1];
          
          if (nextHeading) {
            const currentRect = currentHeading.element.getBoundingClientRect();
            const nextRect = nextHeading.element.getBoundingClientRect();
            const sectionHeight = nextRect.top - currentRect.top + scrollTop;
            const sectionProgress = Math.max(0, Math.min(1, (150 - currentRect.top) / Math.max(sectionHeight, 1)));
            const segmentSize = 100 / Math.max(headingElements.length - 1, 1);
            readingProgress = Math.min(100, baseProgress + (sectionProgress * segmentSize));
          } else {
            // Heading cuối cùng
            readingProgress = Math.max(baseProgress, progress);
          }
        } else {
          readingProgress = Math.max(0, Math.min(progress, 15)); // Tối đa 15% nếu chưa đến heading nào
        }
      }
    }
    
    setScrollProgress(Math.round(readingProgress));

    if (currentActiveId !== activeId) {
      console.log('Active heading changed to:', currentActiveId, 'Progress:', Math.round(readingProgress) + '%'); // Debug log
      setActiveId(currentActiveId);
    }
  }, [tocItems, activeId]);

  // Tự động cuộn mục lục khi activeId thay đổi
  useEffect(() => {
    if (activeId) {
      scrollToActiveItem(activeId);
    }
  }, [activeId, scrollToActiveItem]);

  // Lắng nghe scroll event
  useEffect(() => {
    const throttledUpdate = (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateScrollInfo, 50); // Throttle để tối ưu performance
      };
    })();
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateScrollInfo(); // Gọi ngay lập tức để tính toán ban đầu
    
    return () => {
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, [updateScrollInfo]);

  // Cuộn đến heading khi click
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  // Không hiển thị nếu không có TOC items
  if (tocItems.length === 0) {
    return null;
  }

  // Render mobile progress bar
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <BarChart3 className="h-4 w-4 mr-2 text-primary" />
              Tiến độ đọc
            </div>
            <span className="text-xs text-gray-500">{scrollProgress}%</span>
          </div>
          <Progress value={scrollProgress} className="h-2" />
        </div>
      </div>
    );
  }

  // Render desktop TOC
  return (
    <div className={cn(
      "fixed right-6 top-1/2 transform -translate-y-1/2 z-40 w-80 max-h-[85vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <List className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold text-gray-800">Mục Lục</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Tiến độ đọc</span>
            <span className="text-xs text-gray-500">{scrollProgress}%</span>
          </div>
          <Progress value={scrollProgress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div 
          ref={tocContainerRef}
          className="flex-1 overflow-y-auto p-2 scroll-smooth"
          style={{ 
            maxHeight: 'calc(85vh - 140px)' // Trừ đi chiều cao header và footer
          }}
        >
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                data-toc-id={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100",
                  {
                    'pl-3': item.level === 2,
                    'pl-6': item.level === 3,
                    'pl-9': item.level === 4,
                    'pl-12': item.level === 5,
                    'pl-15': item.level === 6,
                  },
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                <span className="line-clamp-2">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Footer với thông tin thêm */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{tocItems.length} mục</span>
            <span className="flex items-center">
              <BarChart3 className="h-3 w-3 mr-1" />
              {activeId ? `Đang đọc: ${tocItems.findIndex(item => item.id === activeId) + 1}/${tocItems.length}` : 'Bắt đầu đọc'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
