import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Users, Plus, Minus, Info, Star, MapPin, Clock, CheckCircle } from 'lucide-react';

const BookingStep1 = ({ tour, bookingData, onUpdateData, onNext }) => {
  const [selectedDate, setSelectedDate] = useState(bookingData.selectedDate);
  const [passengers, setPassengers] = useState(bookingData.passengers);
  const hasSchedules = Array.isArray(tour.schedules) && tour.schedules.length > 0;
  const [activeScheduleTab, setActiveScheduleTab] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState(bookingData.selectedSchedule || { groupIndex: 0, optionIndex: 0 });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // If date is already a human-friendly range (contains arrow), return as-is
    if (String(dateString).includes('→')) return dateString;
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getDisplayTime = (rawTime) => {
    if (!rawTime) return '';
    const cleaned = String(rawTime).replace(/[()]/g, '').replace(/H/g, ':');
    const parts = cleaned.split('-');
    if (parts.length === 2) return `${parts[0]} - ${parts[1]}`;
    return cleaned;
  };

  const getDisplayRange = (rawRange) => {
    if (!rawRange) return '';
    const parts = String(rawRange).split('-');
    const start = parts[0];
    const end = parts[1] || '';
    const hasYear = end.includes('/');
    if (hasYear) return `${start}/2025 → ${end}`; // end đã có năm
    return `${start}/2025 → ${end}/2025`;
  };

  // Initialize default schedule selection if schedules are provided
  useEffect(() => {
    if (!hasSchedules) return;
    const safeGroupIdx = Math.min(activeScheduleTab, tour.schedules.length - 1);
    const group = tour.schedules[safeGroupIdx] || tour.schedules[0];
    const option = group?.options?.[0];
    if (!option) return;
    const dateLabel = `${getDisplayRange(option.range)} ${getDisplayTime(option.time)}`;
    setSelectedDate(prev => prev || dateLabel);
    // Initialize booking override so summary reflects current tab by default
    onUpdateData({
      selectedDate: dateLabel,
      selectedSchedule: { groupIndex: safeGroupIdx, optionIndex: 0 },
      priceOverrideAdult: option.price,
      selectedScheduleMeta: { title: group.title, range: option.range, time: option.time, price: option.price }
    });
    setSelectedSchedule({ groupIndex: safeGroupIdx, optionIndex: 0 });
  }, [hasSchedules]);

  // When user switches tabs, default to first option of that tab and update booking data
  useEffect(() => {
    if (!hasSchedules) return;
    const group = tour.schedules[activeScheduleTab];
    const option = group?.options?.[0];
    if (!option) return;
    const dateLabel = `${getDisplayRange(option.range)} ${getDisplayTime(option.time)}`;
    setSelectedSchedule({ groupIndex: activeScheduleTab, optionIndex: 0 });
    setSelectedDate(dateLabel);
    onUpdateData({
      selectedDate: dateLabel,
      selectedSchedule: { groupIndex: activeScheduleTab, optionIndex: 0 },
      priceOverrideAdult: option.price,
      selectedScheduleMeta: { title: group.title, range: option.range, time: option.time, price: option.price }
    });
  }, [activeScheduleTab]);

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

  const effectiveAdultPrice = useMemo(() => {
    // Prefer current tab & selection when schedules are present
    if (hasSchedules) {
      const group = tour.schedules[activeScheduleTab];
      const opt = group?.options?.[selectedSchedule.optionIndex] || group?.options?.[0];
      if (opt?.price) return opt.price;
    }
    // Fallback to any override (e.g., when returning to this step)
    if (bookingData.priceOverrideAdult) return bookingData.priceOverrideAdult;
    return tour.pricing.adult;
  }, [hasSchedules, tour.schedules, activeScheduleTab, selectedSchedule.optionIndex, bookingData.priceOverrideAdult, tour.pricing.adult]);

  const calculateSubtotal = () => {
    const priceAdult = effectiveAdultPrice;
    const childRatio = tour.pricing.adult ? (tour.pricing.child / tour.pricing.adult) : 0.75;
    const infantRatio = tour.pricing.adult ? (tour.pricing.infant / tour.pricing.adult) : 0;
    const priceChild = Math.round(priceAdult * childRatio);
    const priceInfant = Math.round(priceAdult * infantRatio);
    const adultPrice = priceAdult * passengers.adults;
    const childPrice = priceChild * passengers.children;
    const infantPrice = priceInfant * passengers.infants;
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

  const handleSelectSchedule = (groupIndex, optionIndex) => {
    setActiveScheduleTab(groupIndex);
    setSelectedSchedule({ groupIndex, optionIndex });
    const group = tour.schedules[groupIndex];
    const opt = group.options[optionIndex];
    const dateLabel = `${getDisplayRange(opt.range)} ${getDisplayTime(opt.time)}`;
    setSelectedDate(dateLabel);
    // Update parent booking data immediately to reflect price override
    onUpdateData({
      selectedDate: dateLabel,
      selectedSchedule: { groupIndex, optionIndex },
      priceOverrideAdult: opt.price,
      selectedScheduleMeta: {
        title: group.title,
        range: opt.range,
        time: opt.time,
        price: opt.price
      }
    });
  };

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

      {/* Date/Schedule Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Chọn Ngày Khởi Hành
        </h3>

        {hasSchedules ? (
          <div>
            {/* Tabs */}
            <div className="flex gap-3 mb-4 border-b">
              {tour.schedules.map((g, idx) => (
                <button
                  key={g.title}
                  onClick={() => setActiveScheduleTab(idx)}
                  className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
                    activeScheduleTab === idx
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>

            {/* Common flight time */}
            <div className="text-sm text-gray-600 mb-3">
              ✈️ Giờ bay: <span className="font-medium">{getDisplayTime(tour.schedules[activeScheduleTab]?.options?.[0]?.time)}</span>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {(tour.schedules[activeScheduleTab]?.options || []).map((opt, idx) => {
                const selected = selectedSchedule.groupIndex === activeScheduleTab && selectedSchedule.optionIndex === idx;
                return (
                  <button
                    type="button"
                    key={`${opt.range}-${idx}`}
                    onClick={() => handleSelectSchedule(activeScheduleTab, idx)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${
                      selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{getDisplayRange(opt.range)}</div>
                        <div className="text-xs text-gray-500">{getDisplayTime(opt.time)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(opt.price)}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary-600' : 'border-gray-300'}`}>
                        {selected && <CheckCircle className="h-4 w-4 text-primary-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
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
        )}
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
                {formatPrice(effectiveAdultPrice)} / người
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
              <span>{formatPrice(effectiveAdultPrice * passengers.adults)}</span>
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