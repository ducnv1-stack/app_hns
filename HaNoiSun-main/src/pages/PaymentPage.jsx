import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  XCircle,
  Loader,
  ArrowLeft,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/payment/PaymentForm';
import PaymentStatus from '../components/payment/PaymentStatus';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'processing', 'status'
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get booking data from location state or API
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
      setLoading(false);
    } else {
      // Fetch booking data from API
      // This would be implemented when backend is ready
      setLoading(false);
    }
  }, [location.state]);

  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua VNPay (ATM, Internet Banking, QR Code)',
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Thanh toán quốc tế (Visa, Mastercard, American Express)',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false
    },
    {
      id: 'bank_transfer',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng',
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      popular: false
    }
  ];

  const handlePaymentSuccess = (result) => {
    console.log('Payment success:', result);

    if (result.type === 'stripe') {
      // For Stripe, show processing status
      setCurrentStep('processing');
      setPaymentData({
        paymentId: result.paymentId,
        type: 'stripe',
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        requiresAction: result.requiresAction
      });
    } else {
      // For VNPay, redirect to payment URL (handled in PaymentForm)
      setCurrentStep('status');
      setPaymentData({
        paymentId: result.paymentId,
        type: 'vnpay'
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setCurrentStep('form');
    setError(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
  };

  const handleStatusUpdate = (status) => {
    if (status === 'SUCCESS') {
      // Payment completed successfully
      setTimeout(() => {
        navigate('/payment/success', {
          state: { 
            paymentId: paymentData?.paymentId,
            bookingData: bookingData
          }
        });
      }, 2000);
    } else if (status === 'FAILED') {
      // Payment failed
      setCurrentStep('form');
    }
  };

  const handleBackToBooking = () => {
    navigate('/my-bookings');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy thông tin đặt chỗ</h2>
          <p className="mt-2 text-gray-600">Vui lòng quay lại và thử lại.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-primary"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToBooking}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                currentStep === 'form' ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">Chọn thanh toán</span>
              </div>

              {currentStep !== 'form' && (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className={`flex items-center space-x-2 ${
                    currentStep === 'status' ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Kết quả</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'form' && (
          <PaymentForm
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        )}

        {(currentStep === 'processing' || currentStep === 'status') && paymentData && (
          <PaymentStatus
            paymentId={paymentData.paymentId}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {/* Processing Screen for Stripe */}
        {currentStep === 'processing' && paymentData?.type === 'stripe' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đang xử lý thanh toán...
            </h3>
            <p className="text-gray-600">
              Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
