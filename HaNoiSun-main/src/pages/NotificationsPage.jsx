import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Search, Plus, AlertCircle, TestTube } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll, isLoading, addNotification } = useNotification();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testMessage, setTestMessage] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);

    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCreateTestNotification = () => {
    if (testTitle && testMessage) {
      addNotification({
        type: 'test',
        title: testTitle,
        message: testMessage
      });
      setTestTitle('');
      setTestMessage('');
      setShowTestPanel(false);
    }
  };

  const formatTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return '✅';
      case 'payment_received':
        return '💳';
      case 'booking_reminder':
        return '⏰';
      case 'booking_cancelled':
        return '❌';
      case 'system':
        return '⚙️';
      case 'test':
        return '🧪';
      default:
        return '📢';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả thông báo của bạn
            </p>
          </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTestPanel(!showTestPanel)}
                className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Notification
              </button>

              {unreadCount > 0 && (
                <div className="text-sm text-gray-600">
                  {unreadCount} chưa đọc
                </div>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </button>
              )}
            </div>
        </div>
      </div>

      {/* Test Panel */}
      {showTestPanel && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TestTube className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Tạo Thông Báo Test</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Tiêu đề thông báo
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Nhập tiêu đề thông báo..."
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Nội dung thông báo
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Nhập nội dung thông báo..."
                rows={3}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTestNotification}
                disabled={!testTitle || !testMessage}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo Thông Báo
              </button>
              <button
                onClick={() => setShowTestPanel(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông báo...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {notifications.length === 0 ? 'Không có thông báo nào' : 'Không tìm thấy thông báo nào'}
          </h3>
          <p className="text-gray-500">
            {notifications.length === 0
              ? 'Bạn sẽ thấy thông báo về đặt chỗ, thanh toán và các hoạt động khác ở đây.'
              : 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white shadow rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                !notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : 'border border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTime(notification.time)}</span>
                          {notification.bookingId && (
                            <span>• Đơn hàng #{notification.bookingId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                      title="Đánh dấu đã đọc"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More (for pagination if needed) */}
      {filteredNotifications.length > 0 && filteredNotifications.length >= 20 && (
        <div className="mt-8 text-center">
          <button className="btn-secondary">
            Tải thêm thông báo
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
