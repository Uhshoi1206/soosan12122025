import React from 'react';
import { CalendarDays, Eye, ArrowRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { BlogPost } from '@/models/BlogPost';

interface BlogCategorySectionProps {
  categoryName: string;
  categorySlug: string;
  posts: BlogPost[];
  getPostUrl: (post: BlogPost) => string;
}

const BlogCategorySection = ({
  categoryName,
  categorySlug,
  posts,
  getPostUrl
}: BlogCategorySectionProps) => {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
        <a
          href={`/danh-muc-bai-viet/${categorySlug}`}
          className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <a href={getPostUrl(featuredPost)} className="group block h-full">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <OptimizedImage
                  src={featuredPost.images[0]}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  useCase="gallery"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-primary/90 transition-colors">
                    {featuredPost.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
                  {featuredPost.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(featuredPost.publishDate).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {featuredPost.views || '0'}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {sidePosts.map((post) => (
            <a
              key={post.id}
              href={getPostUrl(post)}
              className="group block"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex">
                <div className="w-32 sm:w-40 flex-shrink-0">
                  <div className="relative aspect-square overflow-hidden">
                    <OptimizedImage
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      useCase="thumbnail"
                    />
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1 hidden sm:block">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCategorySection;
