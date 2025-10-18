export class BrowserNotificationManager {
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notifications are denied');
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.warn('Notification permission denied');
      return false;
    }
  }

  static isSupported() {
    return 'Notification' in window;
  }

  static getPermissionStatus() {
    if (!this.isSupported()) {
      return 'not-supported';
    }

    return Notification.permission;
  }

  static async showNotification(title, options = {}) {
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      return null;
    }

    const defaultOptions = {
      icon: '/vite.svg', // TODO: Use proper app icon
      badge: '/vite.svg',
      tag: 'hanoi-sun-travel-notification',
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Auto-close after 5 seconds if not set to require interaction
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  static showBookingNotification(bookingData, type = 'confirmed') {
    const notifications = {
      confirmed: {
        title: 'Đặt chỗ đã được xác nhận! 🎉',
        body: `Tour "${bookingData.tourName}" của bạn đã được xác nhận thành công. Mã đặt chỗ: ${bookingData.bookingNumber}`,
        icon: '/vite.svg'
      },
      payment_received: {
        title: 'Thanh toán thành công! 💳',
        body: `Chúng tôi đã nhận được thanh toán cho đơn hàng #${bookingData.bookingNumber}. Cảm ơn bạn!`,
        icon: '/vite.svg'
      },
      reminder: {
        title: 'Nhắc nhở khởi hành ⏰',
        body: `Tour "${bookingData.tourName}" sẽ khởi hành vào ngày mai. Vui lòng kiểm tra lại thông tin.`,
        icon: '/vite.svg'
      },
      cancelled: {
        title: 'Đặt chỗ đã bị hủy ❌',
        body: `Đặt chỗ #${bookingData.bookingNumber} đã bị hủy. Vui lòng liên hệ chúng tôi nếu có thắc mắc.`,
        icon: '/vite.svg'
      }
    };

    const config = notifications[type] || notifications.confirmed;

    return this.showNotification(config.title, {
      body: config.body,
      icon: config.icon,
      data: {
        type: 'booking',
        bookingId: bookingData.id,
        bookingNumber: bookingData.bookingNumber
      }
    });
  }

  static showSystemNotification(title, message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    return this.showNotification(`${icons[type]} ${title}`, {
      body: message,
      icon: '/vite.svg',
      data: {
        type: 'system',
        notificationType: type
      }
    });
  }
}

export default BrowserNotificationManager;
