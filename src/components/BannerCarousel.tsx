import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from './ui/button';
import { OptimizedImage } from './ui/optimized-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Banner {
  id: string;
  title: string;
  highlightText?: string;
  description: string;
  backgroundImage: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  isActive: boolean;
  order: number;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [emblaApi]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const showControls = banners.length > 1;

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {banners.map((banner) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <div className="absolute inset-0 overflow-hidden">
                <OptimizedImage
                  src={banner.backgroundImage}
                  alt={banner.title}
                  className="w-full h-full object-contain opacity-30"
                  useCase="hero"
                  lazy={false}
                />
              </div>
              <div className="container mx-auto relative z-10 py-16 md:py-24">
                <div className="max-w-xl">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
                    {banner.title}{' '}
                    {banner.highlightText && (
                      <span className="text-primary-400">{banner.highlightText}</span>
                    )}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 text-gray-200">
                    {banner.description}
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary hover:bg-primary-700 text-white font-medium"
                    >
                      <a href={banner.ctaPrimaryLink}>{banner.ctaPrimaryText}</a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
                    >
                      <a href={banner.ctaSecondaryLink}>{banner.ctaSecondaryText}</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? 'bg-primary-400 w-8'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;
