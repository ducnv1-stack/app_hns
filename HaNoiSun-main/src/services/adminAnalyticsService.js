import { api } from './api';

const adminAnalyticsService = {
  // Get overview statistics
  getOverview: async (params = {}) => {
    const response = await api.get('/admin/analytics/overview', { params });
    return response.data;
  },

  // Get product analytics
  getProductAnalytics: async () => {
    const response = await api.get('/admin/analytics/products');
    return response.data;
  },

  // Get orders by status
  getOrdersByStatus: async (params = {}) => {
    const response = await api.get('/admin/analytics/orders-by-status', { params });
    return response.data;
  },

  // Get revenue by period
  getRevenueByPeriod: async (params = {}) => {
    const response = await api.get('/admin/analytics/revenue-by-period', { params });
    return response.data;
  },

  // Get payment methods breakdown
  getPaymentMethods: async () => {
    const response = await api.get('/admin/analytics/payment-methods');
    return response.data;
  }
};

export default adminAnalyticsService;
