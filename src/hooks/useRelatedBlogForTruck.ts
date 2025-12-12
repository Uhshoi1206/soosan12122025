
import { BlogPost } from '@/models/BlogPost';
import { Truck } from '@/models/TruckTypes';
import { getTypeKeywords } from '@/lib/generated/categories';

/**
 * Hook để tìm bài viết liên quan đến sản phẩm xe
 * Dựa vào tên xe, thương hiệu, loại xe và mô tả
 *
 * @param truck - Sản phẩm xe cần tìm bài viết liên quan
 * @param allBlogPosts - Danh sách tất cả bài viết (lấy từ Content Collections)
 */
const useRelatedBlogForTruck = (truck: Truck, allBlogPosts: BlogPost[]): BlogPost[] => {
  if (!truck || !allBlogPosts || allBlogPosts.length === 0) return [];

  const relatedPosts: { post: BlogPost; score: number }[] = [];

  // Tạo danh sách từ khóa từ thông tin xe
  const truckNameWords = truck.name.toLowerCase().split(' ');
  const truckDescription = truck.description.toLowerCase();
  const truckBrands = Array.isArray(truck.brand) ? truck.brand : [truck.brand];

  // Từ khóa theo loại xe từ registry (hỗ trợ danh mục mới)
  const typeKeywords = getTypeKeywords(truck.type);

  allBlogPosts.forEach(post => {
    let score = 0;
    const postTitle = post.title.toLowerCase();
    const postContent = post.content.toLowerCase();
    const postTags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];

    // Kiểm tra tên xe trong bài viết
    if (postTitle.includes(truck.name.toLowerCase())) {
      score += 15; // Tên xe xuất hiện trong tiêu đề
    }
    if (postContent.includes(truck.name.toLowerCase())) {
      score += 10; // Tên xe xuất hiện trong nội dung
    }

    // Kiểm tra từng từ trong tên xe
    truckNameWords.forEach(word => {
      if (word.length < 3) return;
      
      if (postTitle.includes(word)) {
        score += 5;
      }
      if (postContent.includes(word)) {
        score += 2;
      }
      if (postTags.some(tag => tag.includes(word))) {
        score += 3;
      }
    });

    // Kiểm tra thương hiệu
    truckBrands.forEach(brand => {
      const brandLower = brand.toLowerCase();
      if (postTitle.includes(brandLower)) {
        score += 8;
      }
      if (postContent.includes(brandLower)) {
        score += 4;
      }
      if (postTags.some(tag => tag.includes(brandLower))) {
        score += 5;
      }
    });

    // Kiểm tra từ khóa theo loại xe
    typeKeywords.forEach(keyword => {
      if (postTitle.includes(keyword)) {
        score += 6;
      }
      if (postContent.includes(keyword)) {
        score += 3;
      }
      if (postTags.some(tag => tag.includes(keyword))) {
        score += 4;
      }
    });

    // Bonus điểm cho bài viết đánh giá sản phẩm
    if (post.category === 'product-review') {
      score += 5;
    }

    // Bonus điểm cho bài viết tư vấn mua xe
    if (post.category === 'buying-guide') {
      score += 3;
    }

    if (score > 0) {
      relatedPosts.push({ post, score });
    }
  });

  // Sắp xếp theo điểm số giảm dần
  relatedPosts.sort((a, b) => b.score - a.score);

  // Trả về tối đa 6 bài viết có điểm cao nhất (để có thể hiển thị 3 bài chính + 3 bài phụ)
  const topPosts = relatedPosts.slice(0, 6).map(item => item.post);

  // Đảm bảo mỗi sản phẩm có ít nhất 1 bài viết
  if (topPosts.length === 0) {
    // Nếu không tìm thấy bài viết liên quan, chọn bài viết theo loại xe
    const postsByType = allBlogPosts.filter(post => {
      const content = post.content.toLowerCase();
      return typeKeywords.some(keyword => content.includes(keyword));
    });

    if (postsByType.length > 0) {
      return postsByType.slice(0, 3);
    }

    // Nếu vẫn không có, chọn bài viết đánh giá sản phẩm ngẫu nhiên
    const productReviews = allBlogPosts.filter(post => post.category === 'product-review');
    if (productReviews.length > 0) {
      return productReviews.slice(0, 3);
    }

    // Cuối cùng, chọn 3 bài viết mới nhất
    return allBlogPosts.slice(0, 3);
  }

  return topPosts;
};

export default useRelatedBlogForTruck;
