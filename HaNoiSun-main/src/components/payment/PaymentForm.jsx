import React, { useState, useEffect } from 'react';
import { CreditCard, Building2, Smartphone, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

const PaymentForm = ({ bookingData, onPaymentSuccess, onPaymentError }) => {
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [supportedMethods, setSupportedMethods] = useState({});

  useEffect(() => {
    // Load supported payment methods
    const methods = paymentService.getSupportedPaymentMethods();
    setSupportedMethods(methods);
  }, []);

  const handleGatewayChange = (gateway) => {
    setSelectedGateway(gateway);
    setSelectedMethod(''); // Reset method selection
    setError('');
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedGateway || !selectedMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const paymentData = {
        booking_id: bookingData.id,
        amount: bookingData.totalPrice,
        currency: bookingData.currency || 'USD',
        payment_method: selectedMethod,
        metadata: {
          gateway: selectedGateway,
          description: `Thanh toán tour: ${bookingData.tourTitle}`,
          tour_title: bookingData.tourTitle,
          passenger_count: bookingData.passengerCount || 1
        }
      };

      let result;

      if (selectedGateway === 'vnpay') {
        result = await paymentService.initiateVNPayPayment(paymentData);
        if (result.success) {
          // Redirect to VNPay payment page
          window.location.href = result.paymentUrl;
        }
      } else if (selectedGateway === 'stripe') {
        result = await paymentService.initiateStripePayment(paymentData);
        if (result.success) {
          // Handle Stripe payment (requires Stripe Elements integration)
          onPaymentSuccess({
            type: 'stripe',
            clientSecret: result.clientSecret,
            paymentIntentId: result.paymentIntentId,
            paymentId: result.paymentId,
            requiresAction: result.requiresAction
          });
        }
      }

      if (result && result.success) {
        onPaymentSuccess(result);
      } else {
        setError('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvailableMethods = () => {
    if (!selectedGateway || !supportedMethods[selectedGateway]) {
      return [];
    }
    return supportedMethods[selectedGateway].methods;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán</h2>
        <p className="text-gray-600">
          Chọn phương thức thanh toán phù hợp với bạn
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Thông tin đặt tour</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tour:</span>
            <span className="font-medium">{bookingData.tourTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số người:</span>
            <span className="font-medium">{bookingData.passengerCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày đi:</span>
            <span className="font-medium">{bookingData.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày về:</span>
            <span className="font-medium">{bookingData.endDate}</span>
          </div>
          <div className="border-t pt-2 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-primary-600">
                {paymentService.formatAmount(bookingData.totalPrice, bookingData.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Chọn cổng thanh toán</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(supportedMethods).map(([gateway, config]) => (
            <div
              key={gateway}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedGateway === gateway
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleGatewayChange(gateway)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedGateway === gateway
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedGateway === gateway && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{config.name}</h4>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>

              {/* Supported currencies */}
              <div className="mt-2 flex flex-wrap gap-1">
                {config.currencies.map(currency => (
                  <span
                    key={currency}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {currency}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      {selectedGateway && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Chọn phương thức thanh toán</h3>
          <div className="space-y-3">
            {getAvailableMethods().map(method => (
              <label
                key={method}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => handleMethodChange(method)}
                  className="text-primary-600"
                />
                <div className="flex-1">
                  {method === 'credit_card' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Thẻ tín dụng/ghi nợ</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Visa, Mastercard, American Express
                      </p>
                    </>
                  )}
                  {method === 'bank_transfer' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Chuyển khoản ngân hàng</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Thanh toán qua ứng dụng ngân hàng hoặc ATM
                      </p>
                    </>
                  )}
                </div>
                {selectedMethod === method && (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-green-800 text-sm">
            Thông tin thanh toán của bạn được bảo mật và mã hóa
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedGateway || !selectedMethod || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          !selectedGateway || !selectedMethod || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          `Thanh toán ${paymentService.formatAmount(bookingData.totalPrice, bookingData.currency)}`
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Bằng việc tiếp tục, bạn đồng ý với{' '}
        <a href="#" className="text-primary-600 hover:underline">Điều khoản và Điều kiện</a>
        {' '}của chúng tôi
      </p>
    </div>
  );
};

export default PaymentForm;
