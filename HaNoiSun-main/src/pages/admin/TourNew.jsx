import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import { adminTourService } from '../../services/adminTourService';

const serviceTypeOptions = [
  { key: 'TOUR', label: 'Tour du lịch' },
  { key: 'HOTEL', label: 'Khách sạn' },
  { key: 'FLIGHT', label: 'Vé máy bay' },
  { key: 'COMBO', label: 'Combo' },
];

const statusOptions = [
  { key: 'ACTIVE', label: 'Hoạt động' },
  { key: 'INACTIVE', label: 'Tạm dừng' },
  { key: 'DRAFT', label: 'Nháp' },
];

const TourNew = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Basic info
  const [basic, setBasic] = useState({
    name: '',
    short_description: '',
    description: '',
    service_type: 'TOUR',
    status: 'DRAFT',
    duration_days: 1,
    country: 'Việt Nam',
    min_participants: 1,
    max_participants: 25,
  });

  // Dates
  const [dates, setDates] = useState({
    departure_date: '',
    return_date: '',
  });

  // Itinerary
  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '' }
  ]);

  // Images
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addDay = () => {
    setItinerary(prev => [
      ...prev,
      { day: prev.length + 1, title: '', description: '' }
    ]);
  };

  const removeDay = (idx) => {
    setItinerary(prev => prev.filter((_, i) => i !== idx));
  };

  const updateDay = (idx, field, value) => {
    setItinerary(prev => prev.map((item, i) => 
      i === idx ? { ...item, [field]: value } : item
    ));
  };

  const onUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Preview images locally before saving
      const previews = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      }));
      
      setImages(prev => [...prev, ...previews]);
      setSuccess('Ảnh đã được thêm. Lưu tour để upload ảnh lên server.');
    } catch (err) {
      setError('Thêm ảnh thất bại: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate
      if (!basic.name.trim()) {
        setError('Vui lòng nhập tên tour');
        return;
      }

      // Prepare data
      const tourData = {
        ...basic,
        departure_date: dates.departure_date || null,
        return_date: dates.return_date || null,
        itinerary: JSON.stringify(itinerary),
      };

      // Create tour
      const result = await adminTourService.createTour(tourData);
      
      if (!result.success) {
        throw new Error(result.error || 'Tạo tour thất bại');
      }

      const tourId = result.data.id;

      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('images', images[i].file);
          
          await adminTourService.uploadImages(tourId, formData);
        }
      }

      setSuccess('Tạo tour thành công!');
      
      // Redirect to tour edit page after 1.5s
      setTimeout(() => {
        navigate(`/admin/tours/${tourId}/edit`);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Lưu tour thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">Thêm Tour Mới</h1>
          </div>
          <button 
            onClick={onSave} 
            disabled={saving}
            className="btn-primary inline-flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu tour'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Basic Info */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tên tour *</label>
                <input 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.name} 
                  onChange={e => setBasic({...basic, name: e.target.value})} 
                  placeholder="Ví dụ: Đà Lạt - Nha Trang 4N3Đ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại hình</label>
                <select 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.service_type} 
                  onChange={e => setBasic({...basic, service_type: e.target.value})}
                >
                  {serviceTypeOptions.map(o => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <select 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.status} 
                  onChange={e => setBasic({...basic, status: e.target.value})}
                >
                  {statusOptions.map(o => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số ngày</label>
                <input 
                  type="number" 
                  min={1} 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.duration_days} 
                  onChange={e => setBasic({...basic, duration_days: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quốc gia</label>
                <input 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.country} 
                  onChange={e => setBasic({...basic, country: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số người tối thiểu</label>
                <input 
                  type="number" 
                  min={1} 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.min_participants} 
                  onChange={e => setBasic({...basic, min_participants: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số người tối đa</label>
                <input 
                  type="number" 
                  min={1} 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.max_participants} 
                  onChange={e => setBasic({...basic, max_participants: Number(e.target.value)})} 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                <textarea 
                  rows={2} 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.short_description} 
                  onChange={e => setBasic({...basic, short_description: e.target.value})} 
                  placeholder="Mô tả ngắn gọn về tour"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Giới thiệu / Mô tả chi tiết</label>
                <textarea 
                  rows={6} 
                  className="w-full border rounded px-3 py-2" 
                  value={basic.description} 
                  onChange={e => setBasic({...basic, description: e.target.value})} 
                  placeholder="Mô tả chi tiết về tour, điểm đến, hoạt động..."
                />
              </div>
            </div>
          </section>

          {/* Dates */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Ngày đi và ngày về
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày đi</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2" 
                  value={dates.departure_date} 
                  onChange={e => setDates({...dates, departure_date: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày về</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2" 
                  value={dates.return_date} 
                  onChange={e => setDates({...dates, return_date: e.target.value})} 
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Có thể để trống nếu chưa xác định ngày cụ thể
            </p>
          </section>

          {/* Itinerary */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Lịch trình chi tiết</h2>
              <button 
                onClick={addDay} 
                className="btn-secondary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm ngày
              </button>
            </div>
            <div className="space-y-4">
              {itinerary.map((day, idx) => (
                <div key={idx} className="border rounded p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Ngày {day.day}</h3>
                    {itinerary.length > 1 && (
                      <button 
                        onClick={() => removeDay(idx)} 
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                      <input 
                        className="w-full border rounded px-3 py-2" 
                        placeholder="Ví dụ: Khởi hành - Tham quan Đà Lạt" 
                        value={day.title} 
                        onChange={e => updateDay(idx, 'title', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả</label>
                      <textarea 
                        rows={4} 
                        className="w-full border rounded px-3 py-2" 
                        placeholder="Mô tả chi tiết hoạt động trong ngày..." 
                        value={day.description} 
                        onChange={e => updateDay(idx, 'description', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              ))}
              {itinerary.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-8">
                  Chưa có lịch trình. Nhấn "Thêm ngày" để bắt đầu.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Images & Preview */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ảnh tour</h2>
            <div className="mb-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={onUploadImages} 
                disabled={uploading} 
                className="w-full"
              />
              {uploading && (
                <div className="text-sm text-gray-500 mt-2">Đang thêm ảnh...</div>
              )}
            </div>
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group border rounded overflow-hidden">
                    <img 
                      src={img.preview} 
                      alt={img.name} 
                      className="w-full h-32 object-cover"
                    />
                    <button 
                      onClick={() => removeImage(idx)} 
                      className="absolute top-2 right-2 bg-white/90 text-red-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {images.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400"/>
                <p>Chưa có ảnh nào</p>
                <p className="text-xs mt-1">Chọn file để thêm ảnh</p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Xem nhanh</h2>
            <div className="text-sm text-gray-700">
              <div className="font-semibold text-base mb-1">{basic.name || 'Tên tour'}</div>
              <div className="mb-2 text-gray-600">{basic.short_description || 'Mô tả ngắn'}</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Loại: {serviceTypeOptions.find(o => o.key === basic.service_type)?.label}</div>
                <div>Thời gian: {basic.duration_days} ngày</div>
                <div>Quốc gia: {basic.country}</div>
                <div>Số người: {basic.min_participants}-{basic.max_participants}</div>
                {dates.departure_date && (
                  <div>Ngày đi: {new Date(dates.departure_date).toLocaleDateString('vi-VN')}</div>
                )}
                {dates.return_date && (
                  <div>Ngày về: {new Date(dates.return_date).toLocaleDateString('vi-VN')}</div>
                )}
                <div>Lịch trình: {itinerary.length} ngày</div>
                <div>Ảnh: {images.length} ảnh</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TourNew;
