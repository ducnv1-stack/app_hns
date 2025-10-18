import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Info,
  CheckCircle,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { cancellationService } from '../services/cancellationService';
import { useAuth } from '../context/AuthContext';

const BookingCancellationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState(null);
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [cancellationFees, setCancellationFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Cancellation form
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedRefundMethod, setSelectedRefundMethod] = useState('original_payment');
  const [confirmCancellation, setConfirmCancellation] = useState(false);

  useEffect(() => {
    const loadCancellationData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API calls
        setTimeout(() => {
          setBookingData({
            id: bookingId,
            bookingNumber: 'HNS-2024-001',
            tourTitle: 'Tour Hạ Long 2N1Đ',
            travelDate: '2024-02-15',
            passengers: {
              adults: 2,
              children: 1,
              infants: 0
            },
            totalPrice: 6800000,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'vnpay',
            createdAt: '2024-01-10T10:30:00Z'
          });

          setCancellationPolicy({
            canCancel: true,
            cancellationDeadline: '2024-02-10T23:59:59Z',
            policies: [
              {
                daysBefore: 7,
                refundPercentage: 100,
                description: 'Hủy trước 7 ngày: Hoàn tiền 100%'
              },
              {
                daysBefore: 3,
                refundPercentage: 70,
                description: 'Hủy trước 3-7 ngày: Hoàn tiền 70%'
              },
              {
                daysBefore: 1,
                refundPercentage: 50,
                description: 'Hủy trước 1-3 ngày: Hoàn tiền 50%'
              },
              {
                daysBefore: 0,
                refundPercentage: 0,
                description: 'Hủy trong vòng 24h: Không hoàn tiền'
              }
            ]
          });

          setCancellationFees({
            refundAmount: 4760000,
            cancellationFee: 2040000,
            refundPercentage: 70,
            processingFee: 50000,
            netRefund: 4710000
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading cancellation data:', error);
        setError('Không thể tải thông tin hủy đặt chỗ');
        setLoading(false);
      }
    };

    loadCancellationData();
  }, [bookingId]);

  const handleCancellation = async () => {
    if (!user) {
      setError('Vui lòng đăng nhập để thực hiện hủy đặt chỗ');
      return;
    }

    if (!confirmCancellation) {
      setError('Vui lòng xác nhận hủy đặt chỗ');
      return;
    }

    if (!cancellationReason.trim()) {
      setError('Vui lòng nhập lý do hủy đặt chỗ');
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      // Cancel booking
      const cancellationResult = await cancellationService.cancelBooking(
        bookingId,
        cancellationReason,
        new Date().toISOString()
      );

      // Process refund if applicable
      if (cancellationFees.refundAmount > 0) {
        await cancellationService.processRefund(
          bookingId,
          cancellationFees.netRefund,
          selectedRefundMethod,
          'Hủy đặt chỗ theo yêu cầu khách hàng'
        );
      }

      setSuccess('Đặt chỗ đã được hủy thành công!');
      
      // Redirect to cancellation confirmation after 3 seconds
      setTimeout(() => {
        navigate(`/cancellation-confirmation/${bookingId}`);
      }, 3000);

    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Có lỗi xảy ra khi hủy đặt chỗ. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
    } finally {
      setCancelling(false);
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

  const getDaysUntilTravel = () => {
    if (!bookingData) return 0;
    const travelDate = new Date(bookingData.travelDate);
    const now = new Date();
    const diffTime = travelDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin hủy đặt chỗ...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
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

  if (!cancellationPolicy.canCancel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Không thể hủy đặt chỗ</h2>
          <p className="mt-2 text-gray-600">
            Đặt chỗ này không thể hủy do đã quá hạn hoặc không đủ điều kiện.
          </p>
          <button
            onClick={() => navigate(`/my-bookings/${bookingId}`)}
            className="mt-4 btn-primary"
          >
            Quay lại chi tiết đặt chỗ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hủy đặt chỗ</h1>
          <p className="text-gray-600 mt-2">Mã đặt chỗ: {bookingData.bookingNumber}</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cancellation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin đặt chỗ</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Booking Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{bookingData.tourTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ngày đi: {formatDate(bookingData.travelDate)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {bookingData.passengers.adults} người lớn, {bookingData.passengers.children} trẻ em
                    </div>
                  </div>
                </div>

                {/* Days Until Travel */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">
                      Còn {getDaysUntilTravel()} ngày đến ngày đi
                    </span>
                  </div>
                </div>

                {/* Cancellation Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do hủy đặt chỗ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Vui lòng nhập lý do hủy đặt chỗ..."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Refund Method */}
                {cancellationFees.refundAmount > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức hoàn tiền
                    </label>
                    <select
                      value={selectedRefundMethod}
                      onChange={(e) => setSelectedRefundMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="original_payment">Hoàn về phương thức thanh toán gốc</option>
                      <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                      <option value="wallet">Ví điện tử</option>
                    </select>
                  </div>
                )}

                {/* Confirmation Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="confirmCancellation"
                    checked={confirmCancellation}
                    onChange={(e) => setConfirmCancellation(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirmCancellation" className="ml-3 text-sm text-gray-700">
                    Tôi xác nhận muốn hủy đặt chỗ này và hiểu rằng việc hủy không thể hoàn tác.
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tóm tắt hủy đặt chỗ</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Số tiền đã thanh toán</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(bookingData.totalPrice)}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Phí hủy đặt chỗ</p>
                    <p className="text-lg font-semibold text-red-600">
                      -{formatCurrency(cancellationFees.cancellationFee)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phí xử lý</p>
                    <p className="text-sm text-gray-900">
                      -{formatCurrency(cancellationFees.processingFee)}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Số tiền hoàn lại</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(cancellationFees.netRefund)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({cancellationFees.refundPercentage}% của tổng tiền)
                    </p>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Chính sách hủy:</p>
                      <ul className="text-xs space-y-1">
                        {cancellationPolicy.policies.map((policy, index) => (
                          <li key={index}>• {policy.description}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleCancellation}
                  disabled={cancelling || !confirmCancellation || !cancellationReason.trim()}
                  className="w-full mt-6 btn-danger flex items-center justify-center"
                >
                  {cancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang hủy...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đặt chỗ
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(`/my-bookings/${bookingId}`)}
                  className="w-full mt-3 btn-outline"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellationPage;
