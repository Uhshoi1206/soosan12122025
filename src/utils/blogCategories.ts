import { getCollection } from 'astro:content';

export interface BlogCategoryInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}

export async function getBlogCategories() {
  const categories = await getCollection('blog-categories');

  const visibleCategories = categories
    .filter(cat => !cat.data.isHidden)
    .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));

  const categoryMap: Record<string, string> = {};
  const categoryInfoMap: Record<string, BlogCategoryInfo> = {};

  visibleCategories.forEach(cat => {
    categoryMap[cat.data.id] = cat.data.name;
    categoryInfoMap[cat.data.id] = {
      id: cat.data.id,
      name: cat.data.name,
      slug: cat.data.slug,
      description: cat.data.description,
      icon: cat.data.icon,
      color: cat.data.color,
      order: cat.data.order,
    };
  });

  return {
    categories: visibleCategories,
    categoryMap,
    categoryInfoMap,
    getCategoryName: (id: string) => categoryMap[id] || id,
    getCategorySlug: (id: string) => categoryInfoMap[id]?.slug || id,
    getCategoryInfo: (id: string) => categoryInfoMap[id],
  };
}

export async function getBlogCategoryIds() {
  const categories = await getCollection('blog-categories');
  return categories
    .filter(cat => !cat.data.isHidden)
    .map(cat => cat.data.id);
}
