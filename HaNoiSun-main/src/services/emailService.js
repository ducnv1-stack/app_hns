import { api } from './api';

// Email Service - Handle email notifications
export const emailService = {
  // Send Booking Confirmation
  sendBookingConfirmation: async (bookingData) => {
    try {
      const response = await api.post('/emails/booking-confirmation', {
        bookingId: bookingData.bookingId,
        customerEmail: bookingData.customerEmail,
        customerName: bookingData.customerName,
        tourTitle: bookingData.tourTitle,
        travelDate: bookingData.travelDate,
        totalPrice: bookingData.totalPrice,
        bookingNumber: bookingData.bookingNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  },

  // Send Payment Success Notification
  sendPaymentSuccess: async (paymentData) => {
    try {
      const response = await api.post('/emails/payment-success', {
        bookingId: paymentData.bookingId,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending payment success notification:', error);
      throw error;
    }
  },

  // Send Payment Failure Notification
  sendPaymentFailure: async (paymentData) => {
    try {
      const response = await api.post('/emails/payment-failure', {
        bookingId: paymentData.bookingId,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        errorMessage: paymentData.errorMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error sending payment failure notification:', error);
      throw error;
    }
  },

  // Send Tour Reminder
  sendTourReminder: async (bookingData) => {
    try {
      const response = await api.post('/emails/tour-reminder', {
        bookingId: bookingData.bookingId,
        customerEmail: bookingData.customerEmail,
        customerName: bookingData.customerName,
        tourTitle: bookingData.tourTitle,
        travelDate: bookingData.travelDate,
        meetingPoint: bookingData.meetingPoint,
        meetingTime: bookingData.meetingTime,
        contactInfo: bookingData.contactInfo
      });
      return response.data;
    } catch (error) {
      console.error('Error sending tour reminder:', error);
      throw error;
    }
  },

  // Send Cancellation Notification
  sendCancellationNotification: async (cancellationData) => {
    try {
      const response = await api.post('/emails/cancellation', {
        bookingId: cancellationData.bookingId,
        customerEmail: cancellationData.customerEmail,
        customerName: cancellationData.customerName,
        tourTitle: cancellationData.tourTitle,
        cancellationDate: cancellationData.cancellationDate,
        refundAmount: cancellationData.refundAmount,
        refundMethod: cancellationData.refundMethod
      });
      return response.data;
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      throw error;
    }
  },

  // Send Password Reset Email
  sendPasswordReset: async (email, resetToken) => {
    try {
      const response = await api.post('/emails/password-reset', {
        email,
        resetToken,
        resetUrl: `${window.location.origin}/reset-password?token=${resetToken}`
      });
      return response.data;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
};

export default emailService;
