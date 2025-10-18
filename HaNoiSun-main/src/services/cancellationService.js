import { api } from './api';

// Cancellation Service - Handle booking cancellations and refunds
export const cancellationService = {
  // Get cancellation policy
  getCancellationPolicy: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/cancellation-policy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cancellation policy:', error);
      throw error;
    }
  },

  // Calculate cancellation fees
  calculateCancellationFees: async (bookingId, cancellationDate) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/calculate-cancellation-fees`, {
        cancellationDate: cancellationDate || new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating cancellation fees:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason, cancellationDate) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel`, {
        reason,
        cancellationDate: cancellationDate || new Date().toISOString(),
        cancellationType: 'customer_request'
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Process refund
  processRefund: async (bookingId, refundAmount, refundMethod, reason) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/refund`, {
        refundAmount,
        refundMethod,
        reason,
        refundType: 'cancellation_refund'
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Get refund status
  getRefundStatus: async (refundId) => {
    try {
      const response = await api.get(`/refunds/${refundId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching refund status:', error);
      throw error;
    }
  },

  // Get cancellation history
  getCancellationHistory: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/cancellation-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cancellation history:', error);
      throw error;
    }
  },

  // Request partial cancellation
  requestPartialCancellation: async (bookingId, passengersToCancel, reason) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/partial-cancel`, {
        passengersToCancel,
        reason,
        cancellationType: 'partial_cancellation'
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting partial cancellation:', error);
      throw error;
    }
  }
};

export default cancellationService;
