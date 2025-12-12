import { BlogPost } from '@/models/BlogPost';
import { Truck } from '@/models/TruckTypes';
import { getEnabledTypes, getTypeKeywords } from '@/lib/generated/categories';

/**
 * Hook để tìm sản phẩm liên quan đến bài viết blog
 * Dựa vào tiêu đề, nội dung, danh mục và tag của bài viết
 *
 * @param post - Bài viết blog cần tìm sản phẩm liên quan
 * @param allTrucks - Danh sách tất cả sản phẩm (lấy từ Content Collections)
 */
const useRelatedTruckForBlogPost = (post: BlogPost, allTrucks: Truck[]): Truck | null => {
  if (!post || !allTrucks || allTrucks.length === 0) return null;

  // Xác định loại xe dựa vào danh mục bài viết
  let preferredVehicleType: string | null = null;
  
  switch (post.category) {
    case 'product-review':
      // Ưu tiên tìm xe cụ thể được đề cập trong tiêu đề hoặc nội dung
      break;
    case 'driver-tips':
      // Ưu tiên xe tải cho bài viết kinh nghiệm lái xe
      preferredVehicleType = 'xe-tai';
      break;
    case 'maintenance':
      // Bảo dưỡng - tìm theo loại xe được đề cập
      break;
    case 'buying-guide':
      // Tư vấn mua xe - tìm theo loại xe được đề cập
      break;
    case 'technology':
      // Công nghệ - tìm theo loại xe được đề cập
      break;
    case 'industry-news':
      // Tin tức ngành - không có ưu tiên cụ thể
      break;
  }

  // Tạo danh sách từ khóa từ tiêu đề, nội dung và tag
  const titleWords = post.title.toLowerCase().split(' ');
  const contentWords = post.content.toLowerCase().split(' ');
  const tags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];
  
  // Từ khóa theo loại xe lấy từ registry
  const enabledTypes = getEnabledTypes();

  // Tìm loại xe được đề cập nhiều nhất trong bài viết
  if (!preferredVehicleType) {
    const typeCounts: Record<string, number> = enabledTypes.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>);

    // Đếm số lần xuất hiện của từ khóa theo loại xe
    enabledTypes.forEach((type) => {
      const keywords = getTypeKeywords(type);
      keywords.forEach(keyword => {
        if (post.title.toLowerCase().includes(keyword)) {
          typeCounts[type] += 3;
        }
        if (post.content.toLowerCase().includes(keyword)) {
          typeCounts[type] += 1;
        }
        if (tags.some(tag => tag.includes(keyword) || keyword.includes(tag))) {
          typeCounts[type] += 2;
        }
      });
    });

    // Tìm loại xe có điểm cao nhất
    let maxCount = 0;
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        preferredVehicleType = type;
      }
    });
  }

  // Tìm các mẫu xe cụ thể được đề cập
  const mentionedModels: Record<string, number> = {};

  // Sử dụng danh sách xe được truyền vào từ Content Collections
  allTrucks.forEach(truck => {
    // Tách tên xe thành các từ để tìm kiếm
    const truckNameWords = truck.name.toLowerCase().split(' ');
    
    // Tính điểm cho mỗi xe dựa trên sự xuất hiện trong bài viết
    let score = 0;
    
    // Kiểm tra tên xe trong tiêu đề
    if (post.title.toLowerCase().includes(truck.name.toLowerCase())) {
      score += 10; // Tiêu đề đề cập trực tiếp đến tên xe
    }
    
    // Kiểm tra tên xe trong nội dung
    if (post.content.toLowerCase().includes(truck.name.toLowerCase())) {
      score += 5; // Nội dung đề cập trực tiếp đến tên xe
    }
    
    // Kiểm tra từng từ trong tên xe
    truckNameWords.forEach(word => {
      if (word.length < 3) return; // Bỏ qua các từ quá ngắn
      
      if (post.title.toLowerCase().includes(word)) {
        score += 3;
      }
      
      if (post.content.toLowerCase().includes(word)) {
        score += 1;
      }
      
      // Kiểm tra trong tags
      if (tags.some(tag => tag.includes(word) || word.includes(tag))) {
        score += 2;
      }
    });
    
    // Kiểm tra thương hiệu
    const brands = Array.isArray(truck.brand) ? truck.brand : [truck.brand];
    brands.forEach(brand => {
      if (post.title.toLowerCase().includes(brand.toLowerCase())) {
        score += 3;
      }
      
      if (post.content.toLowerCase().includes(brand.toLowerCase())) {
        score += 1;
      }
      
      // Kiểm tra trong tags
      if (tags.some(tag => tag.includes(brand.toLowerCase()) || brand.toLowerCase().includes(tag))) {
        score += 2;
      }
    });
    
    // Nếu loại xe phù hợp với loại xe ưu tiên, tăng điểm
    if (preferredVehicleType && truck.type === preferredVehicleType) {
      score += 3;
    }
    
    // Lưu điểm cho xe này
    if (score > 0) {
      mentionedModels[truck.id] = score;
    }
  });
  
  // Tìm xe có điểm cao nhất
  let highestScore = 0;
  let bestMatchTruckId: string | null = null;
  
  Object.entries(mentionedModels).forEach(([truckId, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestMatchTruckId = truckId;
    }
  });
  
  // Nếu không tìm thấy xe phù hợp cụ thể, chọn xe ngẫu nhiên từ loại xe ưu tiên
  if (!bestMatchTruckId && preferredVehicleType) {
    const trucksOfPreferredType = allTrucks.filter(truck => truck.type === preferredVehicleType);
    if (trucksOfPreferredType.length > 0) {
      const randomIndex = Math.floor(Math.random() * trucksOfPreferredType.length);
      return trucksOfPreferredType[randomIndex];
    }
  }
  
  // Trả về xe phù hợp nhất nếu tìm thấy
  if (bestMatchTruckId) {
    return allTrucks.find(truck => truck.id === bestMatchTruckId) || null;
  }
  
  // Nếu không tìm thấy xe phù hợp, trả về null
  return null;
};

export default useRelatedTruckForBlogPost;