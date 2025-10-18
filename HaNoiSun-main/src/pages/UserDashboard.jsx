import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, CreditCard, LogOut, User } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Xin chào</div>
              <div className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</div>
            </div>
          </div>
          <button onClick={logout} className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600">
            <LogOut className="h-5 w-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-primary-600" />
            <div className="font-semibold">Đặt tour của tôi</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Bạn chưa có đặt tour nào.</p>
          <div className="mt-4 space-y-2">
            <Link to="/my-bookings" className="block text-primary-600 hover:text-primary-700 font-medium">
              Xem đơn đặt chỗ →
            </Link>
            <Link to="/tours" className="block text-primary-600 hover:text-primary-700 font-medium">
              Đặt tour ngay →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <div className="font-semibold">Thanh toán gần đây</div>
          </div>
          <p className="text-sm text-gray-600">Chưa có giao dịch.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="h-5 w-5 text-primary-600" />
            <div className="font-semibold">Hồ sơ cá nhân</div>
          </div>
          <div className="text-sm text-gray-600 mb-2">Tên: {user?.name || 'User'}</div>
          <div className="text-sm text-gray-600 mb-4">Vai trò: {user?.role || 'user'}</div>
          <Link to="/profile" className="text-primary-600 hover:text-primary-700 font-medium">
            Cập nhật hồ sơ →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;




