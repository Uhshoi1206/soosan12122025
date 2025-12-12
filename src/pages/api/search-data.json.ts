import type { APIRoute } from 'astro';
import { getVisibleProducts } from '../../utils/contentCollections';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const products = await getVisibleProducts();
    const blogPosts = await getCollection('blog');

    const searchData = {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        model: p.model,
        description: p.description,
        type: p.type,
        slug: p.slug
      })),
      blogs: blogPosts
        .filter(p => !p.data.isHidden)
        .map(p => ({
          id: p.id,
          title: p.data.title,
          description: p.data.description,
          excerpt: p.data.excerpt,
          category: p.data.category,
          slug: p.slug
        }))
    };

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Search data API error:', error);
    return new Response(JSON.stringify({ products: [], blogs: [] }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
