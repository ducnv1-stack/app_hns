import { api } from './api';

// Notification utilities for booking events
const triggerBookingNotification = (booking, type, customMessage) => {
  const message = customMessage || getNotificationMessage(type, booking);

  window.dispatchEvent(new CustomEvent('bookingNotification', {
    detail: {
      booking,
      type,
      message
    }
  }));
};

const getNotificationMessage = (type, booking) => {
  const messages = {
    created: `Đặt chỗ #${booking.bookingNumber} cho tour "${booking.tourName}" đã được tạo thành công.`,
    confirmed: `Đặt chỗ #${booking.bookingNumber} đã được xác nhận. Vui lòng chuẩn bị cho chuyến đi!`,
    paid: `Thanh toán cho đặt chỗ #${booking.bookingNumber} đã được xử lý thành công.`,
    cancelled: `Đặt chỗ #${booking.bookingNumber} đã bị hủy theo yêu cầu của bạn.`,
    modified: `Đặt chỗ #${booking.bookingNumber} đã được cập nhật thành công.`,
    reminder: `Tour "${booking.tourName}" sẽ khởi hành vào ngày mai. Vui lòng kiểm tra lại thông tin.`
  };

  return messages[type] || `Có cập nhật về đặt chỗ #${booking.bookingNumber}`;
};

// Booking Service - API calls for bookings
export const bookingService = {
  // Get all bookings (for admin)
  getBookings: async (filters = {}) => {
    try {
      const response = await api.get('/bookings', filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      const booking = response.data;

      // Trigger notification for booking creation
      triggerBookingNotification(booking, 'created');

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status, note = '') => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status, note });
      const booking = response.data;

      // Trigger notification based on status change
      if (status === 'confirmed') {
        triggerBookingNotification(booking, 'confirmed');
      } else if (status === 'cancelled') {
        triggerBookingNotification(booking, 'cancelled');
      } else if (status === 'paid') {
        triggerBookingNotification(booking, 'paid');
      }

      return booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
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

export default bookingService;
