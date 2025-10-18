import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Settings, LogOut } from 'lucide-react';
import { tours } from '../data/tours';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Quản trị viên</div>
            <div className="text-xl font-bold text-gray-900">Xin chào {user?.name || 'Admin'}</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-primary-600">Trang chủ</Link>
            <button onClick={logout} className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-sm text-gray-500">Tổng số tour</div>
            <div className="text-3xl font-bold">{tours.length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-sm text-gray-500">Tour đang khuyến mãi</div>
            <div className="text-3xl font-bold">{tours.filter(t => t.isOnSale).length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-sm text-gray-500">Tour nổi bật</div>
            <div className="text-3xl font-bold">{tours.filter(t => t.isPopular).length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow">
          <div className="p-6 flex items-center justify-between">
            <div className="font-semibold">Quản lý Tours</div>
            <button className="inline-flex items-center gap-2 btn-primary">
              <Plus className="h-4 w-4" />
              Thêm tour
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 border-t border-b">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đến</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thời lượng</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {tours.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.title}</td>
                    <td className="px-6 py-4 text-gray-700">{t.location}</td>
                    <td className="px-6 py-4 text-gray-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}</td>
                    <td className="px-6 py-4 text-gray-700">{t.duration}</td>
                    <td className="px-6 py-4 text-gray-700">{t.isOnSale ? 'Giảm giá' : t.isPopular ? 'Nổi bật' : 'Bình thường'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4" />
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;




