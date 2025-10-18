import { api } from './api';

// Payment Service - Handle payment processing
export const paymentService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payment status
  getPayment: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  },

  // Get user's payments
  getUserPayments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await api.get(`/payments/user/payments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  },

  // Process refund
  processRefund: async (paymentId, refundData) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, refundData);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await api.get('/payments/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  },

  // VNPay payment flow (updated for new API)
  initiateVNPayPayment: async (paymentData) => {
    try {
      const response = await paymentService.createPayment({
        ...paymentData,
        payment_method: 'bank_transfer'
      });

      if (response.success && response.data.gateway?.payment_url) {
        return {
          success: true,
          paymentUrl: response.data.gateway.payment_url,
          paymentId: response.data.payment.id
        };
      } else {
        throw new Error('Failed to create VNPay payment URL');
      }
    } catch (error) {
      console.error('VNPay payment initiation error:', error);
      throw error;
    }
  },

  // Stripe payment flow (updated for new API)
  initiateStripePayment: async (paymentData) => {
    try {
      const response = await paymentService.createPayment({
        ...paymentData,
        payment_method: 'credit_card'
      });

      if (response.success && response.data.gateway?.client_secret) {
        return {
          success: true,
          clientSecret: response.data.gateway.client_secret,
          paymentIntentId: response.data.gateway.payment_intent_id,
          paymentId: response.data.payment.id,
          requiresAction: response.data.gateway.requires_action
        };
      } else {
        throw new Error('Failed to create Stripe payment intent');
      }
    } catch (error) {
      console.error('Stripe payment initiation error:', error);
      throw error;
    }
  },

  // Check payment status (updated for new API)
  checkPaymentStatus: async (paymentId) => {
    try {
      const response = await paymentService.getPayment(paymentId);

      if (response.success) {
        return {
          success: true,
          status: response.data.payment.payment_status,
          payment: response.data.payment,
          transactions: response.data.transactions
        };
      } else {
        throw new Error('Failed to check payment status');
      }
    } catch (error) {
      console.error('Payment status check error:', error);
      throw error;
    }
  },

  // Handle payment return from VNPay (updated for new API)
  handleVNPayReturn: async (queryParams) => {
    try {
      // The VNPay return handler is processed on the backend
      // Here we just check the payment status based on the return data
      const paymentId = queryParams.vnp_TxnRef;

      if (paymentId) {
        return await paymentService.checkPaymentStatus(paymentId);
      } else {
        throw new Error('Missing payment reference');
      }
    } catch (error) {
      console.error('VNPay return handling error:', error);
      throw error;
    }
  },

  // Validate payment data before submission
  validatePaymentData: (paymentData) => {
    const errors = [];

    if (!paymentData.booking_id) {
      errors.push('Booking ID is required');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!paymentData.payment_method) {
      errors.push('Payment method is required');
    }

    if (!paymentData.payment_gateway) {
      errors.push('Payment gateway is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format amount for display
  formatAmount: (amount, currency = 'VND') => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  },

  // Get supported payment methods
  getSupportedPaymentMethods: () => {
    return {
      vnpay: {
        name: 'VNPay',
        description: 'Thanh toán qua ngân hàng Việt Nam',
        methods: ['bank_transfer'],
        currencies: ['VND']
      },
      stripe: {
        name: 'Stripe',
        description: 'Thanh toán thẻ quốc tế',
        methods: ['credit_card'],
        currencies: ['USD', 'EUR', 'GBP']
      }
    };
  }
};

export default paymentService;
