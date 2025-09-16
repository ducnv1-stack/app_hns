import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Heart, ArrowRight, Calendar, TrendingUp } from 'lucide-react';

const TourCard = ({ tour, viewMode, isFavorite, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
              src={tour.image}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {tour.isOnSale && tour.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{tour.discount}%
                </span>
              )}
              {tour.isPopular && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Hot
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
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
                  <span className="text-sm text-gray-500">({tour.reviews} đánh giá)</span>
                  <div className="flex items-center text-gray-500 text-sm ml-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{tour.location}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {tour.title}
                </h3>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(tour.departureDate)}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{tour.highlights.length - 3} khác
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="text-right ml-6">
                <div className="mb-4">
                  <div className="flex items-center justify-end space-x-2 mb-1">
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
                  <p className="text-sm text-green-600 font-medium">{tour.availability}</p>
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group">
      {/* Tour Image */}
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {tour.isOnSale && tour.discount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              -{tour.discount}%
            </span>
          )}
          {tour.isPopular && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Hot
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

      {/* Tour Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
            <span className="text-sm text-gray-500">({tour.reviews})</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate max-w-32">{tour.location}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          <Link to={`/tours/${tour.id}`}>{tour.title}</Link>
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

        {/* Departure Date */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Khởi hành: {formatDate(tour.departureDate)}</span>
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
          <div className="text-right">
            <p className="text-sm text-green-600 font-medium">{tour.availability}</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to={`/booking/${tour.id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <span>Đặt Tour Ngay</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default TourCard;