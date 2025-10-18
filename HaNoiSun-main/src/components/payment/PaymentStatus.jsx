import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, CreditCard, Building2 } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

const PaymentStatus = ({ paymentId, onStatusUpdate }) => {
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPaymentStatus();

    // Auto refresh every 5 seconds for pending payments
    const interval = setInterval(() => {
      if (payment?.status === 'PENDING') {
        loadPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId, payment?.status]);

  const loadPaymentStatus = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError('');

      const response = await paymentService.checkPaymentStatus(paymentId);

      if (response.success) {
        setPayment(response.payment);
        onStatusUpdate?.(response.status);
      } else {
        setError('Không thể tải thông tin thanh toán');
      }
    } catch (error) {
      console.error('Load payment status error:', error);
      setError('Có lỗi xảy ra khi tải thông tin thanh toán');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'failed':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'cancelled':
        return <XCircle className="w-8 h-8 text-gray-600" />;
      case 'refunded':
        return <RefreshCw className="w-8 h-8 text-blue-600" />;
      default:
        return <Clock className="w-8 h-8 text-yellow-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thanh toán thành công';
      case 'FAILED':
        return 'Thanh toán thất bại';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      case 'PENDING':
        return 'Đang xử lý thanh toán';
      default:
        return 'Trạng thái không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'FAILED':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'REFUNDED':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'PENDING':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  const getGatewayIcon = (gateway) => {
    switch (gateway) {
      case 'vnpay':
        return <Building2 className="w-5 h-5" />;
      case 'stripe':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Đang tải thông tin thanh toán...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => loadPaymentStatus()}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Không tìm thấy thông tin thanh toán</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Status Header */}
      <div className={`border rounded-lg p-4 mb-6 ${getStatusColor(payment.payment_status)}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon(payment.payment_status)}
          <div className="flex-1">
            <h3 className="font-semibold">{getStatusText(payment.payment_status)}</h3>
            <p className="text-sm opacity-90">
              {payment.payment_status === 'pending' && 'Vui lòng đợi trong khi chúng tôi xử lý thanh toán của bạn'}
              {payment.payment_status === 'completed' && 'Thanh toán của bạn đã được xử lý thành công'}
              {payment.payment_status === 'failed' && 'Có lỗi xảy ra trong quá trình thanh toán'}
              {payment.payment_status === 'cancelled' && 'Thanh toán đã được hủy'}
              {payment.payment_status === 'refunded' && 'Thanh toán đã được hoàn tiền'}
            </p>
          </div>
          {payment.payment_status === 'pending' && (
            <button
              onClick={() => loadPaymentStatus(true)}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-white bg-opacity-50 rounded-md hover:bg-opacity-75 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Thông tin thanh toán</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã thanh toán:</span>
                <span className="font-mono font-medium">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold">
                  {paymentService.formatAmount(payment.amount, payment.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <div className="flex items-center space-x-1">
                  {getGatewayIcon(payment.payment_gateway)}
                  <span className="capitalize">{payment.payment_gateway}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span>{new Date(payment.created_at).toLocaleString('vi-VN')}</span>
              </div>
              {payment.completed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span>{new Date(payment.completed_at).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Gateway Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Thông tin giao dịch</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                  payment.payment_status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  payment.payment_status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusText(payment.payment_status)}
                </span>
              </div>
              {payment.gateway_transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-xs">{payment.gateway_transaction_id}</span>
                </div>
              )}
              {payment.description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mô tả:</span>
                  <span className="text-right">{payment.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        {payment.transactions && payment.transactions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Lịch sử giao dịch</h4>
            <div className="space-y-2">
              {payment.transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {transaction.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : transaction.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {paymentService.formatAmount(transaction.amount, transaction.currency)}
                    </p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refund Info */}
        {payment.payment_status === 'refunded' && payment.refund_amount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-2">Thông tin hoàn tiền</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Số tiền hoàn:</span>
                <span className="font-medium text-blue-900">
                  {paymentService.formatAmount(payment.refund_amount, payment.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Lý do:</span>
                <span className="text-blue-900">{payment.refund_reason || 'Không có lý do'}</span>
              </div>
              {payment.refunded_at && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Thời gian hoàn tiền:</span>
                  <span className="text-blue-900">
                    {new Date(payment.refunded_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
