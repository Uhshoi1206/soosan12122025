import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryIcon } from '@/utils/categoryIcons';
import type { BlogCategoryInfo } from '@/utils/blogCategories';
import type { BlogPost } from '@/models/BlogPost';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface BlogSidebarProps {
  categories: Record<string, string>;
  categoryInfoMap: Record<string, BlogCategoryInfo>;
  currentCategory?: string;
  recommendedPosts?: Array<BlogPost & { url?: string }>;
}

const BlogSidebar = ({
  categories,
  categoryInfoMap,
  currentCategory,
  recommendedPosts = []
}: BlogSidebarProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    product: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Danh Mục</h3>
        <div className="space-y-2">
          {Object.entries(categories).map(([categoryId, label]) => {
            const categoryInfo = categoryInfoMap[categoryId];
            const slug = categoryInfo?.slug || categoryId;
            const isActive = currentCategory === categoryId;

            return (
              <a
                key={categoryId}
                href={`/danh-muc-bai-viet/${slug}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <CategoryIcon categoryId={categoryId} className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {recommendedPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Bài Viết Đề Xuất</h3>
          <div className="space-y-4">
            {recommendedPosts.map((post) => (
              <a
                key={post.slug}
                href={post.url || '#'}
                className="group block"
              >
                <div className="flex gap-3">
                  {post.images && post.images[0] && (
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <OptimizedImage
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        useCase="thumbnail"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-2">Đăng Ký Tư Vấn</h3>
        <p className="text-sm text-gray-600 mb-4">
          Để lại thông tin để nhận tư vấn từ chuyên gia của chúng tôi
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Họ và tên *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-sm font-medium">Địa chỉ</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="product" className="text-sm font-medium">Sản phẩm quan tâm</Label>
            <Input
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Xe quan tâm"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-sm font-medium">Nội dung</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung tư vấn"
              rows={3}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Gửi thông tin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;
