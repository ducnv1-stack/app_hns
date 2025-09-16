import React from 'react';
import { MapPin, Calendar, Users, Star, Shield, Info } from 'lucide-react';

const BookingSummary = ({ tour, bookingData, totalPrice, currentStep }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa chọn';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateBreakdown = () => {
    const { adults, children, infants } = bookingData.passengers;
    return {
      adults: { count: adults, price: tour.pricing.adult * adults },
      children: { count: children, price: tour.pricing.child * children },
      infants: { count: infants, price: tour.pricing.infant * infants }
    };
  };

  const breakdown = calculateBreakdown();

  return (
    <div className="sticky top-8 space-y-6">
      {/* Tour Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-48 object-cover"
          />
          {tour.discount && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{tour.discount}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
            <span className="text-sm text-gray-500">({tour.reviews} đánh giá)</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-3">{tour.title}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{tour.groupSize}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Điểm nổi bật:</p>
            <div className="flex flex-wrap gap-1">
              {tour.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {currentStep > 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Chi Tiết Đặt Tour</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày khởi hành:</span>
              <span className="font-medium">{formatDate(bookingData.selectedDate)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Số lượng khách:</span>
              <span className="font-medium">
                {bookingData.passengers.adults + bookingData.passengers.children + bookingData.passengers.infants} người
              </span>
            </div>

            {currentStep > 2 && bookingData.contactInfo.fullName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Người đặt:</span>
                <span className="font-medium">{bookingData.contactInfo.fullName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Chi Tiết Giá</h4>
        
        <div className="space-y-3">
          {breakdown.adults.count > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Người lớn ({breakdown.adults.count})
              </span>
              <span className="font-medium">{formatPrice(breakdown.adults.price)}</span>
            </div>
          )}
          
          {breakdown.children.count > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Trẻ em ({breakdown.children.count})
              </span>
              <span className="font-medium">{formatPrice(breakdown.children.price)}</span>
            </div>
          )}
          
          {breakdown.infants.count > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Em bé ({breakdown.infants.count})
              </span>
              <span className="font-medium text-green-600">Miễn phí</span>
            </div>
          )}

          {tour.originalPrice && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giá gốc:</span>
              <span className="line-through text-gray-500">
                {formatPrice(tour.originalPrice * (bookingData.passengers.adults + bookingData.passengers.children))}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Tổng cộng:</span>
              <span className="font-bold text-xl text-primary-600">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Support */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-gray-900">Đảm Bảo An Toàn</h4>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Thanh toán bảo mật SSL</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Hỗ trợ 24/7</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Bảo hiểm du lịch</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Hoàn tiền 100% nếu hủy trước 7 ngày</span>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-primary-50 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Info className="h-5 w-5 text-primary-600" />
          <h4 className="font-semibold text-primary-900">Cần Hỗ Trợ?</h4>
        </div>
        <p className="text-sm text-primary-700 mb-4">
          Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn
        </p>
        <div className="space-y-2">
          <a
            href="tel:19001234"
            className="block bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            📞 Hotline: 1900 1234
          </a>
          <a
            href="mailto:support@hanoisuntravel.com"
            className="block bg-white text-primary-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-primary-200"
          >
            ✉️ Email Hỗ Trợ
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;