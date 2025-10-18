import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';
import { bookingModificationService } from '../services/bookingModificationService';
import { useAuth } from '../context/AuthContext';

const BookingModificationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState(null);
  const [modificationOptions, setModificationOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modification states
  const [modifications, setModifications] = useState({
    date: null,
    passengers: null,
    contactInfo: null,
    specialRequests: ''
  });
  
  const [fees, setFees] = useState(null);
  const [showFees, setShowFees] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API calls
        setTimeout(() => {
          setBookingData({
            id: bookingId,
            bookingNumber: 'HNS-2024-001',
            tourTitle: 'Tour Hạ Long 2N1Đ',
            travelDate: '2024-02-15',
            passengers: {
              adults: 2,
              children: 1,
              infants: 0
            },
            contactInfo: {
              fullName: 'Nguyễn Văn A',
              email: 'nguyenvana@email.com',
              phone: '0901234567',
              address: '123 Nguyễn Huệ, Q1, TP.HCM'
            },
            totalPrice: 6800000,
            status: 'confirmed',
            specialRequests: '',
            createdAt: '2024-01-10T10:30:00Z'
          });

          setModificationOptions({
            canModifyDate: true,
            canModifyPassengers: true,
            canModifyContact: true,
            canAddSpecialRequests: true,
            modificationDeadline: '2024-02-10T23:59:59Z',
            fees: {
              dateChange: 200000,
              passengerChange: 100000,
              contactChange: 0
            }
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading booking data:', error);
        setError('Không thể tải thông tin đặt chỗ');
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId]);

  const handleModificationChange = (type, value) => {
    setModifications(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Calculate fees when changes are made
    if (type === 'date' && value !== bookingData.travelDate) {
      setFees(prev => ({
        ...prev,
        dateChange: modificationOptions.fees.dateChange
      }));
    } else if (type === 'passengers' && JSON.stringify(value) !== JSON.stringify(bookingData.passengers)) {
      setFees(prev => ({
        ...prev,
        passengerChange: modificationOptions.fees.passengerChange
      }));
    }
  };

  const calculateTotalFees = () => {
    if (!fees) return 0;
    return Object.values(fees).reduce((total, fee) => total + (fee || 0), 0);
  };

  const handleSaveModifications = async () => {
    if (!user) {
      setError('Vui lòng đăng nhập để thực hiện thay đổi');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const changes = [];
      
      // Check for date changes
      if (modifications.date && modifications.date !== bookingData.travelDate) {
        changes.push({
          type: 'date',
          oldValue: bookingData.travelDate,
          newValue: modifications.date
        });
      }

      // Check for passenger changes
      if (modifications.passengers && JSON.stringify(modifications.passengers) !== JSON.stringify(bookingData.passengers)) {
        changes.push({
          type: 'passengers',
          oldValue: bookingData.passengers,
          newValue: modifications.passengers
        });
      }

      // Check for contact changes
      if (modifications.contactInfo && JSON.stringify(modifications.contactInfo) !== JSON.stringify(bookingData.contactInfo)) {
        changes.push({
          type: 'contact',
          oldValue: bookingData.contactInfo,
          newValue: modifications.contactInfo
        });
      }

      if (changes.length === 0) {
        setError('Không có thay đổi nào được thực hiện');
        setSaving(false);
        return;
      }

      // Process each change
      for (const change of changes) {
        switch (change.type) {
          case 'date':
            await bookingModificationService.modifyBookingDate(
              bookingId, 
              change.newValue, 
              'Khách hàng yêu cầu thay đổi ngày đi'
            );
            break;
          case 'passengers':
            await bookingModificationService.modifyPassengers(
              bookingId, 
              change.newValue, 
              'Khách hàng yêu cầu thay đổi số lượng khách'
            );
            break;
          case 'contact':
            await bookingModificationService.modifyContactInfo(
              bookingId, 
              change.newValue, 
              'Khách hàng yêu cầu thay đổi thông tin liên hệ'
            );
            break;
        }
      }

      // Add special requests if changed
      if (modifications.specialRequests !== bookingData.specialRequests) {
        await bookingModificationService.addSpecialRequests(bookingId, modifications.specialRequests);
      }

      setSuccess('Thay đổi đã được lưu thành công!');
      
      // Redirect to booking details after 2 seconds
      setTimeout(() => {
        navigate(`/my-bookings/${bookingId}`);
      }, 2000);

    } catch (error) {
      console.error('Error saving modifications:', error);
      setError('Có lỗi xảy ra khi lưu thay đổi. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đặt chỗ...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy đặt chỗ</h2>
          <p className="mt-2 text-gray-600">Đặt chỗ này không tồn tại hoặc bạn không có quyền truy cập.</p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-4 btn-primary"
          >
            Quay lại danh sách đặt chỗ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sửa đổi đặt chỗ</h1>
          <p className="text-gray-600 mt-2">Mã đặt chỗ: {bookingData.bookingNumber}</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modification Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin hiện tại</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Tour Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{bookingData.tourTitle}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ngày đi: {formatDate(bookingData.travelDate)}
                  </div>
                </div>

                {/* Date Modification */}
                {modificationOptions.canModifyDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thay đổi ngày đi
                    </label>
                    <input
                      type="date"
                      value={modifications.date || bookingData.travelDate}
                      onChange={(e) => handleModificationChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {modifications.date && modifications.date !== bookingData.travelDate && (
                      <p className="text-sm text-yellow-600 mt-1">
                        Phí thay đổi: {formatCurrency(modificationOptions.fees.dateChange)}
                      </p>
                    )}
                  </div>
                )}

                {/* Passenger Modification */}
                {modificationOptions.canModifyPassengers && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng khách
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Người lớn</label>
                        <input
                          type="number"
                          min="0"
                          value={modifications.passengers?.adults ?? bookingData.passengers.adults}
                          onChange={(e) => handleModificationChange('passengers', {
                            ...bookingData.passengers,
                            adults: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Trẻ em</label>
                        <input
                          type="number"
                          min="0"
                          value={modifications.passengers?.children ?? bookingData.passengers.children}
                          onChange={(e) => handleModificationChange('passengers', {
                            ...bookingData.passengers,
                            children: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Em bé</label>
                        <input
                          type="number"
                          min="0"
                          value={modifications.passengers?.infants ?? bookingData.passengers.infants}
                          onChange={(e) => handleModificationChange('passengers', {
                            ...bookingData.passengers,
                            infants: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Info Modification */}
                {modificationOptions.canModifyContact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thông tin liên hệ
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        value={modifications.contactInfo?.fullName ?? bookingData.contactInfo.fullName}
                        onChange={(e) => handleModificationChange('contactInfo', {
                          ...bookingData.contactInfo,
                          fullName: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={modifications.contactInfo?.email ?? bookingData.contactInfo.email}
                        onChange={(e) => handleModificationChange('contactInfo', {
                          ...bookingData.contactInfo,
                          email: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={modifications.contactInfo?.phone ?? bookingData.contactInfo.phone}
                        onChange={(e) => handleModificationChange('contactInfo', {
                          ...bookingData.contactInfo,
                          phone: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {modificationOptions.canAddSpecialRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập yêu cầu đặc biệt của bạn..."
                      value={modifications.specialRequests || bookingData.specialRequests}
                      onChange={(e) => handleModificationChange('specialRequests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tóm tắt</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền gốc</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(bookingData.totalPrice)}
                    </p>
                  </div>

                  {calculateTotalFees() > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600">Phí thay đổi</p>
                      <p className="text-lg font-semibold text-yellow-600">
                        +{formatCurrency(calculateTotalFees())}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Tổng cộng</p>
                    <p className="text-xl font-bold text-primary-600">
                      {formatCurrency(bookingData.totalPrice + calculateTotalFees())}
                    </p>
                  </div>
                </div>

                {/* Modification Deadline */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      Hạn chót sửa đổi: {formatDate(modificationOptions.modificationDeadline)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSaveModifications}
                    disabled={saving}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/my-bookings/${bookingId}`)}
                    className="w-full btn-outline"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModificationPage;
