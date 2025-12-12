import React from 'react';
import { getCDNImageUrl, getOptimizedImageUrl } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  useCase?: 'thumbnail' | 'hero' | 'gallery' | 'detail';
  fallback?: string;
  lazy?: boolean;
}

/**
 * Optimized Image Component
 * Automatically converts image URLs to CDN while maintaining SEO benefits
 * Provides responsive loading and fallback support
 */
export function OptimizedImage({
  src,
  alt,
  className,
  useCase,
  fallback,
  lazy = true,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = React.useState(false);

  // Get optimized URL based on use case or default transformation
  const optimizedSrc = useCase
    ? getOptimizedImageUrl(src, useCase)
    : getCDNImageUrl(src);

  const fallbackSrc = fallback || src;

  const handleError = () => {
    console.error('Image failed to load:', optimizedSrc);
    setImageError(true);
  };

  // Simple, stable rendering without loading states or animations
  return (
    <img
      {...props}
      src={imageError ? fallbackSrc : optimizedSrc}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      onError={handleError}
      className={cn(
        "w-full h-full object-contain",
        className
      )}
      itemProp="image"
    />
  );
}