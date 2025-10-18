import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye,
  Edit,
  Download,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    // Simulate API call
    const loadBookings = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API call
      setTimeout(() => {
        setBookings([
          {
            id: 'BK001',
            bookingNumber: 'HNS-2024-001',
            customer: {
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@email.com',
              phone: '0901234567',
              address: '123 Nguyễn Huệ, Q1, TP.HCM'
            },
            tour: {
              id: 1,
              title: 'Tour Hạ Long 2N1Đ',
              image: '/hero/halong.jpg'
            },
            travelDate: '2024-02-15',
            passengers: {
              adults: 2,
              children: 1,
              infants: 0
            },
            totalPrice: 6800000,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'online',
            createdAt: '2024-01-10T10:30:00Z',
            updatedAt: '2024-01-10T11:00:00Z'
          },
          {
            id: 'BK002',
            bookingNumber: 'HNS-2024-002',
            customer: {
              name: 'Trần Thị B',
              email: 'tranthib@email.com',
              phone: '0902345678',
              address: '456 Lê Lợi, Q1, TP.HCM'
            },
            tour: {
              id: 2,
              title: 'Tour Sapa 3N2Đ',
              image: '/hero/sapa.jpg'
            },
            travelDate: '2024-02-20',
            passengers: {
              adults: 1,
              children: 0,
              infants: 0
            },
            totalPrice: 3200000,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'bank_transfer',
            createdAt: '2024-01-12T14:20:00Z',
            updatedAt: '2024-01-12T14:20:00Z'
          },
          {
            id: 'BK003',
            bookingNumber: 'HNS-2024-003',
            customer: {
              name: 'Lê Văn C',
              email: 'levanc@email.com',
              phone: '0903456789',
              address: '789 Pasteur, Q3, TP.HCM'
            },
            tour: {
              id: 3,
              title: 'Tour Hội An 2N1Đ',
              image: '/hero/hoian.jpg'
            },
            travelDate: '2024-02-25',
            passengers: {
              adults: 3,
              children: 2,
              infants: 1
            },
            totalPrice: 7200000,
            status: 'cancelled',
            paymentStatus: 'refunded',
            paymentMethod: 'online',
            createdAt: '2024-01-08T09:15:00Z',
            updatedAt: '2024-01-09T16:30:00Z'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadBookings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Đã xác nhận' },
      pending: { class: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Chờ xử lý' },
      cancelled: { class: 'bg-red-100 text-red-800', icon: XCircle, text: 'Đã hủy' },
      completed: { class: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Hoàn thành' }
    };

    const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: status };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: { class: 'bg-green-100 text-green-800', text: 'Đã thanh toán' },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Chờ thanh toán' },
      failed: { class: 'bg-red-100 text-red-800', text: 'Thanh toán thất bại' },
      refunded: { class: 'bg-gray-100 text-gray-800', text: 'Đã hoàn tiền' }
    };

    const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800', text: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesDate = filterDate === 'all' || 
      (filterDate === 'today' && formatDate(booking.travelDate) === formatDate(new Date().toISOString())) ||
      (filterDate === 'week' && new Date(booking.travelDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterDate === 'month' && new Date(booking.travelDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
        : booking
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách đặt chỗ...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Đặt chỗ</h1>
              <p className="text-gray-600">Quản lý và theo dõi tất cả đơn đặt tour</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đặt chỗ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xử lý</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>

              {/* Date Filter */}
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả ngày</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                Hiển thị {filteredBookings.length} / {bookings.length} đặt chỗ
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Ngày đi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số khách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.bookingNumber}</div>
                      <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {booking.customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {booking.customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={booking.tour.image}
                            alt={booking.tour.title}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{booking.tour.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(booking.travelDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Người lớn: {booking.passengers.adults}</div>
                        <div>Trẻ em: {booking.passengers.children}</div>
                        {booking.passengers.infants > 0 && (
                          <div>Em bé: {booking.passengers.infants}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {formatCurrency(booking.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            const newStatus = booking.status === 'pending' ? 'confirmed' : 
                                            booking.status === 'confirmed' ? 'completed' : 'pending';
                            handleStatusChange(booking.id, newStatus);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Cập nhật trạng thái"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đặt chỗ nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterDate !== 'all' 
                  ? 'Thử thay đổi bộ lọc để tìm đặt chỗ khác.' 
                  : 'Chưa có đơn đặt chỗ nào trong hệ thống.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
