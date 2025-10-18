import React from 'react';

const cabinClassOptions = [
  { key: 'ECONOMY', label: 'Economy' },
  { key: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { key: 'BUSINESS', label: 'Business' },
  { key: 'FIRST', label: 'First Class' },
];

const FlightInfoSection = ({ data, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hãng hàng không</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.airline}
            onChange={e => updateField('airline', e.target.value)}
            placeholder="Vietnam Airlines"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số hiệu chuyến bay</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.flight_number}
            onChange={e => updateField('flight_number', e.target.value)}
            placeholder="VN123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sân bay đi</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.departure_airport}
            onChange={e => updateField('departure_airport', e.target.value)}
            placeholder="Nội Bài (HAN)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sân bay đến</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.arrival_airport}
            onChange={e => updateField('arrival_airport', e.target.value)}
            placeholder="Tân Sơn Nhất (SGN)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ khởi hành</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={data.departure_time}
            onChange={e => updateField('departure_time', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giờ đến</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={data.arrival_time}
            onChange={e => updateField('arrival_time', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Loại máy bay</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.aircraft_type}
            onChange={e => updateField('aircraft_type', e.target.value)}
            placeholder="Boeing 787"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hành lý</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={data.baggage_allowance}
            onChange={e => updateField('baggage_allowance', e.target.value)}
            placeholder="23kg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Hạng ghế</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={data.cabin_class}
            onChange={e => updateField('cabin_class', e.target.value)}
          >
            {cabinClassOptions.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        * Các thông tin vé máy bay là tùy chọn. Chỉ điền nếu dịch vụ bao gồm vé máy bay.
      </p>
    </div>
  );
};

export default FlightInfoSection;
