import React from 'react';
import { CalendarDays, Clock, ChevronRight, TrendingUp, Eye, User, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/models/BlogPost';
import { OptimizedImage } from '@/components/ui/optimized-image';
import SectionTitle from '@/components/SectionTitle';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import useRelatedTruckForBlogPost from '@/hooks/useRelatedTruckForBlogPost';
import { getVehicleUrlPrefix } from '@/models/TruckTypes';
import type { BlogCategoryInfo } from '@/utils/blogCategories';
import { CategoryIcon } from '@/utils/categoryIcons';

interface BlogSectionProps {
  posts: BlogPost[];
  categories: Record<string, string>;
  categoryInfoMap: Record<string, BlogCategoryInfo>;
}

// Component cho bài viết nổi bật
const FeaturedBlogPost = ({ post, categories, getPostUrl }: {
  post: BlogPost;
  categories: Record<string, string>;
  getPostUrl: (post: BlogPost) => string;
}) => {
  const relatedProduct = useRelatedTruckForBlogPost(post);

  const getProductUrl = (product: any) => {
    const vehicleUrlPrefix = getVehicleUrlPrefix(product.type);
    return `/${vehicleUrlPrefix}/${product.slug}`;
  };

  return (
    <a href={getPostUrl(post)} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
        <div className="aspect-[16/9] relative overflow-hidden">
          <OptimizedImage
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            useCase="gallery"
          />
          <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-primary/70 text-white px-4 py-2 rounded-br-lg rounded-tl-lg flex items-center font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            Nổi Bật
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-primary/90 transition-colors">
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="bg-primary/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                {categories[post.category]}
              </span>
              <span className="text-sm flex items-center">
                <CalendarDays className="h-3 w-3 mr-1" />
                {new Date(post.publishDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-primary/80" />
              <span className="mr-4">{post.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} phút đọc</span>
              </div>
              <div className="flex items-center text-primary/80">
                <Eye className="h-4 w-4 mr-1" />
                <span>{post.views || '28'}</span>
              </div>
              <div className="flex items-center text-primary/80">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{post.comments || '5'}</span>
              </div>
            </div>
          </div>
          
          {relatedProduct && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">Bài viết có liên quan đến sản phẩm:</div>
              <a
  href={getProductUrl(relatedProduct)} 
                className="flex items-center text-sm font-medium text-primary hover:underline mt-1 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Tag className="h-3 w-3 mr-1" />
                {relatedProduct.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

// Component cho bài viết nhỏ
const RecentBlogPost = ({ post, categories, getPostUrl }: {
  post: BlogPost;
  categories: Record<string, string>;
  getPostUrl: (post: BlogPost) => string;
}) => {
  const relatedProduct = useRelatedTruckForBlogPost(post);

  const getProductUrl = (product: any) => {
    const vehicleUrlPrefix = getVehicleUrlPrefix(product.type);
    return `/${vehicleUrlPrefix}/${product.slug}`;
  };

  return (
    <a href={getPostUrl(post)} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full flex">
        <div className="w-1/3 aspect-square relative overflow-hidden">
          <OptimizedImage
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            useCase="thumbnail"
          />
          <div className="absolute bottom-0 left-0 bg-gradient-to-r from-primary/90 to-primary/50 text-white text-xs px-2 py-1">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{post.views || Math.floor(Math.random() * 50) + 10}</span>
            </div>
          </div>
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <span className="text-xs text-primary font-medium mb-1">
            {categories[post.category]}
          </span>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(post.publishDate).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {post.author}
            </span>
          </div>
          
          {relatedProduct && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <a
  href={getProductUrl(relatedProduct)} 
                className="flex items-center text-xs text-primary hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Tag className="h-3 w-3 mr-1" />
                {relatedProduct.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

// Component cho carousel item
const CarouselBlogPost = ({ post, categories, getPostUrl }: {
  post: BlogPost;
  categories: Record<string, string>;
  getPostUrl: (post: BlogPost) => string;
}) => {

  return (
    <a href={getPostUrl(post)} className="group h-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm h-full hover:shadow-md transition duration-300 flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <OptimizedImage
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            useCase="thumbnail"
          />
          <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-2 py-1 rounded-tl-md flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{post.readTime} phút</span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs font-medium text-primary mb-2">
            {categories[post.category]}
          </span>
          <h4 className="font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(post.publishDate).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              <span>{post.comments || Math.floor(Math.random() * 10) + 1}</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

const BlogSection = ({ posts, categories, categoryInfoMap }: BlogSectionProps) => {
  // Kiểm tra dữ liệu hợp lệ trước khi render
  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Tin Tức & Chia Sẻ"
            description="Cập nhật thông tin mới nhất về xe tải, xe cẩu, sơ mi rơ mooc, xe đầu kéo và ngành vận tải tại Việt Nam"
          />
          <div className="text-center py-8">
            <p className="text-gray-600">Đang tải dữ liệu bài viết...</p>
          </div>
        </div>
      </section>
    );
  }

  // Phân loại bài viết nổi bật và mới nhất
  const featuredPost = posts[0]; // Bài viết đầu tiên sẽ là bài nổi bật
  const recentPosts = posts.slice(1, 4); // 3 bài viết tiếp theo
  
  // Chọn ngẫu nhiên 6 bài viết cho carousel
  const shuffledPosts = [...posts].sort(() => 0.5 - Math.random()).slice(0, 6);

  // Lấy slug từ category info map
  const getCategorySlug = (categoryId: string) => {
    return categoryInfoMap[categoryId]?.slug || categoryId;
  };

  // Tạo URL cho bài viết dựa trên danh mục
  const getPostUrl = (blogPost: BlogPost) => {
    const categorySlug = getCategorySlug(blogPost.category);
    return `/danh-muc-bai-viet/${categorySlug}/${blogPost.slug}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Tin Tức & Chia Sẻ"
          description="Cập nhật thông tin mới nhất về xe tải, xe cẩu, sơ mi rơ mooc, xe đầu kéo và ngành vận tải tại Việt Nam"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Bài viết nổi bật - chiếm 2/3 không gian */}
          <div className="lg:col-span-2">
            <FeaturedBlogPost 
              post={featuredPost} 
              categories={categories} 
              getPostUrl={getPostUrl} 
            />
          </div>

          {/* Các bài viết mới - chiếm 1/3 không gian */}
          <div className="flex flex-col space-y-4">
            {recentPosts.map((post) => (
              <RecentBlogPost 
                key={post.id} 
                post={post} 
                categories={categories} 
                getPostUrl={getPostUrl} 
              />
            ))}
          </div>
        </div>
        
        {/* Carousel cho các bài viết khác */}
        <div className="mt-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Bài Viết Đọc Nhiều</h3>
          </div>
          <div className="relative">
            <Carousel className="mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {shuffledPosts.map((post) => (
                  <CarouselItem key={post.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <CarouselBlogPost 
                      post={post} 
                      categories={categories} 
                      getPostUrl={getPostUrl} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-0 bg-white/80 hover:bg-white" />
            </Carousel>
          </div>
        </div>

        {/* Danh mục bài viết phổ biến */}
        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">Danh Mục Phổ Biến</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(categories).map(([categoryId, label]) => {
              const categoryInfo = categoryInfoMap[categoryId];
              const slug = categoryInfo?.slug || categoryId;

              return (
                <a key={categoryId}
                  href={`/danh-muc-bai-viet/${slug}`}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition group text-center"
                >
                  <div className="text-3xl mb-2 text-primary/80 group-hover:text-primary transition-colors">
                    <CategoryIcon categoryId={categoryId} className="mx-auto h-8 w-8" />
                  </div>
                  <h4 className="font-medium">{label}</h4>
                  <p className="text-sm text-gray-500 mt-1">Xem tất cả bài viết</p>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="px-6 border-primary text-primary hover:bg-primary/10">
            <a href="/danh-muc-bai-viet" className="flex items-center gap-2">
              Xem tất cả bài viết
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
