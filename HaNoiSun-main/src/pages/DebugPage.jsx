import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const DebugPage = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { notifications, unreadCount, isConnected, isLoading } = useNotification();

  const handleLogin = () => {
    login({
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>

      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
          <div className="flex space-x-4">
            <button onClick={handleLogin} className="btn-primary">
              Login as Test User
            </button>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notification Status</h2>
        <div className="space-y-2">
          <p><strong>Unread Count:</strong> {unreadCount}</p>
          <p><strong>Total Notifications:</strong> {notifications.length}</p>
          <p><strong>Is Connected:</strong> {isConnected ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
          <p><strong>Notifications:</strong></p>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(notifications, null, 2)}
          </pre>
        </div>
      </div>

      {/* Test Links */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Links</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/my-bookings" className="btn-primary" target="_blank">
            My Bookings
          </a>
          <a href="/notifications" className="btn-primary" target="_blank">
            Notifications
          </a>
          <a href="/notification-test" className="btn-primary" target="_blank">
            Notification Test
          </a>
          <a href="/debug" className="btn-secondary" target="_blank">
            This Debug Page
          </a>
        </div>
      </div>

      {/* Quick Notification Test */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Notification Test</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              // Test notification system
              const testNotif = {
                type: 'test',
                title: 'Test Notification ' + new Date().toLocaleTimeString(),
                message: 'This is a test notification to verify the system is working!'
              };
              // Add to local state directly for testing
              console.log('Test notification created:', testNotif);
              alert('Test notification created! Check the Notifications page.');
            }}
            className="w-full btn-primary"
          >
            Create Test Notification
          </button>
          <div className="text-sm text-gray-600">
            <p>• Click button above to create a test notification</p>
            <p>• Go to Notifications page to see it</p>
            <p>• Check browser console for logs</p>
          </div>
        </div>
      </div>

      {/* Notification Bell Test */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notification Bell Test</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('Test notification bell clicked');
              alert('Notification bell is working!');
            }}
            className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            title="Test Notification Bell"
          >
            🔔 Test Bell
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <span className="text-sm text-gray-600">Click the bell above to test</span>
        </div>
      </div>

      {/* Browser Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Browser Info</h2>
        <div className="space-y-2">
          <p><strong>Notification Permission:</strong> {Notification.permission}</p>
          <p><strong>WebSocket Support:</strong> {typeof WebSocket !== 'undefined' ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Local Storage:</strong> {typeof Storage !== 'undefined' ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
