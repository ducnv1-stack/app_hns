import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminTourService } from '../../services/adminTourService';
import { tourService } from '../../services/tourService';
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Plane, Hotel as HotelIcon, Map } from 'lucide-react';
import TourInfoSection from './components/TourInfoSection';
import HotelInfoSection from './components/HotelInfoSection';
import FlightInfoSection from './components/FlightInfoSection';
import { config } from '../../config/env';

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
    // fallback from text to single day
    return [{ day: 1, title: 'Ngày 1', description: String(raw) }];
  } catch {
    return [{ day: 1, title: 'Ngày 1', description: String(raw) }];
  }
}

export default function TourEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Basic & Details
  const [basic, setBasic] = useState({
    name: '',
    short_description: '',
    description: '',
    service_type: 'TOUR',
    status: 'ACTIVE',
    duration_days: 1,
    country: 'Việt Nam',
    min_participants: 1,
    max_participants: 25,
  });

  // Itinerary
  const [itinerary, setItinerary] = useState([]);

  // Hotel data
  const [hotelData, setHotelData] = useState({
    hotel_name: '',
    hotel_address: '',
    star_rating: 3,
    room_types: '',
    bed_types: '',
    room_area: '',
    max_occupancy: 2,
    check_in_time: '14:00',
    check_out_time: '12:00',
    amenities: []
  });

  // Flight data
  const [flightData, setFlightData] = useState({
    airline: '',
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_time: '',
    arrival_time: '',
    aircraft_type: '',
    baggage_allowance: '23kg',
    cabin_class: 'ECONOMY'
  });

  // Images
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset index khi images thay đổi
  useEffect(() => {
    if (currentImageIndex >= images.length && images.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [images, currentImageIndex]);

  // Auto slideshow - chuyển ảnh mỗi 3 giây
  useEffect(() => {
    if (images.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }

    console.log('🎬 Starting slideshow with', images.length, 'images');
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % images.length;
        console.log('📸 Slideshow: changing from', prev, 'to', next);
        return next;
      });
    }, 3000); // 3 giây

    return () => {
      console.log('🛑 Stopping slideshow');
      clearInterval(interval);
    };
  }, [images]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminTourService.getTourContent(id);
      setBasic({
        name: data.name || '',
        short_description: data.short_description || '',
        description: data.description || '',
        service_type: data.service_type || 'TOUR',
        status: data.status || 'ACTIVE',
        duration_days: data.duration_days || 1,
        country: data.country || 'Việt Nam',
        min_participants: data.min_participants || 1,
        max_participants: data.max_participants || 25,
      });
      setItinerary(parseItinerary(data.itinerary));
      
      // Load hotel data
      setHotelData({
        hotel_name: data.hotel_name || '',
        hotel_address: data.hotel_address || '',
        star_rating: data.star_rating || 3,
        room_types: data.room_types || '',
        bed_types: data.bed_types || '',
        room_area: data.room_area || '',
        max_occupancy: data.max_occupancy || 2,
        check_in_time: data.check_in_time || '14:00',
        check_out_time: data.check_out_time || '12:00',
        amenities: data.amenities ? (typeof data.amenities === 'string' ? JSON.parse(data.amenities) : data.amenities) : []
      });
      
      // Load flight data
      setFlightData({
        airline: data.airline || '',
        flight_number: data.flight_number || '',
        departure_airport: data.departure_airport || '',
        arrival_airport: data.arrival_airport || '',
        departure_time: data.departure_time || '',
        arrival_time: data.arrival_time || '',
        aircraft_type: data.aircraft_type || '',
        baggage_allowance: data.baggage_allowance || '23kg',
        cabin_class: data.cabin_class || 'ECONOMY'
      });
      
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load tour content (admin endpoint):', err);
      // last resort: show read-only from public API
      try {
        const pub = await tourService.getTourById(id);
        const t = pub?.data || pub;
        setBasic((b) => ({
          ...b,
          name: t?.name || b.name,
          short_description: t?.short_description || b.short_description,
          description: t?.description || b.description,
          service_type: t?.service_type || b.service_type,
          status: t?.status || b.status,
          duration_days: t?.duration_days || b.duration_days,
          country: t?.country || b.country,
        }));
      } catch (e) {
        setError('Không thể tải dữ liệu tour');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const onSaveAll = async () => {
    try {
      setError('');
      
      // Merge all data
      const updateData = {
        ...basic,
        ...hotelData,
        ...flightData,
        itinerary: itinerary.length > 0 ? itinerary : undefined
      };
      
      // Use Tour.update() which supports multi-table
      await adminTourService.updateBasic(id, updateData);
      await load();
      alert('Đã lưu tất cả thông tin');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Lưu thất bại');
    }
  };

  const onSaveBasic = async () => {
    try {
      setError('');
      await adminTourService.updateBasic(id, basic);
      await load();
      alert('Đã lưu thông tin cơ bản');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Lưu thất bại');
    }
  };

  const onSaveItinerary = async () => {
    try {
      setError('');
      // normalize days
      const days = itinerary.map((d, i) => ({
        day: d.day || i + 1,
        title: d.title || `Ngày ${i + 1}`,
        description: d.description || '',
      }));
      await adminTourService.updateItinerary(id, days);
      alert('Đã lưu lịch trình');
    } catch (e) {
      setError(e.message || 'Lưu lịch trình thất bại');
    }
  };

  const onUploadImages = async (evt) => {
    const files = evt.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      const added = await adminTourService.uploadImages(id, files);
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
      await adminTourService.deleteImage(id, imageId);
      setImages((prev) => prev.filter((i) => i.id !== imageId));
    } catch (e) {
      setError(e.message || 'Xóa ảnh thất bại');
    }
  };

  const addDay = () => {
    setItinerary((prev) => [...prev, { day: (prev[prev.length - 1]?.day || prev.length) + 1, title: '', description: '' }]);
  };

  const removeDay = (idx) => {
    setItinerary((prev) => prev.filter((_, i) => i !== idx));
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
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">Chỉnh sửa Tour</h1>
            <span className="text-sm text-gray-500">ID: {id}</span>
          </div>
          <button 
            onClick={onSaveAll} 
            className="btn-primary inline-flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu tất cả
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Section 1: Tour Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Tour</h2>
          </div>
          <TourInfoSection 
            data={{
              ...basic,
              itinerary: itinerary,
              departure_date: basic.departure_date || '',
              return_date: basic.return_date || ''
            }} 
            onChange={(newData) => {
              const { itinerary: newItinerary, ...restData } = newData;
              setBasic(restData);
              if (newItinerary) setItinerary(newItinerary);
            }} 
          />
        </div>

        {/* Section 2: Hotel Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <HotelIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Khách sạn</h2>
          </div>
          <HotelInfoSection data={hotelData} onChange={setHotelData} />
        </div>

        {/* Section 3: Flight Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Plane className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Vé máy bay</h2>
          </div>
          <FlightInfoSection data={flightData} onChange={setFlightData} />
        </div>

        {/* Section 4: Images */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ImageIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Ảnh Tour</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={onUploadImages} 
                disabled={uploading} 
                className="w-full"
              />
              {uploading && <div className="text-sm text-gray-500 mt-2">Đang tải ảnh...</div>}
            </div>
            <p className="text-sm text-gray-500">
              * Upload ảnh cho tour. Khi có nhiều ảnh sẽ tự động chuyển slideshow.
            </p>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={onSaveAll} 
            className="btn-primary inline-flex items-center px-8 py-3 text-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Lưu tất cả thông tin
          </button>
        </div>
      </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDeleteImage(images[currentImageIndex]?.id)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Xóa ảnh này
            </button>
          </div>

          {/* Thumbnails - Dots indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex 
                      ? 'bg-primary-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400"/>
          <p>Chưa có ảnh nào được chọn</p>
          <p className="text-xs mt-1">Khi upload nhiều ảnh, sẽ tự động chuyển ảnh mỗi 3 giây</p>
        </div>
      )}
    </section>

    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Xem nhanh</h2>
      <div className="text-sm text-gray-700">
        <div className="font-semibold text-base mb-1">{basic.name}</div>
        <div className="mb-2 text-gray-600">{basic.short_description}</div>
        <div className="prose max-w-none whitespace-pre-wrap text-gray-700">{basic.description}</div>
      </div>
    </section>
  </div>
</div>
```

```javascript
// ... (rest of the code remains the same)

      {/* Debug info */}
      {images.length > 1 && (
        <div className="mb-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
          🎬 Slideshow active: {images.length} ảnh | Hiện tại: ảnh {currentImageIndex + 1}
        </div>
      )}

      {/* Slideshow khi có nhiều hơn 1 ảnh */}
      {images.length > 0 && (
        <div className="mb-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
            {/* Main Image */}
            <img 
              src={(images[currentImageIndex]?.image_url || '').startsWith('http') 
                ? images[currentImageIndex]?.image_url 
                : `${config.API_BASE_URL.replace(/\/api$/, '')}${images[currentImageIndex]?.image_url}`}
              alt={`Tour image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Navigation Arrows - chỉ hiện khi hover và có > 1 ảnh */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDeleteImage(images[currentImageIndex]?.id)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Xóa ảnh này
            </button>
          </div>

          {/* Thumbnails - Dots indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex 
                      ? 'bg-primary-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400"/>
          <p>Chưa có ảnh nào được chọn</p>
          <p className="text-xs mt-1">Khi upload nhiều ảnh, sẽ tự động chuyển ảnh mỗi 3 giây</p>
        </div>
      )}
    </section>

    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Xem nhanh</h2>
      <div className="text-sm text-gray-700">
        <div className="font-semibold text-base mb-1">{basic.name}</div>
        <div className="mb-2 text-gray-600">{basic.short_description}</div>
        <div className="prose max-w-none whitespace-pre-wrap text-gray-700">{basic.description}</div>
      </div>
    </section>
  </div>
</div>
