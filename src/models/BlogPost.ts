
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: BlogCategory;
  images: string[];
  publishDate: number;
  readTime: number;
  author: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

// Blog category type - now dynamic, loaded from blog-categories collection
export type BlogCategory = string;
