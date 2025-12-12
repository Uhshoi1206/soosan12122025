/**
 * Utility functions for handling image CDN transformations
 * Converts local image URLs to CDN URLs while maintaining SEO benefits
 */

const CDN_BASE_URL = 'https://cdn.soosanmotor.com';

/**
 * Converts a local image path or external URL to CDN URL
 * For SEO purposes, maintains the appearance of local hosting
 */
export function getCDNImageUrl(originalUrl: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}): string {
  // If already a CDN URL from soosanmotor.com, return as is without transformation
  // This CDN doesn't support real-time image transformation via query parameters
  if (originalUrl.includes('cdn.soosanmotor.com')) {
    return originalUrl;
  }

  // If it's an external URL (like unsplash), convert to CDN
  if (originalUrl.startsWith('http')) {
    // Extract filename from URL for CDN mapping
    const urlParts = originalUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Create a SEO-friendly CDN URL that appears local
    const seoPath = `/images/${filename}`;

    // Note: soosanmotor CDN doesn't support transformation parameters
    // Images should be pre-optimized before uploading to CDN
    let cdnUrl = `${CDN_BASE_URL}${seoPath}`;

    return cdnUrl;
  }

  // For local paths, convert to CDN
  const cleanPath = originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`;
  return `${CDN_BASE_URL}${cleanPath}`;
}

/**
 * Generates responsive image URLs for different screen sizes
 * Note: For soosanmotor CDN, all sizes return the same URL as images are pre-optimized
 */
export function getResponsiveImageUrls(originalUrl: string) {
  const cdnUrl = getCDNImageUrl(originalUrl);

  return {
    mobile: cdnUrl,
    tablet: cdnUrl,
    desktop: cdnUrl,
    original: cdnUrl
  };
}

/**
 * Optimizes image URL for specific use cases
 * Note: For soosanmotor CDN, images should be pre-optimized on upload
 * This function returns the original URL without transformation parameters
 */
export function getOptimizedImageUrl(originalUrl: string, useCase: 'thumbnail' | 'hero' | 'gallery' | 'detail'): string {
  // If already a CDN URL, return as is (images are pre-optimized)
  if (originalUrl.includes('cdn.soosanmotor.com')) {
    return originalUrl;
  }

  // For non-CDN URLs, convert to CDN (but without transformation params)
  return getCDNImageUrl(originalUrl);
}
