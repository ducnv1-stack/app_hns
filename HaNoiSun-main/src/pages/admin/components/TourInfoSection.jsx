import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

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

const currencyOptions = [
  { key: 'VND', label: 'VND' },
  { key: 'USD', label: 'USD' },
  { key: 'EUR', label: 'EUR' }
];

const TourInfoSection = ({ data, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addDay = () => {
    const newItinerary = [...(data.itinerary || []), {
      day: (data.itinerary?.length || 0) + 1,
      title: '',
      description: ''
    }];
    onChange({ ...data, itinerary: newItinerary });
  };

  const removeDay = (idx) => {
    const newItinerary = data.itinerary.filter((_, i) => i !== idx);
    onChange({ ...data, itinerary: newItinerary });
  };

  const updateDay = (idx, field, value) => {
    const newItinerary = data.itinerary.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    onChange({ ...data, itinerary: newItinerary });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Thông tin cơ bản */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tên tour *</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={data.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Ví dụ: Đà Lạt - Nha Trang 4N3Đ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loại hình</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={data.service_type}
              onChange={e => updateField('service_type', e.target.value)}
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
              value={data.status}
              onChange={e => updateField('status', e.target.value)}
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
              value={data.duration_days}
              onChange={e => updateField('duration_days', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quốc gia</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={data.country}
              onChange={e => updateField('country', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa điểm</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={data.location}
              onChange={e => updateField('location', e.target.value)}
              placeholder="Ví dụ: Huế, Hà Nội"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá (đơn vị cơ bản)</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded px-3 py-2"
              value={data.price}
              onChange={e => updateField('price', e.target.value)}
              placeholder="Ví dụ: 4500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loại tiền tệ</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={data.currency}
              onChange={e => updateField('currency', e.target.value)}
            >
              {currencyOptions.map(o => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số người tối thiểu</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-3 py-2"
              value={data.min_participants}
              onChange={e => updateField('min_participants', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số người tối đa</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-3 py-2"
              value={data.max_participants}
              onChange={e => updateField('max_participants', Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
            <textarea
              rows={2}
              className="w-full border rounded px-3 py-2"
              value={data.short_description}
              onChange={e => updateField('short_description', e.target.value)}
              placeholder="Mô tả ngắn gọn về tour"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Giới thiệu / Mô tả chi tiết</label>
            <textarea
              rows={6}
              className="w-full border rounded px-3 py-2"
              value={data.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Mô tả chi tiết về tour, điểm đến, hoạt động..."
            />
          </div>
        </div>
      </div>

      {/* Lịch trình chi tiết */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Lịch trình chi tiết</h3>
          <button
            onClick={addDay}
            className="btn-secondary inline-flex items-center text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Thêm ngày
          </button>
        </div>
        <div className="space-y-4">
          {(data.itinerary || []).map((day, idx) => (
            <div key={idx} className="border rounded p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Ngày {day.day}</h4>
                {data.itinerary.length > 1 && (
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
          {(!data.itinerary || data.itinerary.length === 0) && (
            <div className="text-gray-500 text-sm text-center py-8 border-2 border-dashed rounded">
              Chưa có lịch trình. Nhấn "Thêm ngày" để bắt đầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourInfoSection;
