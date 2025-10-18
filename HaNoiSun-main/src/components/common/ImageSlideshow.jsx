import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageSlideshow Component
 * Auto slideshow với manual controls
 * 
 * Props:
 * - images: Array of image objects [{image_url, alt}, ...]
 * - interval: Thời gian chuyển ảnh (ms), default 3000
 * - showControls: Hiện arrows/dots, default true
 * - autoPlay: Tự động chuyển ảnh, default true
 * - aspectRatio: Tỷ lệ khung hình, default 'aspect-video' (16:9)
 */
const ImageSlideshow = ({ 
  images = [], 
  interval = 3000,
  showControls = true,
  autoPlay = true,
  aspectRatio = 'aspect-video',
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slideshow
  useEffect(() => {
    if (!autoPlay || images.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, autoPlay]);

  // Reset index khi images thay đổi
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <svg className="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Không có ảnh</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className={`relative ${aspectRatio} bg-gray-100 rounded-lg overflow-hidden group ${className}`}>
      {/* Main Image */}
      <img
        src={currentImage.image_url || currentImage.url || currentImage}
        alt={currentImage.alt || `Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src.endsWith('/placeholder-tour.jpg')) return;
          e.currentTarget.src = '/placeholder-tour.jpg';
        }}
      />

      {/* Navigation Arrows - chỉ hiện khi có > 1 ảnh và showControls = true */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {showControls && images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dots Indicator */}
      {showControls && images.length > 1 && images.length <= 10 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all ${
                idx === currentIndex
                  ? 'bg-white w-6 h-2'
                  : 'bg-white/50 hover:bg-white/75 w-2 h-2'
              } rounded-full`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {autoPlay && images.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          🎬 Auto {interval / 1000}s
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
