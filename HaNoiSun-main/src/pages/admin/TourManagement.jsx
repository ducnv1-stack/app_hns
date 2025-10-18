import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-react';
import { adminTourService } from '../../services/adminTourService';

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTours, setSelectedTours] = useState([]);

  useEffect(() => {
    // Load tours from backend admin API
    const loadTours = async () => {
      try {
        setLoading(true);
        setError('');
        const { tours } = await adminTourService.getTours({ page: 1, limit: 50 });
        setTours(tours);
      } catch (err) {
        console.error('Failed to fetch admin tours:', err);
        setError(err?.message || 'Không thể tải danh sách tours');
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'active' ? 'Hoạt động' : 
         status === 'inactive' ? 'Tạm dừng' : 'Nháp'}
      </span>
    );
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectTour = (tourId) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map(tour => tour.id));
    }
  };

  const handleDeleteTours = () => {
    if (selectedTours.length === 0) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedTours.length} tour đã chọn?`)) {
      setTours(prev => prev.filter(tour => !selectedTours.includes(tour.id)));
      setSelectedTours([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Thử lại</button>
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tours</h1>
              <p className="text-gray-600">Quản lý danh sách tours và dịch vụ</p>
            </div>
            <div className="flex items-center space-x-4">
              {selectedTours.length > 0 && (
                <button 
                  onClick={handleDeleteTours}
                  className="btn-danger"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa ({selectedTours.length})
                </button>
              )}
              <Link to="/admin/tours/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Thêm tour mới
              </Link>
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
                  placeholder="Tìm kiếm tour..."
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
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="draft">Nháp</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Trong nước">Trong nước</option>
                <option value="Nước ngoài">Nước ngoài</option>
                <option value="Combo">Combo</option>
              </select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                Hiển thị {filteredTours.length} / {tours.length} tours
              </div>
            </div>
          </div>
        </div>

        {/* Tours Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đặt chỗ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTours.includes(tour.id)}
                        onChange={() => handleSelectTour(tour.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={tour.image}
                            alt={tour.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {tour.country}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {tour.duration}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tour.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{formatCurrency(tour.price.adult)}</div>
                        <div className="text-gray-500 text-xs">Người lớn</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {tour.bookings}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {formatCurrency(tour.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tour.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/tours/${tour.slug || tour.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Xem & Chỉnh sửa"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa tour này?')) {
                              setTours(prev => prev.filter(t => t.id !== tour.id));
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tour nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                  ? 'Thử thay đổi bộ lọc để tìm tour khác.' 
                  : 'Bắt đầu bằng cách tạo tour mới.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
                <div className="mt-6">
                  <Link to="/admin/tours/new" className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tour mới
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourManagement;
