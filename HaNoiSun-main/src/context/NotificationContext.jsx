import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';
import websocketService from '../services/websocketService';
import BrowserNotificationManager from '../utils/browserNotifications';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Load notifications from API or localStorage
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Setup WebSocket connection and listeners
  useEffect(() => {
    if (!user) {
      websocketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Connect to WebSocket
    websocketService.connect(user.id);

    // Listen for connection status changes
    const handleConnectionChange = () => {
      setIsConnected(websocketService.isConnected());
    };

    const unsubscribeConnection = websocketService.on('connection', handleConnectionChange);

    // Listen for new notifications
    const handleNewNotification = async (notificationData) => {
      setNotifications(prev => [notificationData, ...prev]);

      // Show browser notification
      await BrowserNotificationManager.showNotification(notificationData.title, {
        body: notificationData.message,
        data: {
          type: 'notification',
          notificationId: notificationData.id,
          bookingId: notificationData.bookingId
        }
      });
    };

    const unsubscribeNotification = websocketService.on('notification', handleNewNotification);

    // Listen for booking updates that might generate notifications
    const handleBookingUpdate = (bookingData) => {
      // Handle booking updates that might need notifications
      console.log('Booking updated:', bookingData);
    };

    const unsubscribeBooking = websocketService.on('booking_update', handleBookingUpdate);

    return () => {
      unsubscribeConnection();
      unsubscribeNotification();
      unsubscribeBooking();
    };
  }, [user]);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to mock data if API fails
      setNotifications([
        {
          id: 1,
          type: 'system',
          title: 'Chào mừng đến với Hà Nội Sun Travel!',
          message: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.',
          time: new Date().toISOString(),
          read: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Update local state first for immediate UI feedback
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Call API to persist the change (don't wait for it)
      notificationService.markAsRead(notificationId).catch(error => {
        console.error('Error marking notification as read:', error);
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state first for immediate UI feedback
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );

      // Call API to persist the change (don't wait for it)
      notificationService.markAllAsRead().catch(error => {
        console.error('Error marking all notifications as read:', error);
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = async (notification) => {
    try {
      // Add to local state first for immediate UI feedback
      const newNotification = {
        id: Date.now(),
        time: new Date().toISOString(),
        read: false,
        ...notification
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Try to call API (don't wait for it)
      notificationService.createNotification(notification).catch(error => {
        console.error('Error creating notification:', error);
      });

      // Show browser notification
      await BrowserNotificationManager.showNotification(newNotification.title, {
        body: newNotification.message,
        data: {
          type: 'notification',
          notificationId: newNotification.id,
          bookingId: newNotification.bookingId
        }
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      // Update local state first for immediate UI feedback
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Call API to persist the change (don't wait for it)
      notificationService.deleteNotification(notificationId).catch(error => {
        console.error('Error deleting notification:', error);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      // Update local state first for immediate UI feedback
      setNotifications([]);

      // Call API to persist the change (don't wait for it)
      notificationService.clearAll().catch(error => {
        console.error('Error clearing all notifications:', error);
      });
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
    // WebSocket utilities
    sendMessage: websocketService.send.bind(websocketService),
    getConnectionState: websocketService.getConnectionState.bind(websocketService),
    // Browser notification utilities
    requestNotificationPermission: BrowserNotificationManager.requestPermission.bind(BrowserNotificationManager),
    showBookingNotification: BrowserNotificationManager.showBookingNotification.bind(BrowserNotificationManager),
    showSystemNotification: BrowserNotificationManager.showSystemNotification.bind(BrowserNotificationManager),
    getNotificationPermissionStatus: BrowserNotificationManager.getPermissionStatus.bind(BrowserNotificationManager)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
