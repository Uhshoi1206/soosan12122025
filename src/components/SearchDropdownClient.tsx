import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, FileText, Package } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Truck } from '@/models/TruckTypes';
import type { BlogPost } from '@/models/BlogPost';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'blog';
  url: string;
  excerpt?: string;
}

interface SearchDropdownClientProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
  products: Truck[];
  blogPosts: BlogPost[];
}

const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const SearchDropdownClient: React.FC<SearchDropdownClientProps> = ({
  placeholder = "Tìm kiếm xe, tin tức...",
  className,
  onResultClick,
  products,
  blogPosts
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const query = removeVietnameseTones(searchTerm.trim());

    const productResults = products
      .filter(product => {
        const name = removeVietnameseTones(product.name || '');
        const brand = removeVietnameseTones(product.brand || '');
        const description = removeVietnameseTones(product.description || '');
        const model = removeVietnameseTones(product.model || '');

        return name.includes(query) ||
          brand.includes(query) ||
          description.includes(query) ||
          model.includes(query);
      })
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        title: product.name,
        type: 'product' as const,
        url: `/${product.type}/${product.slug}`,
        excerpt: product.description?.substring(0, 100)
      }));

    const blogResults = blogPosts
      .filter(post => {
        const title = removeVietnameseTones(post.title || '');
        const description = removeVietnameseTones(post.description || '');
        const excerpt = removeVietnameseTones(post.excerpt || '');

        return title.includes(query) ||
          description.includes(query) ||
          excerpt.includes(query);
      })
      .slice(0, 5)
      .map(post => ({
        id: post.slug,
        title: post.title,
        type: 'blog' as const,
        url: `/${post.category}/${post.slug}`,
        excerpt: post.excerpt?.substring(0, 100) || post.description?.substring(0, 100)
      }));

    return [...productResults, ...blogResults]
      .sort((a, b) => {
        const aExactMatch = removeVietnameseTones(a.title) === query;
        const bExactMatch = removeVietnameseTones(b.title) === query;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      })
      .slice(0, 10);
  }, [searchTerm, products, blogPosts]);

  useEffect(() => {
    if (searchTerm.trim() && results.length >= 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, results.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      setIsOpen(false);
    }
  };

  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    onResultClick?.();
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-4"
        />
      </form>

      {isOpen && searchTerm.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <div>
              <div className="p-2 text-xs text-gray-500 font-semibold border-b">
                Tìm thấy {results.length} kết quả
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.url)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    {result.type === 'product' ? (
                      <Package className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    {result.excerpt && (
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {result.excerpt}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {result.type === 'product' ? 'Sản phẩm' : 'Tin tức'}
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSubmit(new Event('submit') as any)}
                className="w-full px-4 py-3 text-center text-sm text-primary hover:bg-gray-50 font-medium border-t"
              >
                Xem tất cả kết quả cho "{searchTerm}"
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">Không tìm thấy kết quả cho "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdownClient;
