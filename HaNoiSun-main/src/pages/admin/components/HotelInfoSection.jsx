import React from 'react';

const amenitiesList = [
  { id: 'wifi', label: 'Wifi' },
  { id: 'pool', label: 'Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'parking', label: 'Parking' },
  { id: 'spa', label: 'Spa' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'bar', label: 'Bar' },
  { id: 'room_service', label: 'Room Service' },
  { id: 'laundry', label: 'Laundry' },
];

const HotelInfoSection = ({ data, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const toggleAmenity = (amenityId) => {
    const currentAmenities = data.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    onChange({ ...data, amenities: newAmenities });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tên khách sạn</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.hotel_name}
            onChange={e => updateField('hotel_name', e.target.value)}
            placeholder="Khách sạn ABC"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <textarea
            rows={2}
            className="w-full border rounded px-3 py-2"
            value={data.hotel_address}
            onChange={e => updateField('hotel_address', e.target.value)}
            placeholder="Địa chỉ khách sạn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hạng sao</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={data.star_rating}
            onChange={e => updateField('star_rating', Number(e.target.value))}
          >
            <option value={1}>1 sao</option>
            <option value={2}>2 sao</option>
            <option value={3}>3 sao</option>
            <option value={4}>4 sao</option>
            <option value={5}>5 sao</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Loại phòng</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.room_types}
            onChange={e => updateField('room_types', e.target.value)}
            placeholder="Deluxe, Suite..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Loại giường</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.bed_types}
            onChange={e => updateField('bed_types', e.target.value)}
            placeholder="King, Twin..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Diện tích phòng (m²)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={data.room_area}
            onChange={e => updateField('room_area', e.target.value)}
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sức chứa tối đa</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2"
            value={data.max_occupancy}
            onChange={e => updateField('max_occupancy', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ nhận phòng</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={data.check_in_time}
            onChange={e => updateField('check_in_time', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ trả phòng</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={data.check_out_time}
            onChange={e => updateField('check_out_time', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Tiện nghi</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {amenitiesList.map(amenity => (
              <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(data.amenities || []).includes(amenity.id)}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        * Các thông tin khách sạn là tùy chọn. Chỉ điền nếu dịch vụ bao gồm khách sạn.
      </p>
    </div>
  );
};

export default HotelInfoSection;
