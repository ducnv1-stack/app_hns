import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Edit,
  X,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const loadBookingDetail = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setBookingData({
          id: bookingId,
          bookingNumber: 'HNS-2024-001',
          tourTitle: 'Combo Đà Nẵng 4N3Đ/3N2Đ 2025 siêu rẻ',
          image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=800&q=80',
          status: 'confirmed',
          travelDate: '2025-10-26',
          duration: '4 ngày 3 đêm',
          location: 'Đà Nẵng, Việt Nam',
          passengers: {
            adults: 2,
            children: 0,
            infants: 0
          },
          totalPrice: 9500000,
          bookingDate: '2024-01-15',
          paymentStatus: 'paid',
          paymentMethod: 'vnpay',
          contactInfo: {
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0901234567',
            address: '123 Nguyễn Huệ, Q1, TP.HCM'
          },
          specialRequests: 'Yêu cầu phòng view biển',
          meetingPoint: 'Sân bay Tân Sơn Nhất - Ga quốc nội',
          meetingTime: '05:00',
          itinerary: [
            {
              day: 1,
              title: 'Khởi hành - Đà Nẵng',
              description: 'Bay từ TP.HCM đến Đà Nẵng, nhận phòng khách sạn'
            },
            {
              day: 2,
              title: 'Bà Nà Hills',
              description: 'Tham quan Bà Nà Hills, cầu Vàng, làng Pháp'
            },
            {
              day: 3,
              title: 'Hội An',
              description: 'Tham quan phố cổ Hội An, chùa Cầu, nhà cổ'
            },
            {
              day: 4,
              title: 'Về TP.HCM',
              description: 'Mua sắm tại chợ Đà Nẵng, bay về TP.HCM'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadBookingDetail();
  }, [bookingId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDownloadVoucher = () => {
    const voucherContent = `VOUCHER TOUR
Hà Nội Sun Travel

Mã đặt chỗ: ${bookingData.bookingNumber}
Tour: ${bookingData.tourTitle}
Ngày đi: ${formatDate(bookingData.travelDate)}
Số khách: ${bookingData.passengers.adults} người lớn, ${bookingData.passengers.children} trẻ em
Tổng tiền: ${formatCurrency(bookingData.totalPrice)}
Điểm hẹn: ${bookingData.meetingPoint}
Giờ hẹn: ${bookingData.meetingTime}

LỊCH TRÌNH:
${bookingData.itinerary.map(item => `${item.day}. ${item.title}: ${item.description}`).join('\n')}

Lưu ý: Vui lòng có mặt tại điểm hẹn trước 30 phút.
Hotline hỗ trợ: 0945 532 939

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!`;

    const blob = new Blob([voucherContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voucher-${bookingData.bookingNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết đặt chỗ...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy đặt chỗ</h2>
          <p className="mt-2 text-gray-600">Đặt chỗ này không tồn tại hoặc bạn không có quyền truy cập.</p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-4 btn-primary"
          >
            Quay lại danh sách đặt chỗ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đặt chỗ
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết đặt chỗ</h1>
              <p className="text-gray-600 mt-2">Mã đặt chỗ: {bookingData.bookingNumber}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(bookingData.status)}`}>
                {getStatusText(bookingData.status)}
              </span>
              {(bookingData.status === 'pending' || bookingData.status === 'confirmed') && (
                <button
                  onClick={() => navigate(`/booking/${bookingId}/modify`)}
                  className="btn-warning flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Sửa đổi
                </button>
              )}
              {bookingData.status === 'confirmed' && (
                <button
                  onClick={handleDownloadVoucher}
                  className="btn-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải voucher
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={bookingData.image}
                    alt={bookingData.tourTitle}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {bookingData.tourTitle}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Ngày đi: {formatDate(bookingData.travelDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{bookingData.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{bookingData.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{bookingData.passengers.adults} người lớn, {bookingData.passengers.children} trẻ em</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lịch trình</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookingData.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {item.day}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
                  {bookingData.status === 'pending' && (
                    <button
                      onClick={() => navigate(`/booking/${bookingId}/modify`)}
                      className="btn-outline flex items-center text-sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa đổi
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bookingData.contactInfo.fullName}</p>
                      <p className="text-sm text-gray-600">Họ và tên</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bookingData.contactInfo.email}</p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bookingData.contactInfo.phone}</p>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bookingData.contactInfo.address}</p>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                    </div>
                  </div>
                </div>
                
                {bookingData.specialRequests && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">Yêu cầu đặc biệt</p>
                    <p className="text-sm text-gray-600">{bookingData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(bookingData.totalPrice)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                    <div className="flex items-center mt-1">
                      {bookingData.paymentStatus === 'paid' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      )}
                      <span className="text-sm font-medium">
                        {bookingData.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                    <p className="text-sm font-medium text-gray-900">
                      {bookingData.paymentMethod === 'vnpay' ? 'VNPay' : 
                       bookingData.paymentMethod === 'stripe' ? 'Stripe' : 
                       bookingData.paymentMethod}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt chỗ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(bookingData.bookingDate)}
                    </p>
                  </div>
                </div>

                {/* Meeting Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Thông tin điểm hẹn</h4>
                  <p className="text-sm text-blue-800">
                    <strong>Địa điểm:</strong> {bookingData.meetingPoint}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Thời gian:</strong> {bookingData.meetingTime}
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Vui lòng có mặt trước 30 phút
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  {bookingData.status === 'pending' && (
                    <button
                      onClick={() => navigate(`/booking/${bookingId}/cancel`)}
                      className="w-full btn-danger flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy đặt chỗ
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
