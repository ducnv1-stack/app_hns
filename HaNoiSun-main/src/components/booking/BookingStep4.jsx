import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Home, Eye, Mail, Phone, Calendar, Users, CreditCard, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingStep4 = ({ tour, bookingData, totalPrice, onStartOver }) => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Generate booking ID
    const id = 'HST' + Date.now().toString().slice(-8);
    setBookingId(id);
  }, []);

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

  const getPaymentMethodName = (method) => {
    const methods = {
      'online': 'Thanh toán online',
      'bank_transfer': 'Chuyển khoản ngân hàng',
      'office_payment': 'Thanh toán tại văn phòng',
      'installment': 'Trả góp'
    };
    return methods[method] || method;
  };

  const getPaymentStatus = () => {
    if (bookingData.paymentMethod === 'online') {
      return { status: 'Đã thanh toán', color: 'text-green-600', bg: 'bg-green-100' };
    } else {
      return { status: 'Chờ thanh toán', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
  };

  const paymentStatus = getPaymentStatus();

  const downloadVoucher = () => {
    // In a real app, this would generate and download a PDF
    alert('Tính năng tải voucher sẽ được triển khai trong phiên bản tiếp theo');
  };

  const sendConfirmationEmail = () => {
    const subject = encodeURIComponent(`Xác nhận đặt tour ${tour.title} - ${bookingId}`);
    const body = encodeURIComponent(
      `Xin chào ${bookingData.contactInfo.fullName},\n\n` +
      `Cảm ơn bạn đã đặt tour: ${tour.title}.\n` +
      `Mã booking: ${bookingId}.\n` +
      `Ngày khởi hành: ${formatDate(bookingData.selectedDate)}.\n` +
      `Số khách: ${bookingData.passengers.adults} NL${bookingData.passengers.children ? ', ' + bookingData.passengers.children + ' TE' : ''}${bookingData.passengers.infants ? ', ' + bookingData.passengers.infants + ' EB' : ''}.\n` +
      `Tổng thanh toán: ${formatPrice(totalPrice)}.\n\n` +
      `Trân trọng,\nHà Nội Sun Travel`
    );
    const mailto = `mailto:${bookingData.contactInfo.email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Đặt Tour Thành Công!
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          Cảm ơn bạn đã đặt tour cùng Hà Nội Sun Travel
        </p>
        <p className="text-gray-500">
          Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận chi tiết
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Chi Tiết Booking
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Booking ID */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mã booking</p>
                  <p className="text-2xl font-bold text-primary-600">{bookingId}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.bg} ${paymentStatus.color}`}>
                  {paymentStatus.status}
                </div>
              </div>
            </div>

            {/* Tour Info */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin tour</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{tour.title}</p>
                    <p className="text-sm text-gray-600">{tour.location}</p>
                    <p className="text-sm text-gray-600">{tour.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Chi tiết chuyến đi</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày khởi hành</p>
                    <p className="font-medium">{formatDate(bookingData.selectedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Số lượng khách</p>
                    <p className="font-medium">
                      {bookingData.passengers.adults} người lớn
                      {bookingData.passengers.children > 0 && `, ${bookingData.passengers.children} trẻ em`}
                      {bookingData.passengers.infants > 0 && `, ${bookingData.passengers.infants} em bé`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {bookingData.contactInfo.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{bookingData.contactInfo.fullName}</p>
                    <p className="text-sm text-gray-600">Người đặt tour</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-sm">{bookingData.contactInfo.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p className="text-sm">{bookingData.contactInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phương thức</p>
                    <p className="font-medium">{getPaymentMethodName(bookingData.paymentMethod)}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng thanh toán</span>
                    <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-900 mb-3">QR Code Booking</h4>
              <div className="w-40 h-40 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border">
                {/* Simple generated QR-like block using Google Chart API */}
                <img
                  src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(
                    `HST|${bookingId}|${tour.title}|${bookingData.selectedDate}`
                  )}`}
                  alt="Booking QR"
                  className="w-40 h-40"
                />
              </div>
              <p className="text-sm text-gray-600">
                Xuất trình QR code này khi tham gia tour
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payment Button - Only show if payment method is online */}
        {bookingData.paymentMethod === 'online' && (
          <button
            onClick={() => navigate(`/payment/${bookingId}`, { 
              state: { 
                bookingData: {
                  ...bookingData,
                  id: bookingId,
                  tourTitle: tour.title,
                  totalPrice: totalPrice,
                  currency: 'VND'
                }
              }
            })}
            className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
          >
            <CreditCard className="h-5 w-5" />
            <span>Thanh toán ngay</span>
          </button>
        )}

        <button
          onClick={downloadVoucher}
          className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Tải Voucher PDF</span>
        </button>

        <button
          onClick={sendConfirmationEmail}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
        >
          <Mail className="h-5 w-5" />
          <span>Gửi Email Xác Nhận</span>
        </button>

        <button
          onClick={() => navigate('/tours')}
          className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-colors"
        >
          <Eye className="h-5 w-5" />
          <span>Xem Tours Khác</span>
        </button>
      </div>

      {/* Additional Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Quay Về Trang Chủ</span>
        </button>

        <button
          onClick={onStartOver}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
        >
          <span>Đặt Tour Khác</span>
        </button>
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h4 className="font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h4>
        <p className="text-gray-600 mb-4">
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:19001234"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Hotline: 1900 1234</span>
          </a>
          <a
            href="mailto:support@hanoisuntravel.com"
            className="flex items-center justify-center space-x-2 bg-white border border-blue-300 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Email Hỗ Trợ</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingStep4;