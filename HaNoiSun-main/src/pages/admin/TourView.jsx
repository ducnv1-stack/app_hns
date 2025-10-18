import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminTourService } from '../../services/adminTourService';
import { tourService } from '../../services/tourService';
import { ArrowLeft, Edit, Save, X, Image as ImageIcon, Plus, Trash2, Eye } from 'lucide-react';
import { config } from '../../config/env';
import { TourDetailsForm, FlightDetailsForm, HotelDetailsForm, ComboDetailsForm } from '../../components/admin/ServiceTypeForms';

const statusOptions = [
  { key: 'ACTIVE', label: 'Hoạt động' },
  { key: 'INACTIVE', label: 'Tạm dừng' },
  { key: 'DRAFT', label: 'Nháp' },
];

const serviceTypeOptions = [
  { key: 'TOUR', label: 'Tour du lịch' },
  { key: 'HOTEL', label: 'Khách sạn' },
  { key: 'FLIGHT', label: 'Vé máy bay' },
  { key: 'COMBO', label: 'Combo' },
];

function parseItinerary(raw) {
  if (!raw) return [];
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(obj)) return obj;
    return [{ day: 1, title: 'Ngày 1', description: String(raw) }];
  } catch {
    return [{ day: 1, title: 'Ngày 1', description: String(raw) }];
  }
}

export default function TourView() {
  const { slugOrId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [tourData, setTourData] = useState(null);

  // Edit form states
  const [basic, setBasic] = useState({
    name: '',
    short_description: '',
    description: '',
    service_type: 'TOUR',
    status: 'ACTIVE',
  });

  const [typeDetails, setTypeDetails] = useState({});

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminTourService.getTourContent(slugOrId);
      setTourData(data);
      setBasic({
        name: data.name || '',
        short_description: data.short_description || '',
        description: data.description || '',
        service_type: data.service_type || 'TOUR',
        status: data.status || 'ACTIVE',
      });
      setTypeDetails(data.type_details || {});
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load tour content:', err);
      try {
        const pub = await tourService.getTourById(slugOrId);
        const t = pub?.data || pub;
        setTourData(t);
        setBasic((b) => ({
          ...b,
          name: t?.name || b.name,
          short_description: t?.short_description || b.short_description,
          description: t?.description || b.description,
          service_type: t?.service_type || b.service_type,
          status: t?.status || b.status,
        }));
      } catch (e) {
        setError('Không thể tải dữ liệu tour');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slugOrId]);

  const onSaveBasic = async () => {
    try {
      setError('');
      await adminTourService.updateBasic(slugOrId, basic);
      await load();
      alert('Đã lưu thông tin cơ bản');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Lưu thất bại');
    }
  };

  const onSaveTypeDetails = async () => {
    try {
      setError('');
      await adminTourService.updateTypeDetails(slugOrId, basic.service_type, typeDetails);
      await load();
      alert('Đã lưu thông tin chi tiết');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Lưu thất bại');
    }
  };

  const onUploadImages = async (evt) => {
    const files = evt.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      const added = await adminTourService.uploadImages(slugOrId, files);
      setImages((prev) => [...prev, ...added]);
      evt.target.value = '';
    } catch (e) {
      setError(e.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const onDeleteImage = async (imageId) => {
    if (!confirm('Xóa ảnh này?')) return;
    try {
      await adminTourService.deleteImage(slugOrId, imageId);
      setImages((prev) => prev.filter((i) => i.id !== imageId));
    } catch (e) {
      setError(e.message || 'Xóa ảnh thất bại');
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getStatusLabel = (status) => {
    const map = { ACTIVE: 'Hoạt động', INACTIVE: 'Tạm dừng', DRAFT: 'Nháp' };
    return map[status] || status;
  };

  const getServiceTypeLabel = (type) => {
    const map = { TOUR: 'Tour du lịch', HOTEL: 'Khách sạn', FLIGHT: 'Vé máy bay', COMBO: 'Combo' };
    return map[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">{editMode ? 'Chỉnh sửa Tour' : 'Xem Tour'}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">ID: {slugOrId}</div>
            <Link to={`/admin/tours/${slugOrId}/edit`} className="btn-primary inline-flex items-center">
              <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (<div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>)}

        {!editMode ? (
          /* VIEW MODE */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
                <div className="space-y-3">
                  <div><span className="font-medium">Tên:</span> {tourData?.name || basic.name}</div>
                  <div><span className="font-medium">Loại hình:</span> {getServiceTypeLabel(tourData?.service_type || basic.service_type)}</div>
                  <div><span className="font-medium">Trạng thái:</span> <span className={`px-2 py-1 rounded text-sm ${tourData?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{getStatusLabel(tourData?.status || basic.status)}</span></div>
                  <div><span className="font-medium">Mô tả ngắn:</span><div className="text-gray-700 mt-1">{tourData?.short_description || basic.short_description}</div></div>
                  <div><span className="font-medium">Giới thiệu:</span><div className="text-gray-700 mt-1 whitespace-pre-wrap">{tourData?.description || basic.description}</div></div>
                </div>
              </section>

              {/* Type-specific details VIEW */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>
                {tourData?.service_type === 'TOUR' && tourData?.type_details && (
                  <div className="space-y-2">
                    <div><span className="font-medium">Số ngày:</span> {tourData.type_details.duration_days}</div>
                    <div><span className="font-medium">Quốc gia:</span> {tourData.type_details.country}</div>
                    <div><span className="font-medium">Số người:</span> {tourData.type_details.min_participants} - {tourData.type_details.max_participants}</div>
                  </div>
                )}
                {tourData?.service_type === 'FLIGHT' && tourData?.type_details && (
                  <div className="space-y-2">
                    <div><span className="font-medium">Hãng:</span> {tourData.type_details.airline}</div>
                    <div><span className="font-medium">Số hiệu:</span> {tourData.type_details.flight_number}</div>
                    <div><span className="font-medium">Từ:</span> {tourData.type_details.departure_airport} → {tourData.type_details.arrival_airport}</div>
                    <div><span className="font-medium">Giờ:</span> {tourData.type_details.departure_time} - {tourData.type_details.arrival_time}</div>
                    <div><span className="font-medium">Hạng ghế:</span> {tourData.type_details.seat_class}</div>
                  </div>
                )}
                {tourData?.service_type === 'HOTEL' && tourData?.type_details && (
                  <div className="space-y-2">
                    <div><span className="font-medium">Khách sạn:</span> {tourData.type_details.hotel_name}</div>
                    <div><span className="font-medium">Địa chỉ:</span> {tourData.type_details.hotel_address}</div>
                    <div><span className="font-medium">Hạng sao:</span> {tourData.type_details.star_rating} ⭐</div>
                    <div><span className="font-medium">Loại phòng:</span> {tourData.type_details.room_type}</div>
                    <div><span className="font-medium">Diện tích:</span> {tourData.type_details.room_size}m²</div>
                  </div>
                )}
                {tourData?.service_type === 'COMBO' && tourData?.type_details && (
                  <div className="space-y-2">
                    <div><span className="font-medium">Bao gồm:</span>
                      <div className="ml-4 mt-1">
                        {tourData.type_details.includes_tour && <div>✓ Tour du lịch</div>}
                        {tourData.type_details.includes_hotel && <div>✓ Khách sạn</div>}
                        {tourData.type_details.includes_flight && <div>✓ Vé máy bay</div>}
                      </div>
                    </div>
                    {tourData.type_details.combo_description && (
                      <div><span className="font-medium">Mô tả:</span><div className="text-gray-700 mt-1">{tourData.type_details.combo_description}</div></div>
                    )}
                  </div>
                )}
                {!tourData?.type_details && (
                  <div className="text-gray-500">Chưa có thông tin chi tiết</div>
                )}
              </section>

              {/* Variants */}
              {tourData?.variants && tourData.variants.length > 0 && (
                <section className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Giá & Loại vé</h2>
                  <div className="space-y-2">
                    {tourData.variants.map((v) => (
                      <div key={v.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{v.variant_name || 'Loại vé'}</div>
                          <div className="text-sm text-gray-500">{v.description || ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary-600">{formatCurrency(v.price)}</div>
                          <div className="text-xs text-gray-500">Còn lại: {v.available_quantity || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Images */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Ảnh tour</h2>
                {images.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    Chưa có ảnh
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative border rounded overflow-hidden">
                        <img
                          src={(img.image_url || '').startsWith('http') ? img.image_url : `${config.API_BASE_URL.replace(/\/api$/, '')}${img.image_url}`}
                          alt="tour"
                          className="w-full h-32 object-cover"
                        />
                        {img.is_primary && (
                          <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-1 rounded">Chính</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Stats */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Thống kê</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạo lúc:</span>
                    <span className="font-medium">{tourData?.created_at ? new Date(tourData.created_at).toLocaleDateString('vi-VN') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cập nhật:</span>
                    <span className="font-medium">{tourData?.updated_at ? new Date(tourData.updated_at).toLocaleDateString('vi-VN') : '-'}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic info form */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Tên tour</label>
                    <input className="w-full border rounded px-3 py-2" value={basic.name} onChange={e => setBasic({ ...basic, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Loại hình</label>
                    <select className="w-full border rounded px-3 py-2" value={basic.service_type} onChange={e => setBasic({ ...basic, service_type: e.target.value })}>
                      {serviceTypeOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Trạng thái</label>
                    <select className="w-full border rounded px-3 py-2" value={basic.status} onChange={e => setBasic({ ...basic, status: e.target.value })}>
                      {statusOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                    <textarea rows={2} className="w-full border rounded px-3 py-2" value={basic.short_description} onChange={e => setBasic({ ...basic, short_description: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Giới thiệu / Mô tả</label>
                    <textarea rows={6} className="w-full border rounded px-3 py-2" value={basic.description} onChange={e => setBasic({ ...basic, description: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={onSaveBasic} className="btn-primary inline-flex items-center"><Save className="h-4 w-4 mr-2" />Lưu thông tin</button>
                </div>
              </section>

              {/* Type-specific details */}
              <section className="bg-white rounded-lg shadow p-6">
                {basic.service_type === 'TOUR' && (
                  <TourDetailsForm details={typeDetails} onChange={setTypeDetails} />
                )}
                {basic.service_type === 'FLIGHT' && (
                  <FlightDetailsForm details={typeDetails} onChange={setTypeDetails} />
                )}
                {basic.service_type === 'HOTEL' && (
                  <HotelDetailsForm details={typeDetails} onChange={setTypeDetails} />
                )}
                {basic.service_type === 'COMBO' && (
                  <ComboDetailsForm details={typeDetails} onChange={setTypeDetails} />
                )}
                <div className="mt-6 flex justify-end">
                  <button onClick={onSaveTypeDetails} className="btn-primary inline-flex items-center">
                    <Save className="h-4 w-4 mr-2" />Lưu thông tin chi tiết
                  </button>
                </div>
              </section>
            </div>

            {/* Sidebar edit */}
            <div className="space-y-6">
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Ảnh tour</h2>
                <div className="mb-4">
                  <input type="file" multiple accept="image/*" onChange={onUploadImages} disabled={uploading} className="text-sm" />
                  {uploading && <div className="text-sm text-gray-500 mt-2">Đang tải ảnh...</div>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group border rounded overflow-hidden">
                      <img src={(img.image_url || '').startsWith('http') ? img.image_url : `${config.API_BASE_URL.replace(/\/api$/, '')}${img.image_url}`}
                        alt="tour" className="w-full h-32 object-cover" />
                      <button onClick={() => onDeleteImage(img.id)} className="absolute top-2 right-2 bg-white/90 text-red-600 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">Xóa</button>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 text-sm py-8">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />Chưa có ảnh
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
