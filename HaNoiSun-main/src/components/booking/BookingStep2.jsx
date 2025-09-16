import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

const BookingStep2 = ({ tour, bookingData, onUpdateData, onNext, onPrev }) => {
  const [contactInfo, setContactInfo] = useState(bookingData.contactInfo);
  const [passengerDetails, setPassengerDetails] = useState(bookingData.passengerDetails);
  const [isContactAlsoPassenger, setIsContactAlsoPassenger] = useState(bookingData.isContactAlsoPassenger);
  const [errors, setErrors] = useState({});

  const totalPassengers = bookingData.passengers.adults + bookingData.passengers.children;

  useEffect(() => {
    // Initialize passenger details if empty
    if (passengerDetails.length === 0) {
      const initialPassengers = [];
      
      // Add adults
      for (let i = 0; i < bookingData.passengers.adults; i++) {
        initialPassengers.push({
          id: `adult-${i}`,
          type: 'adult',
          fullName: i === 0 && isContactAlsoPassenger ? contactInfo.fullName : '',
          dateOfBirth: '',
          passportNumber: '',
          nationality: 'Việt Nam'
        });
      }
      
      // Add children
      for (let i = 0; i < bookingData.passengers.children; i++) {
        initialPassengers.push({
          id: `child-${i}`,
          type: 'child',
          fullName: '',
          dateOfBirth: '',
          passportNumber: '',
          nationality: 'Việt Nam'
        });
      }
      
      setPassengerDetails(initialPassengers);
    }
  }, [bookingData.passengers, contactInfo.fullName, isContactAlsoPassenger]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate contact info
    if (!contactInfo.fullName.trim()) {
      newErrors.contactFullName = 'Vui lòng nhập họ tên';
    }
    if (!contactInfo.email.trim()) {
      newErrors.contactEmail = 'Vui lòng nhập email';
    } else if (!validateEmail(contactInfo.email)) {
      newErrors.contactEmail = 'Email không hợp lệ';
    }
    if (!contactInfo.phone.trim()) {
      newErrors.contactPhone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(contactInfo.phone)) {
      newErrors.contactPhone = 'Số điện thoại không hợp lệ';
    }

    // Validate passenger details
    passengerDetails.forEach((passenger, index) => {
      if (!passenger.fullName.trim()) {
        newErrors[`passenger-${index}-name`] = 'Vui lòng nhập họ tên';
      }
      if (!passenger.dateOfBirth) {
        newErrors[`passenger-${index}-dob`] = 'Vui lòng chọn ngày sinh';
      }
      // Passport validation for international tours
      if (tour.continent !== 'domestic' && !passenger.passportNumber.trim()) {
        newErrors[`passenger-${index}-passport`] = 'Vui lòng nhập số hộ chiếu';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactInfoChange = (field, value) => {
    const newContactInfo = { ...contactInfo, [field]: value };
    setContactInfo(newContactInfo);

    // Auto-fill first passenger if contact is also passenger
    if (isContactAlsoPassenger && field === 'fullName' && passengerDetails.length > 0) {
      const updatedPassengers = [...passengerDetails];
      updatedPassengers[0] = { ...updatedPassengers[0], fullName: value };
      setPassengerDetails(updatedPassengers);
    }

    // Clear related errors
    if (errors[`contact${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      const newErrors = { ...errors };
      delete newErrors[`contact${field.charAt(0).toUpperCase() + field.slice(1)}`];
      setErrors(newErrors);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengerDetails(updatedPassengers);

    // Clear related errors
    if (errors[`passenger-${index}-${field === 'fullName' ? 'name' : field === 'dateOfBirth' ? 'dob' : field === 'passportNumber' ? 'passport' : field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`passenger-${index}-${field === 'fullName' ? 'name' : field === 'dateOfBirth' ? 'dob' : field === 'passportNumber' ? 'passport' : field}`];
      setErrors(newErrors);
    }
  };

  const handleIsContactAlsoPassengerChange = (checked) => {
    setIsContactAlsoPassenger(checked);
    
    if (checked && passengerDetails.length > 0) {
      // Auto-fill first passenger with contact info
      const updatedPassengers = [...passengerDetails];
      updatedPassengers[0] = { ...updatedPassengers[0], fullName: contactInfo.fullName };
      setPassengerDetails(updatedPassengers);
    } else if (!checked && passengerDetails.length > 0) {
      // Clear first passenger name
      const updatedPassengers = [...passengerDetails];
      updatedPassengers[0] = { ...updatedPassengers[0], fullName: '' };
      setPassengerDetails(updatedPassengers);
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      onUpdateData({
        contactInfo,
        passengerDetails,
        isContactAlsoPassenger
      });
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary-600" />
          Thông Tin Người Đặt Tour
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              value={contactInfo.fullName}
              onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                errors.contactFullName ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.contactFullName && (
              <p className="text-red-500 text-sm mt-1">{errors.contactFullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="example@email.com"
              />
            </div>
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                  errors.contactPhone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0123 456 789"
              />
            </div>
            {errors.contactPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Địa chỉ liên hệ"
              />
            </div>
          </div>
        </div>

        {/* Contact also passenger checkbox */}
        <div className="mt-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isContactAlsoPassenger}
              onChange={(e) => handleIsContactAlsoPassengerChange(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Người đặt tour cũng tham gia chuyến đi này
            </span>
          </label>
        </div>
      </div>

      {/* Passenger Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông Tin Hành Khách ({totalPassengers} người)
        </h3>
        
        <div className="space-y-6">
          {passengerDetails.map((passenger, index) => (
            <div key={passenger.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">
                  {passenger.type === 'adult' ? 'Người lớn' : 'Trẻ em'} #{index + 1}
                  {index === 0 && isContactAlsoPassenger && (
                    <span className="text-sm text-primary-600 ml-2">(Người đặt tour)</span>
                  )}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={passenger.fullName}
                    onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                    disabled={index === 0 && isContactAlsoPassenger}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors[`passenger-${index}-name`] ? 'border-red-500' : 'border-gray-200'
                    } ${index === 0 && isContactAlsoPassenger ? 'bg-gray-50' : ''}`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors[`passenger-${index}-name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`passenger-${index}-name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors[`passenger-${index}-dob`] ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors[`passenger-${index}-dob`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`passenger-${index}-dob`]}</p>
                  )}
                </div>

                {tour.continent !== 'domestic' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số hộ chiếu *
                    </label>
                    <input
                      type="text"
                      value={passenger.passportNumber}
                      onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                        errors[`passenger-${index}-passport`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Nhập số hộ chiếu"
                    />
                    {errors[`passenger-${index}-passport`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`passenger-${index}-passport`]}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quốc tịch
                  </label>
                  <select
                    value={passenger.nationality}
                    onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="Việt Nam">Việt Nam</option>
                    <option value="Mỹ">Mỹ</option>
                    <option value="Anh">Anh</option>
                    <option value="Pháp">Pháp</option>
                    <option value="Đức">Đức</option>
                    <option value="Nhật Bản">Nhật Bản</option>
                    <option value="Hàn Quốc">Hàn Quốc</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-2">Lưu ý quan trọng:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Thông tin hành khách phải chính xác theo giấy tờ tùy thân</li>
            {tour.continent !== 'domestic' && (
              <li>Hộ chiếu phải còn hiệu lực ít nhất 6 tháng kể từ ngày khởi hành</li>
            )}
            <li>Trẻ em dưới 18 tuổi cần có giấy tờ chứng minh quan hệ với người lớn</li>
            <li>Mọi thay đổi thông tin sau khi đặt tour có thể phát sinh phí</li>
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay Lại</span>
        </button>
        
        <button
          onClick={handleContinue}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Tiếp Tục</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BookingStep2;