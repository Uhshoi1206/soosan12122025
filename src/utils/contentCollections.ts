import { getCollection } from 'astro:content';
import type { Truck } from '@/models/TruckTypes';
import type { BlogPost } from '@/models/BlogPost';
import type { Banner } from '@/components/BannerCarousel';

/**
 * Get all visible categories (not hidden)
 */
export async function getVisibleCategories() {
  const categories = await getCollection('categories');
  return categories
    .filter(cat => !cat.data.isHidden)
    .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

/**
 * Get all categories including hidden ones
 */
export async function getAllCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string) {
  const categories = await getCollection('categories');
  return categories.find(cat => cat.data.id === id);
}

/**
 * Check if a category is enabled (visible)
 */
export async function isTypeEnabled(type: string) {
  const category = await getCategoryById(type);
  return category ? !category.data.isHidden : false;
}

/**
 * Get all visible products (not hidden)
 */
export async function getVisibleProducts(): Promise<Truck[]> {
  const products = await getCollection('products');
  return products
    .filter(product => !product.data.isHidden)
    .map(product => product.data as unknown as Truck)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get all products including hidden ones
 */
export async function getAllProducts(): Promise<Truck[]> {
  const products = await getCollection('products');
  return products
    .map(product => product.data as unknown as Truck)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get products by type (category), excluding hidden ones
 */
export async function getProductsByType(type: string): Promise<Truck[]> {
  const products = await getVisibleProducts();
  return products.filter(product => product.type === type);
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Truck | undefined> {
  const products = await getCollection('products');
  const product = products.find(p => p.data.id === id);
  return product ? (product.data as unknown as Truck) : undefined;
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Truck | undefined> {
  const products = await getCollection('products');
  const product = products.find(p => p.data.slug === slug);
  return product ? (product.data as unknown as Truck) : undefined;
}

/**
 * Get all visible blog posts (not hidden)
 */
export async function getVisibleBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts
    .filter(post => !post.data.isHidden)
    .map(post => ({
      ...post.data,
      slug: post.data.slug || post.id.replace(/\.md$/, ''),
      content: post.body || '',
    } as unknown as BlogPost))
    .sort((a, b) => b.publishDate - a.publishDate);
}

/**
 * Get all blog posts including hidden ones
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts
    .map(post => ({
      ...post.data,
      slug: post.data.slug || post.id.replace(/\.md$/, ''),
      content: post.body || '',
    } as unknown as BlogPost))
    .sort((a, b) => b.publishDate - a.publishDate);
}

/**
 * Get blog posts by category, excluding hidden ones
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getVisibleBlogPosts();
  return posts.filter(post => post.category === category);
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getCollection('blog');
  const post = posts.find(p => (p.data.slug || p.id.replace(/\.md$/, '')) === slug);
  if (!post) return undefined;

  return {
    ...post.data,
    slug: post.data.slug || post.id.replace(/\.md$/, ''),
    content: post.body || '',
  } as unknown as BlogPost;
}

/**
 * Filter visible trucks (for backwards compatibility)
 */
export async function filterVisibleTrucks(trucks: Truck[]): Promise<Truck[]> {
  const visibleCategories = await getVisibleCategories();
  const visibleCategoryIds = new Set(visibleCategories.map(cat => cat.data.id));

  return trucks.filter(truck =>
    visibleCategoryIds.has(truck.type) && !truck.isHidden
  );
}

// Legacy data structure support
export async function getLegacyBlogData() {
  const allPosts = await getVisibleBlogPosts();

  return {
    allBlogPosts: allPosts,
    industryNewsPosts: allPosts.filter(p => p.category === 'industry-news'),
    productReviewPosts: allPosts.filter(p => p.category === 'product-review'),
    driverTipsPosts: allPosts.filter(p => p.category === 'driver-tips'),
    maintenancePosts: allPosts.filter(p => p.category === 'maintenance'),
    buyingGuidePosts: allPosts.filter(p => p.category === 'buying-guide'),
    technologyPosts: allPosts.filter(p => p.category === 'technology'),
  };
}

// Export organized product collections
export async function getOrganizedProducts() {
  const allProducts = await getVisibleProducts();

  return {
    trucks: allProducts,
    featuredTrucks: allProducts.filter(p => p.type === 'xe-tai'),
    specializedCranes: allProducts.filter(p => p.type === 'xe-cau'),
    semiTrailers: allProducts.filter(p => p.type === 'mooc'),
    tractors: allProducts.filter(p => p.type === 'dau-keo'),
  };
}

/**
 * Get all active banners sorted by order
 */
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const banners = await getCollection('banners');
    return banners
      .filter(banner => banner.data.isActive)
      .map(banner => banner.data as unknown as Banner)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading banners:', error);
    return [];
  }
}

/**
 * Get all banners including inactive ones
 */
export async function getAllBanners(): Promise<Banner[]> {
  try {
    const banners = await getCollection('banners');
    return banners
      .map(banner => banner.data as unknown as Banner)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading banners:', error);
    return [];
  }
}
