import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

export const useBookingNotifications = () => {
  const { addNotification, showBookingNotification } = useNotification();

  useEffect(() => {
    const handleBookingNotification = (event) => {
      const { booking, type, message } = event.detail;

      // Create in-app notification
      addNotification({
        type: `booking_${type}`,
        title: getNotificationTitle(type),
        message: message || getNotificationMessage(type, booking),
        bookingId: booking.id,
        userId: booking.userId
      });

      // Show browser notification if applicable
      if (shouldShowBrowserNotification(type)) {
        showBookingNotification(booking, type);
      }
    };

    window.addEventListener('bookingNotification', handleBookingNotification);

    return () => {
      window.removeEventListener('bookingNotification', handleBookingNotification);
    };
  }, [addNotification, showBookingNotification]);

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

  return { triggerBookingNotification };
};

// Helper functions
const getNotificationTitle = (type) => {
  const titles = {
    created: 'Đặt chỗ mới được tạo',
    confirmed: 'Đặt chỗ đã được xác nhận',
    paid: 'Thanh toán thành công',
    cancelled: 'Đặt chỗ đã bị hủy',
    modified: 'Đặt chỗ đã được sửa đổi',
    reminder: 'Nhắc nhở khởi hành'
  };

  return titles[type] || 'Thông báo đặt chỗ';
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

const shouldShowBrowserNotification = (type) => {
  // Show browser notifications for important events
  const importantTypes = ['confirmed', 'paid', 'cancelled', 'reminder'];
  return importantTypes.includes(type);
};
