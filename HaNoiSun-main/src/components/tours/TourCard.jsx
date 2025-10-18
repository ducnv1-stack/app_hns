import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Heart, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import ImageSlideshow from '../common/ImageSlideshow';
import { config } from '../../config/env';

const TourCard = ({ tour, viewMode, isFavorite, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get all tour images for slideshow
  const getTourImages = () => {
    if (!tour) return [{ image_url: '/placeholder-tour.jpg', alt: 'Tour' }];
    
    if (tour.images && Array.isArray(tour.images) && tour.images.length > 0) {
      return tour.images.map(img => ({
        image_url: img.image_url?.startsWith('http') 
          ? img.image_url 
          : `${config.API_BASE_URL.replace(/\/api$/, '')}${img.image_url}`,
        alt: tour.name || 'Tour image'
      }));
    }
    
    // Fallback to single image
    return [{ 
      image_url: tour.image || '/placeholder-tour.jpg', 
      alt: tour.name || 'Tour' 
    }];
  };

  // Get single image for list view (không dùng slideshow)
  const getTourImage = () => {
    const images = getTourImages();
    return images[0]?.image_url || '/placeholder-tour.jpg';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
          <img
            src={getTourImage()}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              if (e.currentTarget.src.endsWith('/placeholder-tour.jpg')) return;
              e.currentTarget.src = '/placeholder-tour.jpg';
            }}
          />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {tour.service_type === 'PROMO' && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Khuyến mãi
                </span>
              )}
            </div>
            <button
              onClick={onToggleFavorite}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{tour.country}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {tour.name}
                </h3>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{tour.duration_days} ngày</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{tour.min_participants}-{tour.max_participants} người</span>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="mb-4 space-y-2">
                  {/* Itinerary Preview */}
                  {tour.itinerary && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Hành trình:</span>
                      <span className="ml-2">
                        {typeof tour.itinerary === 'string'
                          ? (tour.itinerary.length > 60
                              ? tour.itinerary.substring(0, 60) + '...'
                              : tour.itinerary)
                          : 'Chi tiết hành trình có sẵn'
                        }
                      </span>
                    </div>
                  )}

                  {/* Capacity Info */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Sức chứa:</span>
                    <span className="ml-2">
                      {tour.total_capacity ? `${tour.total_capacity} người` : 'Không giới hạn'}
                    </span>
                  </div>

                  {/* Availability Info */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Lịch trình khả dụng:</span>
                    <span className="ml-2 text-green-600 font-medium">
                      {tour.availability_count || 0} chuyến
                    </span>
                  </div>

                  {/* Service Type */}
                  {tour.service_type && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Loại hình:</span>
                      <span className="ml-2">
                        {tour.service_type === 'TOUR' ? 'Tour du lịch' : tour.service_type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="text-right ml-6">
                <div className="mb-4">
                  <div className="flex items-center justify-end space-x-2 mb-1">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(tour.min_price)} - {formatPrice(tour.max_price)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">/ người</p>
                  <p className="text-sm text-green-600 font-medium">
                    {tour.availability_count || 0} lịch trình
                  </p>
                </div>

                <Link 
                  to={`/booking/${tour.id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center space-x-2 group"
                >
                  <span>Đặt Tour</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group h-full flex flex-col">
      {/* Tour Image Slideshow */}
      <div className="relative overflow-hidden">
        <ImageSlideshow 
          images={getTourImages()}
          interval={3000}
          showControls={true}
          autoPlay={true}
          aspectRatio="aspect-[4/3]"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {tour.service_type === 'PROMO' && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Khuyến mãi
            </span>
          )}
        </div>
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-20"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Tour Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate max-w-32">{tour.country}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[56px]">
            <Link to={`/tours/${tour.slug || tour.id}`}>{tour.name}</Link>
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{tour.duration_days} ngày</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{tour.min_participants}-{tour.max_participants} người</span>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mb-4 space-y-2">
            {/* Itinerary Preview */}
            {tour.itinerary && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Hành trình:</span>
                <span className="ml-2">
                  {typeof tour.itinerary === 'string'
                    ? (tour.itinerary.length > 40
                        ? tour.itinerary.substring(0, 40) + '...'
                        : tour.itinerary)
                    : 'Chi tiết hành trình có sẵn'
                  }
                </span>
              </div>
            )}

            {/* Capacity Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Sức chứa:</span>
              <span className="ml-2">
                {tour.total_capacity ? `${tour.total_capacity} người` : 'Không giới hạn'}
              </span>
            </div>

            {/* Availability Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Lịch trình khả dụng:</span>
              <span className="ml-2 text-green-600 font-medium">
                {tour.availability_count || 0} chuyến
              </span>
            </div>

            {/* Service Type */}
            {tour.service_type && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Loại hình:</span>
                <span className="ml-2">
                  {tour.service_type === 'TOUR' ? 'Tour du lịch' : tour.service_type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(tour.min_price)} - {formatPrice(tour.max_price)}
              </span>
            </div>
            <p className="text-sm text-gray-500">/ người</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 font-medium">
              {tour.availability_count || 0} lịch trình
            </p>
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
  );
};

export default TourCard;