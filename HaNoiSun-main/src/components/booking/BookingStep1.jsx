import React, { useState } from 'react';
import { Calendar, Users, Plus, Minus, Info, Star, MapPin, Clock } from 'lucide-react';

const BookingStep1 = ({ tour, bookingData, onUpdateData, onNext }) => {
  const [selectedDate, setSelectedDate] = useState(bookingData.selectedDate);
  const [passengers, setPassengers] = useState(bookingData.passengers);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const updatePassengerCount = (type, increment) => {
    const newPassengers = { ...passengers };
    if (increment) {
      newPassengers[type] += 1;
    } else if (newPassengers[type] > 0) {
      newPassengers[type] -= 1;
    }
    
    // Ensure at least 1 adult
    if (type === 'adults' && newPassengers.adults < 1) {
      newPassengers.adults = 1;
    }
    
    setPassengers(newPassengers);
  };

  const calculateSubtotal = () => {
    const adultPrice = tour.pricing.adult * passengers.adults;
    const childPrice = tour.pricing.child * passengers.children;
    const infantPrice = tour.pricing.infant * passengers.infants;
    return adultPrice + childPrice + infantPrice;
  };

  const handleContinue = () => {
    onUpdateData({
      selectedDate,
      passengers
    });
    onNext();
  };

  const isFormValid = selectedDate && (passengers.adults > 0);

  return (
    <div className="space-y-8">
      {/* Tour Summary */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start space-x-4">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{tour.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                <span>{tour.rating} ({tour.reviews} đánh giá)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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

      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Chọn Ngày Khởi Hành
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tour.availableDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                selectedDate === date
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">{formatDate(date)}</div>
              <div className="text-sm text-gray-500 mt-1">Còn chỗ</div>
            </button>
          ))}
        </div>
      </div>

      {/* Passenger Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary-600" />
          Số Lượng Hành Khách
        </h3>
        
        <div className="space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Người lớn</div>
              <div className="text-sm text-gray-500">Từ 12 tuổi trở lên</div>
              <div className="text-sm font-medium text-primary-600 mt-1">
                {formatPrice(tour.pricing.adult)} / người
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updatePassengerCount('adults', false)}
                disabled={passengers.adults <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{passengers.adults}</span>
              <button
                onClick={() => updatePassengerCount('adults', true)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Trẻ em</div>
              <div className="text-sm text-gray-500">Từ 2-11 tuổi</div>
              <div className="text-sm font-medium text-primary-600 mt-1">
                {formatPrice(tour.pricing.child)} / trẻ
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updatePassengerCount('children', false)}
                disabled={passengers.children <= 0}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{passengers.children}</span>
              <button
                onClick={() => updatePassengerCount('children', true)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Em bé</div>
              <div className="text-sm text-gray-500">Dưới 2 tuổi</div>
              <div className="text-sm font-medium text-green-600 mt-1">
                Miễn phí
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updatePassengerCount('infants', false)}
                disabled={passengers.infants <= 0}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{passengers.infants}</span>
              <button
                onClick={() => updatePassengerCount('infants', true)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Tóm Tắt Giá</h4>
        <div className="space-y-2">
          {passengers.adults > 0 && (
            <div className="flex justify-between">
              <span>Người lớn ({passengers.adults})</span>
              <span>{formatPrice(tour.pricing.adult * passengers.adults)}</span>
            </div>
          )}
          {passengers.children > 0 && (
            <div className="flex justify-between">
              <span>Trẻ em ({passengers.children})</span>
              <span>{formatPrice(tour.pricing.child * passengers.children)}</span>
            </div>
          )}
          {passengers.infants > 0 && (
            <div className="flex justify-between">
              <span>Em bé ({passengers.infants})</span>
              <span>Miễn phí</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-primary-600">{formatPrice(calculateSubtotal())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Lưu ý quan trọng:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Giá tour có thể thay đổi tùy theo ngày khởi hành</li>
              <li>Trẻ em từ 2-11 tuổi được giảm 25% giá người lớn</li>
              <li>Em bé dưới 2 tuổi được miễn phí (không có ghế riêng)</li>
              <li>Cần đặt trước ít nhất 7 ngày</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>Tiếp Tục</span>
          <Calendar className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BookingStep1;