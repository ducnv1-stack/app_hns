import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Heart, ArrowRight } from 'lucide-react';
import ImageSlideshow from '../common/ImageSlideshow';
import { api } from '../../services/api';
import { config } from '../../config/env';

const FeaturedTours = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tours from API
  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tours', { 
        limit: 6, // Giới hạn 6 tours
        page: 1,
        category: 'TOUR' // Chỉ lấy tours
      });
      
      if (response.success && response.data.tours) {
        setTours(response.data.tours);
      }
    } catch (error) {
      console.error('Failed to load tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredTours = useMemo(() => {
    return tours.map(tour => ({
      id: tour.id,
      title: tour.name,
      location: tour.country || 'Việt Nam',
      duration: `${tour.duration_days || 0} ngày`,
      groupSize: `${tour.min_participants || 1}-${tour.max_participants || 25} người`,
      price: parseFloat(tour.min_price || 0),
      originalPrice: tour.max_price ? parseFloat(tour.max_price) : null,
      rating: 4.8,
      reviews: 120,
      // Map all images for slideshow
      images: tour.images && Array.isArray(tour.images) && tour.images.length > 0
        ? tour.images.map(img => ({
            image_url: img.image_url?.startsWith('http') 
              ? img.image_url 
              : `${config.API_BASE_URL.replace(/\/api$/, '')}${img.image_url}`,
            alt: tour.name || 'Tour image'
          }))
        : [{ 
            image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
            alt: tour.name || 'Tour image'
          }],
      highlights: tour.itinerary ? ['Hành trình khám phá', 'Trải nghiệm độc đáo'] : [],
      category: 'tour',
      continent: 'domestic',
      discount: null
    }));
  }, [tours]);

  const categories = useMemo(() => ([
    { id: 'all', name: 'Tất Cả', count: featuredTours.length },
    { id: 'domestic', name: 'Trong Nước', count: featuredTours.filter(t => t.continent === 'domestic').length },
    { id: 'international', name: 'Quốc Tế', count: featuredTours.filter(t => t.continent !== 'domestic').length },
    { id: 'luxury', name: 'Cao Cấp', count: featuredTours.filter(t => t.category === 'luxury').length },
  ]), [featuredTours]);

  const filteredTours = useMemo(() => {
    if (activeCategory === 'all') return featuredTours;
    if (activeCategory === 'luxury') return featuredTours.filter(t => t.category === 'luxury');
    if (activeCategory === 'domestic') return featuredTours.filter(t => t.continent === 'domestic');
    if (activeCategory === 'international') return featuredTours.filter(t => t.continent !== 'domestic');
    return featuredTours;
  }, [activeCategory, featuredTours]);

  const toggleFavorite = (tourId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId);
    } else {
      newFavorites.add(tourId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải tours...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tours Nổi Bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những tour du lịch hấp dẫn nhất được chọn lọc kỹ càng
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group h-full flex flex-col"
            >
              {/* Tour Image Slideshow */}
              <div className="relative overflow-hidden">
                <ImageSlideshow 
                  images={tour.images}
                  interval={3000}
                  showControls={true}
                  autoPlay={true}
                  aspectRatio="aspect-[4/3]"
                />
                <div className="absolute top-4 left-4 z-20">
                  {tour.discount && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{tour.discount}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(tour.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-20"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.has(tour.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
                {tour.isLuxury && (
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Cao Cấp
                    </span>
                  </div>
                )}
              </div>

              {/* Tour Content */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
                    <span className="text-sm text-gray-500">({tour.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{tour.location}</span>
                  </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[56px]">
                    <Link to={`/tours/${tour.slug || tour.id}`}>{tour.title}</Link>
                  </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{tour.groupSize}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.slice(0, 2).map((highlight, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{tour.highlights.length - 2} khác
                      </span>
                    )}
                  </div>
                </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(tour.price)}
                      </span>
                      {tour.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(tour.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">/ người</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link 
                  to={`/booking/${tour.id}`}
                  className="mt-auto w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Đặt Tour Ngay</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có tour nào</p>
          </div>
        )}

        {/* View All Button */}
        {filteredTours.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/tours" className="btn-secondary">
              Xem Tất Cả Tours
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTours;