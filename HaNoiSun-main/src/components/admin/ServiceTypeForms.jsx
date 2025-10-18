import React from 'react';
import { Plane, Hotel, Package, MapPin } from 'lucide-react';

// Tour Form
export const TourDetailsForm = ({ details, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Thông tin Tour
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Số ngày</label>
          <input
            type="number"
            min="1"
            value={details?.duration_days || ''}
            onChange={(e) => handleChange('duration_days', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Quốc gia</label>
          <input
            type="text"
            value={details?.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Việt Nam"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Số người tối thiểu</label>
          <input
            type="number"
            min="1"
            value={details?.min_participants || ''}
            onChange={(e) => handleChange('min_participants', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Số người tối đa</label>
          <input
            type="number"
            min="1"
            value={details?.max_participants || ''}
            onChange={(e) => handleChange('max_participants', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

// Flight Form
export const FlightDetailsForm = ({ details, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Plane className="h-5 w-5 mr-2" />
        Thông tin Vé máy bay
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hãng hàng không</label>
          <input
            type="text"
            value={details?.airline || ''}
            onChange={(e) => handleChange('airline', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Vietnam Airlines"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Số hiệu chuyến bay</label>
          <input
            type="text"
            value={details?.flight_number || ''}
            onChange={(e) => handleChange('flight_number', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="VN123"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sân bay đi</label>
          <input
            type="text"
            value={details?.departure_airport || ''}
            onChange={(e) => handleChange('departure_airport', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Nội Bài (HAN)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sân bay đến</label>
          <input
            type="text"
            value={details?.arrival_airport || ''}
            onChange={(e) => handleChange('arrival_airport', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Tân Sơn Nhất (SGN)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giờ khởi hành</label>
          <input
            type="time"
            value={details?.departure_time || ''}
            onChange={(e) => handleChange('departure_time', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giờ đến</label>
          <input
            type="time"
            value={details?.arrival_time || ''}
            onChange={(e) => handleChange('arrival_time', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Loại máy bay</label>
          <input
            type="text"
            value={details?.aircraft_type || ''}
            onChange={(e) => handleChange('aircraft_type', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Boeing 787"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Hành lý</label>
          <input
            type="text"
            value={details?.baggage_allowance || ''}
            onChange={(e) => handleChange('baggage_allowance', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="23kg"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Hạng ghế</label>
          <select
            value={details?.seat_class || 'Economy'}
            onChange={(e) => handleChange('seat_class', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Hotel Form
export const HotelDetailsForm = ({ details, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...details, [field]: value });
  };

  const handleAmenitiesChange = (amenity) => {
    const currentAmenities = details?.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    handleChange('amenities', newAmenities);
  };

  const amenitiesList = ['wifi', 'pool', 'gym', 'breakfast', 'parking', 'spa', 'restaurant', 'bar', 'room_service', 'laundry'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Hotel className="h-5 w-5 mr-2" />
        Thông tin Khách sạn
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tên khách sạn</label>
          <input
            type="text"
            value={details?.hotel_name || ''}
            onChange={(e) => handleChange('hotel_name', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Khách sạn ABC"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <textarea
            rows={2}
            value={details?.hotel_address || ''}
            onChange={(e) => handleChange('hotel_address', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Địa chỉ khách sạn"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Hạng sao</label>
          <select
            value={details?.star_rating || 3}
            onChange={(e) => handleChange('star_rating', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>
            <option value="5">5 sao</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Loại phòng</label>
          <input
            type="text"
            value={details?.room_type || ''}
            onChange={(e) => handleChange('room_type', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Deluxe, Suite..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Loại giường</label>
          <input
            type="text"
            value={details?.bed_type || ''}
            onChange={(e) => handleChange('bed_type', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="King, Twin..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Diện tích phòng (m²)</label>
          <input
            type="number"
            step="0.1"
            value={details?.room_size || ''}
            onChange={(e) => handleChange('room_size', parseFloat(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sức chứa tối đa</label>
          <input
            type="number"
            min="1"
            value={details?.max_occupancy || ''}
            onChange={(e) => handleChange('max_occupancy', parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giờ nhận phòng</label>
          <input
            type="time"
            value={details?.check_in_time || ''}
            onChange={(e) => handleChange('check_in_time', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giờ trả phòng</label>
          <input
            type="time"
            value={details?.check_out_time || ''}
            onChange={(e) => handleChange('check_out_time', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Tiện nghi</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(details?.amenities || []).includes(amenity)}
                  onChange={() => handleAmenitiesChange(amenity)}
                  className="rounded"
                />
                <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Chính sách hủy</label>
          <textarea
            rows={3}
            value={details?.cancellation_policy || ''}
            onChange={(e) => handleChange('cancellation_policy', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Mô tả chính sách hủy phòng"
          />
        </div>
      </div>
    </div>
  );
};

// Combo Form
export const ComboDetailsForm = ({ details, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Package className="h-5 w-5 mr-2" />
        Thông tin Combo
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Combo bao gồm</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={details?.includes_tour || false}
                onChange={(e) => handleChange('includes_tour', e.target.checked)}
                className="rounded"
              />
              <span>Tour du lịch</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={details?.includes_hotel || false}
                onChange={(e) => handleChange('includes_hotel', e.target.checked)}
                className="rounded"
              />
              <span>Khách sạn</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={details?.includes_flight || false}
                onChange={(e) => handleChange('includes_flight', e.target.checked)}
                className="rounded"
              />
              <span>Vé máy bay</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả combo</label>
          <textarea
            rows={4}
            value={details?.combo_description || ''}
            onChange={(e) => handleChange('combo_description', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Mô tả chi tiết về combo này"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ưu đãi đặc biệt</label>
          <textarea
            rows={3}
            value={details?.special_offers || ''}
            onChange={(e) => handleChange('special_offers', e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Các ưu đãi, khuyến mãi đặc biệt"
          />
        </div>
      </div>
    </div>
  );
};
