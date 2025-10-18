import { api } from './api';

// User Service - API calls for user management
export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await api.get('/users/profile', { userId });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put('/users/profile', profileData, {
        headers: { 'userId': userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user addresses
  getAddresses: async (userId) => {
    try {
      const response = await api.get('/users/addresses', { userId });
      return response.data;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  },

  // Add new address
  addAddress: async (userId, addressData) => {
    try {
      const response = await api.post('/users/addresses', addressData, {
        headers: { 'userId': userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/users/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async (userId, filters = {}) => {
    try {
      const response = await api.get('/users/bookings', { userId, ...filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }
};

export default userService;
