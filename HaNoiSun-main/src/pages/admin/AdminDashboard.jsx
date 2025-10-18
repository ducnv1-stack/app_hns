import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalTours: 0,
    monthlyGrowth: 0,
    pendingBookings: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalBookings: 1247,
          totalRevenue: 245000000,
          totalUsers: 892,
          totalTours: 45,
          monthlyGrowth: 12.5,
          pendingBookings: 23
        });

        setRecentBookings([
          {
            id: 'BK001',
            customer: 'Nguyễn Văn A',
            tour: 'Tour Hạ Long 2N1Đ',
            date: '2024-01-15',
            status: 'confirmed',
            amount: 2500000
          },
          {
            id: 'BK002',
            customer: 'Trần Thị B',
            tour: 'Tour Sapa 3N2Đ',
            date: '2024-01-14',
            status: 'pending',
            amount: 3200000
          },
          {
            id: 'BK003',
            customer: 'Lê Văn C',
            tour: 'Tour Hội An 2N1Đ',
            date: '2024-01-13',
            status: 'confirmed',
            amount: 1800000
          }
        ]);

        setTopTours([
          { name: 'Tour Hạ Long 2N1Đ', bookings: 45, revenue: 112500000 },
          { name: 'Tour Sapa 3N2Đ', bookings: 38, revenue: 121600000 },
          { name: 'Tour Hội An 2N1Đ', bookings: 32, revenue: 57600000 }
        ]);

        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'confirmed' ? 'Đã xác nhận' : 
         status === 'pending' ? 'Chờ xử lý' :
         status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Quản lý hệ thống đặt tour</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </button>
              <Link to="/admin/tours/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Thêm tour mới
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đặt chỗ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <Link to="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng tours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTours}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.monthlyGrowth}% tháng này
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Đặt chỗ gần đây</h2>
                  <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đặt chỗ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.tour}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(booking.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Tours & Quick Actions */}
          <div className="space-y-6">
            {/* Top Tours */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tour phổ biến</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topTours.map((tour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tour.name}</p>
                        <p className="text-xs text-gray-500">{tour.bookings} đặt chỗ</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(tour.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link to="/admin/tours" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Quản lý Tours</span>
                  </Link>
                  <Link to="/admin/bookings" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Quản lý Đặt chỗ</span>
                  </Link>
                  <Link to="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Quản lý Users</span>
                  </Link>
                  <Link to="/admin/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Báo cáo & Thống kê</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
