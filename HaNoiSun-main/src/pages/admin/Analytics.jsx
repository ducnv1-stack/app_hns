import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingCart, 
  CreditCard, 
  Package,
  Eye,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import adminAnalyticsService from '../../services/adminAnalyticsService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }

      const [overviewRes, productsRes, ordersRes, paymentsRes] = await Promise.all([
        adminAnalyticsService.getOverview(params),
        adminAnalyticsService.getProductAnalytics(),
        adminAnalyticsService.getOrdersByStatus(params),
        adminAnalyticsService.getPaymentMethods()
      ]);

      // API returns { success: true, data: {...} }
      setOverview(overviewRes?.data || overviewRes);
      setProducts(productsRes?.data || productsRes);
      setOrdersByStatus(ordersRes?.data || ordersRes);
      setPaymentMethods(paymentsRes?.data || paymentsRes);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không thể tải dữ liệu thống kê</p>
      </div>
    );
  }

  const { products: productStats, orders: orderStats, payments: paymentStats, unpaid, views } = overview;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tổng quan về sản phẩm, đơn hàng và thanh toán</p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <span className="flex items-center text-gray-500">đến</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => setDateRange({ startDate: '', endDate: '' })}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(productStats.total_products)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {formatNumber(productStats.active_products)} đang hoạt động
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(orderStats.total_orders)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {formatCurrency(orderStats.total_order_value)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng thanh toán</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(paymentStats.total_paid_amount)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {formatNumber(paymentStats.successful_payments)} thành công
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Unpaid Amount */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chưa thanh toán</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {formatCurrency(unpaid.unpaid_amount)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {formatNumber(unpaid.unpaid_orders_count)} đơn hàng
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Type Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Phân tích theo loại sản phẩm
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Tour du lịch</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {formatNumber(productStats.tour_count)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Vé máy bay</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatNumber(productStats.flight_count)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Khách sạn</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {formatNumber(productStats.hotel_count)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Combo</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {formatNumber(productStats.combo_count)}
            </p>
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Đơn hàng theo trạng thái
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ordersByStatus.map((status) => {
            const statusConfig = {
              PENDING: { label: 'Chờ xử lý', color: 'yellow', icon: Clock },
              CONFIRMED: { label: 'Đã xác nhận', color: 'blue', icon: CheckCircle },
              COMPLETED: { label: 'Hoàn thành', color: 'green', icon: CheckCircle },
              CANCELED: { label: 'Đã hủy', color: 'red', icon: XCircle },
              EXPIRED: { label: 'Hết hạn', color: 'gray', icon: AlertCircle }
            };

            const config = statusConfig[status.status] || { label: status.status, color: 'gray', icon: AlertCircle };
            const Icon = config.icon;

            return (
              <div key={status.status} className={`p-4 bg-${config.color}-50 rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 text-${config.color}-600`} />
                  <p className="text-sm text-gray-600">{config.label}</p>
                </div>
                <p className={`text-2xl font-bold text-${config.color}-600`}>
                  {formatNumber(status.count)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(status.total_amount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tổng quan thanh toán
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">Đã thanh toán</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {formatNumber(paymentStats.successful_payments)} giao dịch
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(paymentStats.total_paid_amount)}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">Đang chờ</span>
              <div className="text-right">
                <p className="font-semibold text-yellow-600">
                  {formatNumber(paymentStats.pending_payments)} giao dịch
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(paymentStats.pending_payment_amount)}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-600">Thất bại</span>
              <div className="text-right">
                <p className="font-semibold text-red-600">
                  {formatNumber(paymentStats.failed_payments)} giao dịch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Phương thức thanh toán
          </h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.payment_method} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{method.payment_method}</span>
                  <span className="text-sm text-gray-500">{formatNumber(method.count)} giao dịch</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Thành công</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(method.successful_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Chờ xử lý</p>
                    <p className="font-semibold text-yellow-600">
                      {formatCurrency(method.pending_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Thất bại</p>
                    <p className="font-semibold text-red-600">
                      {formatCurrency(method.failed_amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top sản phẩm bán chạy
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn hàng</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.service_type === 'TOUR' ? 'bg-blue-100 text-blue-800' :
                      product.service_type === 'FLIGHT' ? 'bg-green-100 text-green-800' :
                      product.service_type === 'HOTEL_ROOM' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {product.service_type === 'HOTEL_ROOM' ? 'HOTEL' : product.service_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatNumber(product.order_count)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatNumber(product.total_quantity_sold)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(product.total_revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Analytics;
