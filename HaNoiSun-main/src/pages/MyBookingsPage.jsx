import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Calendar, MapPin, Users, Clock, Eye, Download, X, Filter, Search, LogIn, Bell } from 'lucide-react';

const MyBookingsPage = () => {
  const { user, logout, login } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - sẽ thay thế bằng API
  const bookings = [
    {
      id: 'HST12345678',
      tourName: 'Combo Đà Nẵng 4N3Đ/3N2Đ 2025 siêu rẻ',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=300&q=80',
      status: 'confirmed',
      date: '2025-10-26',
      duration: '4 ngày 3 đêm',
      location: 'Đà Nẵng, Việt Nam',
      passengers: 2,
      totalPrice: 9500000,
      bookingDate: '2024-01-15'
    },
    {
      id: 'HST87654321',
      tourName: 'Hang Ngọc Rồng – Hành trình huyền thoại',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
      status: 'pending',
      date: '2025-10-15',
      duration: '1 ngày',
      location: 'Cẩm Phả, Quảng Ninh',
      passengers: 1,
      totalPrice: 590000,
      bookingDate: '2024-01-10'
    },
    {
      id: 'HST11223344',
      tourName: 'Tây An - Lạc Dương - Khai Phong 6N5Đ',
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=300&q=80',
      status: 'cancelled',
      date: '2025-11-05',
      duration: '6 ngày 5 đêm',
      location: 'Tây An, Trung Quốc',
      passengers: 2,
      totalPrice: 37980000,
      bookingDate: '2024-01-05'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = [
    { id: 'all', name: 'Tất cả', count: bookings.length },
    { id: 'confirmed', name: 'Đã xác nhận', count: bookings.filter(b => b.status === 'confirmed').length },
    { id: 'pending', name: 'Chờ xác nhận', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'completed', name: 'Hoàn thành', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', name: 'Đã hủy', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  // Quick login function for testing
  const handleQuickLogin = () => {
    login({
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@hanoisuntravel.com',
      role: 'user'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                ← Quay lại Trang chủ
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Đơn đặt chỗ của tôi</h1>
            </div>


            {/* Notification Bell for My Bookings Page */}
            {user && (
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title={`Thông báo (${unreadCount} chưa đọc)`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {user && (
              <button
                onClick={logout}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên tour hoặc mã đặt chỗ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'Không tìm thấy đơn đặt chỗ' : 'Chưa có đơn đặt chỗ nào'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc'
                : 'Bắt đầu khám phá và đặt tour ngay hôm nay'
              }
            </p>
            {!searchQuery && (
              <Link to="/tours" className="btn-primary">
                Khám phá tours
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tour Image */}
                    <div className="lg:w-48 flex-shrink-0">
                      <img
                        src={booking.image}
                        alt={booking.tourName}
                        className="w-full h-32 lg:h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                            <span className="text-sm text-gray-500">Mã: {booking.id}</span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {booking.tourName}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{booking.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{booking.passengers} người</span>
                            </div>
                            <div>
                              Đặt ngày: {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="lg:text-right">
                          <div className="text-2xl font-bold text-primary-600 mb-4">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(booking.totalPrice)}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                            <button 
                              onClick={() => navigate(`/my-bookings/${booking.id}`)}
                              className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </button>
                            
                            {booking.status === 'confirmed' && (
                              <button 
                                onClick={() => {
                                  // Mock download voucher
                                  const voucherContent = `VOUCHER TOUR\n\nMã đặt chỗ: ${booking.id}\nTour: ${booking.tourName}\nNgày đi: ${new Date(booking.date).toLocaleDateString('vi-VN')}\nSố khách: ${booking.passengers}\nTổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}\n\nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi!`;
                                  const blob = new Blob([voucherContent], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `voucher-${booking.id}.txt`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                }}
                                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                <Download className="h-4 w-4" />
                                <span>Tải voucher</span>
                              </button>
                            )}
                            
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <button 
                                onClick={() => navigate(`/booking/${booking.id}/modify`)}
                                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Sửa đổi</span>
                              </button>
                            )}
                            
                            {booking.status === 'pending' && (
                              <button 
                                onClick={() => navigate(`/booking/${booking.id}/cancel`)}
                                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                                <span>Hủy đặt chỗ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/tours"
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Đặt tour mới</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Cập nhật hồ sơ</span>
            </Link>
            
            <Link
              to="/contact"
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Liên hệ hỗ trợ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
