import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Home,
  FileText,
  Clock
} from 'lucide-react';
import { paymentService } from '../services/paymentService';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { paymentId } = location.state || {};

        if (!paymentId) {
          setError('Thông tin thanh toán không hợp lệ');
          setLoading(false);
          return;
        }

        // Get payment details from API
        const response = await paymentService.getPayment(paymentId);

        if (response.success && response.data.payment.status === 'SUCCESS') {
          setPaymentData(response.data.payment);
          setBookingData(location.state?.bookingData || null);
        } else {
          setError('Thanh toán không thành công hoặc chưa hoàn tất');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError('Có lỗi xảy ra khi xác minh thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.state]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      paymentId: paymentData.id,
      bookingId: paymentData.booking_id,
      amount: paymentData.amount,
      currency: paymentData.currency,
      gateway: paymentData.metadata?.gateway || paymentData.payment_method,
      transactionId: paymentData.transaction_id,
      paymentDate: new Date(paymentData.paid_at || paymentData.created_at).toLocaleDateString('vi-VN'),
      tourTitle: bookingData?.tourTitle || 'Tour du lịch'
    };

    // Create receipt content
    const receiptContent = `
HÓA ĐƠN THANH TOÁN
Hà Nội Sun Travel

Mã thanh toán: ${receiptData.paymentId}
Mã đặt chỗ: ${receiptData.bookingId}
Tour: ${receiptData.tourTitle}
Số tiền: ${paymentService.formatAmount(receiptData.amount, receiptData.currency)}
Phương thức: ${receiptData.gateway.toUpperCase()}
Mã giao dịch: ${receiptData.transactionId || 'N/A'}
Ngày thanh toán: ${receiptData.paymentDate}

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
Liên hệ: 0945 532 939 | info@hanoisuntravel.com
    `;

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.paymentId}.txt`;
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
          <p className="mt-4 text-gray-600">Đang xác minh thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-secondary"
            >
              Xem đơn đặt chỗ
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã đặt tour với chúng tôi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Chi tiết đặt chỗ</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Mã thanh toán</h3>
                      <p className="text-lg font-semibold text-gray-900">{paymentData.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Mã đặt chỗ</h3>
                      <p className="text-lg font-semibold text-gray-900">{paymentData.booking_id}</p>
                    </div>
                  </div>

                  {/* Tour Info */}
                  {bookingData && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{bookingData.tourTitle}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Ngày đi</p>
                            <p className="text-sm text-gray-600">{bookingData.startDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Số khách</p>
                            <p className="text-sm text-gray-600">{bookingData.passengerCount} người</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Thời lượng</p>
                            <p className="text-sm text-gray-600">{bookingData.duration || '3 ngày 2 đêm'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Điểm đến</p>
                            <p className="text-sm text-gray-600">{bookingData.destination || 'Việt Nam'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết thanh toán</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phương thức thanh toán</p>
                        <p className="text-sm text-gray-600 capitalize">{paymentData.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Số tiền</p>
                        <p className="text-sm text-gray-600">
                          {paymentService.formatAmount(paymentData.amount, paymentData.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Trạng thái</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Hoàn thành
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Thời gian</p>
                        <p className="text-sm text-gray-600">
                          {new Date(paymentData.paid_at || paymentData.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {paymentData.transaction_id && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900">Mã giao dịch ngân hàng</p>
                        <p className="text-sm text-gray-600 font-mono">{paymentData.transaction_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tiếp theo</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadReceipt}
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải hóa đơn
                  </button>
                  
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Xem đơn đặt chỗ
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Về trang chủ
                  </button>
                </div>

                {/* Important Notes */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Lưu ý quan trọng</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Email xác nhận sẽ được gửi trong vòng 5-10 phút</li>
                    <li>• Vui lòng kiểm tra hộp thư chính và thư rác</li>
                    <li>• Liên hệ hotline nếu cần hỗ trợ: 0945 532 939</li>
                    <li>• Mang theo giấy tờ tùy thân khi đi tour</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
