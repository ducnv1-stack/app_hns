import React, { useState } from 'react';
import { Bell, BellOff, Wifi, WifiOff } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const NotificationStatus = () => {
  const { isConnected, getConnectionState, requestNotificationPermission, getNotificationPermissionStatus } = useNotification();
  const [showTooltip, setShowTooltip] = useState(false);

  const connectionState = getConnectionState();
  const notificationPermission = getNotificationPermissionStatus();

  const getConnectionIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'closed':
      case 'disconnected':
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Đã kết nối';
      case 'connecting':
        return 'Đang kết nối...';
      case 'closed':
      case 'disconnected':
      default:
        return 'Mất kết nối';
    }
  };

  const getNotificationIcon = () => {
    switch (notificationPermission) {
      case 'granted':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'denied':
        return <BellOff className="h-4 w-4 text-gray-400" />;
      case 'not-supported':
        return <BellOff className="h-4 w-4 text-gray-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationText = () => {
    switch (notificationPermission) {
      case 'granted':
        return 'Thông báo đã bật';
      case 'denied':
        return 'Thông báo bị tắt';
      case 'not-supported':
        return 'Không hỗ trợ';
      default:
        return 'Chưa cấp quyền';
    }
  };

  const handleNotificationClick = async () => {
    if (notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Connection Status */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {getConnectionIcon()}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
            {getConnectionText()}
          </div>
        )}
      </div>

      {/* Notification Permission Status */}
      <div
        className="relative cursor-pointer"
        onClick={handleNotificationClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {getNotificationIcon()}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
            {getNotificationText()}
            {notificationPermission !== 'granted' && notificationPermission !== 'denied' && notificationPermission !== 'not-supported' && (
              <div className="text-center mt-1">
                <button className="text-xs bg-blue-600 px-2 py-1 rounded">
                  Bật thông báo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationStatus;
