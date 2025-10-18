import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera, Shield, CreditCard } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: user?.name || 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: null
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isPrimary: true
    },
    {
      id: 2,
      type: 'office',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      isPrimary: false
    }
  ]);

  const handleSave = () => {
    // TODO: Save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: User },
    { id: 'addresses', name: 'Địa chỉ', icon: MapPin },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={user?.roles?.includes('admin') ? "/admin/dashboard" : "/dashboard"} 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                ← Quay lại Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            </div>
            <button 
              onClick={logout}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
                    {profileData.fullName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-3">{profileData.fullName}</h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center space-x-2 btn-secondary"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center space-x-2 btn-primary"
                      >
                        <Save className="h-4 w-4" />
                        <span>Lưu</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Hủy</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{profileData.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{profileData.phone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profileData.gender === 'male' ? 'Nam' : profileData.gender === 'female' ? 'Nữ' : 'Khác'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <p className="text-gray-900">{profileData.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Địa chỉ của tôi</h2>
                  <button className="btn-primary">
                    Thêm địa chỉ mới
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              address.type === 'home' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {address.type === 'home' ? 'Nhà riêng' : 'Văn phòng'}
                            </span>
                            {address.isPrimary && (
                              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900">{address.address}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-primary-600 hover:text-primary-700 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bảo mật tài khoản</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button className="btn-primary">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác thực hai lớp</h3>
                    <p className="text-gray-600 mb-4">Bảo vệ tài khoản của bạn bằng xác thực hai lớp</p>
                    <button className="btn-secondary">
                      Bật xác thực hai lớp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
                  <button className="btn-primary">
                    Thêm thẻ mới
                  </button>
                </div>

                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có thẻ thanh toán</h3>
                  <p className="text-gray-600 mb-6">Thêm thẻ để thanh toán nhanh chóng và tiện lợi</p>
                  <button className="btn-primary">
                    Thêm thẻ đầu tiên
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
