import React from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationTest = () => {
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    requestNotificationPermission,
    showBookingNotification,
    showSystemNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotification();

  const handleTestNotification = async () => {
    // Request permission first
    await requestNotificationPermission();

    // Show a test notification
    await showSystemNotification(
      'Test Notification',
      'This is a test notification to verify the system is working correctly.',
      'info'
    );
  };

  const handleTestBookingNotification = async () => {
    const mockBooking = {
      id: 'BK001',
      bookingNumber: 'BK001',
      tourName: 'Hạ Long 1 Ngày',
      userId: 'current-user-id'
    };

    await showBookingNotification(mockBooking, 'confirmed');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Notification System Test</h2>

      {/* Status Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${unreadCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {unreadCount}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? '🟢' : '🔴'}
            </div>
            <div className="text-sm text-gray-600">Connected</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${!isLoading ? 'text-green-500' : 'text-yellow-500'}`}>
              {isLoading ? '⏳' : '✅'}
            </div>
            <div className="text-sm text-gray-600">Loading</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {notifications.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Test Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestNotification}
            className="btn-primary"
          >
            Test System Notification
          </button>
          <button
            onClick={handleTestBookingNotification}
            className="btn-secondary"
          >
            Test Booking Notification
          </button>
          <button
            onClick={requestNotificationPermission}
            className="btn-outline"
          >
            Request Permission
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="btn-danger disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTest;
