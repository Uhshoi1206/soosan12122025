import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug?: string;
  images: string[];
  publishDate: string;
  views?: number;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogSearchProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

const BlogSearch = ({ posts, categories }: BlogSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerSearchTerm) ||
      post.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [posts, searchTerm]);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  const getPostUrl = (post: BlogPost) => {
    return `/danh-muc-bai-viet/${post.categorySlug || post.category}/${post.slug}`;
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-6 text-base"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Tìm thấy <span className="font-semibold text-primary">{filteredPosts.length}</span> bài viết
          </p>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài viết nào
              </h3>
              <p className="text-gray-600">
                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <a
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <OptimizedImage
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        useCase="thumbnail"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {categoryMap[post.category] || post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          {post.views || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogSearch;
