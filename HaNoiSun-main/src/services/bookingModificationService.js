import { api } from './api';

// Booking Modification Service - Handle booking changes
export const bookingModificationService = {
  // Get booking modification options
  getModificationOptions: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/modification-options`);
      return response.data;
    } catch (error) {
      console.error('Error fetching modification options:', error);
      throw error;
    }
  },

  // Modify booking dates
  modifyBookingDate: async (bookingId, newDate, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/date`, {
        newDate,
        reason,
        modificationType: 'date_change'
      });
      return response.data;
    } catch (error) {
      console.error('Error modifying booking date:', error);
      throw error;
    }
  },

  // Modify passenger count
  modifyPassengers: async (bookingId, newPassengers, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/passengers`, {
        newPassengers,
        reason,
        modificationType: 'passenger_change'
      });
      return response.data;
    } catch (error) {
      console.error('Error modifying passengers:', error);
      throw error;
    }
  },

  // Modify contact information
  modifyContactInfo: async (bookingId, newContactInfo, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/contact`, {
        newContactInfo,
        reason,
        modificationType: 'contact_change'
      });
      return response.data;
    } catch (error) {
      console.error('Error modifying contact info:', error);
      throw error;
    }
  },

  // Add special requests
  addSpecialRequests: async (bookingId, specialRequests) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/special-requests`, {
        specialRequests,
        modificationType: 'special_requests'
      });
      return response.data;
    } catch (error) {
      console.error('Error adding special requests:', error);
      throw error;
    }
  },

  // Get modification history
  getModificationHistory: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/modification-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching modification history:', error);
      throw error;
    }
  },

  // Calculate modification fees
  calculateModificationFees: async (bookingId, modificationType, changes) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/calculate-fees`, {
        modificationType,
        changes
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating modification fees:', error);
      throw error;
    }
  }
};

export default bookingModificationService;
