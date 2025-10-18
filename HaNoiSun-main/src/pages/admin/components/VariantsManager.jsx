import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit3 } from 'lucide-react';

const VariantsManager = ({ serviceId, serviceType, variants = [], onVariantsChange }) => {
  const [localVariants, setLocalVariants] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setLocalVariants(variants);
  }, [variants]);

  const updateVariant = (variantId, updates) => {
    const updated = localVariants.map(v => 
      v.id === variantId ? { ...v, ...updates } : v
    );
    setLocalVariants(updated);
    onVariantsChange(updated);
  };

  const updateVariantAttributes = (variantId, attributes) => {
    const updated = localVariants.map(v => 
      v.id === variantId ? { ...v, attributes: { ...v.attributes, ...attributes } } : v
    );
    setLocalVariants(updated);
    onVariantsChange(updated);
  };

  const addVariant = () => {
    const newVariant = {
      id: `temp_${Date.now()}`,
      service_id: serviceId,
      name: '',
      price: 0,
      currency: 'VND',
      capacity: 1,
      attributes: getDefaultAttributes(serviceType),
      is_active: true
    };
    
    const updated = [...localVariants, newVariant];
    setLocalVariants(updated);
    onVariantsChange(updated);
    setEditingVariant(newVariant.id);
  };

  const removeVariant = (variantId) => {
    const updated = localVariants.filter(v => v.id !== variantId);
    setLocalVariants(updated);
    onVariantsChange(updated);
  };

  const getDefaultAttributes = (type) => {
    switch (type) {
      case 'FLIGHT':
        return {
          cabin_class: 'Economy',
          baggage: {
            checked: '20kg',
            carry_on: '7kg'
          },
          seat_type: 'standard',
          meal_included: true,
          priority_boarding: false,
          lounge_access: false,
          entertainment: []
        };
      case 'HOTEL':
        return {
          room_category: 'standard',
          bed_type: 'double',
          view_type: 'city',
          amenities: [],
          max_occupancy: 2,
          extra_bed_available: false
        };
      case 'TOUR':
        return {
          age_group: 'adult',
          discount_percentage: 0,
          special_requirements: [],
          included_services: [],
          excluded_services: []
        };
      default:
        return {};
    }
  };

  const renderFlightAttributes = (variant) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Hạng ghế</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.cabin_class || 'Economy'}
          onChange={e => updateVariantAttributes(variant.id, { cabin_class: e.target.value })}
        >
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First Class</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Loại ghế</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.seat_type || 'standard'}
          onChange={e => updateVariantAttributes(variant.id, { seat_type: e.target.value })}
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="lie_flat">Lie Flat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hành lý ký gửi</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.baggage?.checked || '20kg'}
          onChange={e => updateVariantAttributes(variant.id, { 
            baggage: { 
              ...variant.attributes?.baggage, 
              checked: e.target.value 
            } 
          })}
        >
          <option value="20kg">20kg</option>
          <option value="30kg">30kg</option>
          <option value="40kg">40kg</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hành lý xách tay</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.baggage?.carry_on || '7kg'}
          onChange={e => updateVariantAttributes(variant.id, { 
            baggage: { 
              ...variant.attributes?.baggage, 
              carry_on: e.target.value 
            } 
          })}
        >
          <option value="7kg">7kg</option>
          <option value="10kg">10kg</option>
          <option value="15kg">15kg</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={variant.attributes?.meal_included || false}
              onChange={e => updateVariantAttributes(variant.id, { meal_included: e.target.checked })}
              className="mr-2"
            />
            Bữa ăn bao gồm
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={variant.attributes?.priority_boarding || false}
              onChange={e => updateVariantAttributes(variant.id, { priority_boarding: e.target.checked })}
              className="mr-2"
            />
            Lên máy bay ưu tiên
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={variant.attributes?.lounge_access || false}
              onChange={e => updateVariantAttributes(variant.id, { lounge_access: e.target.checked })}
              className="mr-2"
            />
            Truy cập phòng chờ
          </label>
        </div>
      </div>
    </div>
  );

  const renderHotelAttributes = (variant) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Loại phòng</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.room_category || 'standard'}
          onChange={e => updateVariantAttributes(variant.id, { room_category: e.target.value })}
        >
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Loại giường</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.bed_type || 'double'}
          onChange={e => updateVariantAttributes(variant.id, { bed_type: e.target.value })}
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="twin">Twin</option>
          <option value="king">King</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Hướng nhìn</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.view_type || 'city'}
          onChange={e => updateVariantAttributes(variant.id, { view_type: e.target.value })}
        >
          <option value="city">City View</option>
          <option value="garden">Garden View</option>
          <option value="sea">Sea View</option>
          <option value="mountain">Mountain View</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số người tối đa</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.max_occupancy || 2}
          onChange={e => updateVariantAttributes(variant.id, { max_occupancy: parseInt(e.target.value) })}
          min="1"
          max="10"
        />
      </div>

      <div className="md:col-span-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={variant.attributes?.extra_bed_available || false}
            onChange={e => updateVariantAttributes(variant.id, { extra_bed_available: e.target.checked })}
            className="mr-2"
          />
          Có thể thêm giường phụ
        </label>
      </div>
    </div>
  );

  const renderTourAttributes = (variant) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nhóm tuổi</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.age_group || 'adult'}
          onChange={e => updateVariantAttributes(variant.id, { age_group: e.target.value })}
        >
          <option value="adult">Người lớn</option>
          <option value="child">Trẻ em</option>
          <option value="senior">Người cao tuổi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Giảm giá (%)</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={variant.attributes?.discount_percentage || 0}
          onChange={e => updateVariantAttributes(variant.id, { discount_percentage: parseInt(e.target.value) })}
          min="0"
          max="100"
        />
      </div>
    </div>
  );

  const renderAttributes = (variant) => {
    switch (serviceType) {
      case 'FLIGHT':
        return renderFlightAttributes(variant);
      case 'HOTEL':
        return renderHotelAttributes(variant);
      case 'TOUR':
        return renderTourAttributes(variant);
      default:
        return <div className="text-gray-500">No attributes for this service type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Quản lý biến thể dịch vụ</h3>
        <button
          onClick={addVariant}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </button>
      </div>

      <div className="space-y-4">
        {localVariants.map((variant, index) => (
          <div key={variant.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h4 className="font-medium">Biến thể {index + 1}</h4>
                {editingVariant === variant.id && (
                  <span className="text-sm text-blue-600">Đang chỉnh sửa</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingVariant(editingVariant === variant.id ? null : variant.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeVariant(variant.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên biến thể</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={variant.name}
                  onChange={e => updateVariant(variant.id, { name: e.target.value })}
                  placeholder="Ví dụ: Người lớn, Trẻ em"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={variant.price}
                  onChange={e => updateVariant(variant.id, { price: parseFloat(e.target.value) })}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tiền tệ</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={variant.currency}
                  onChange={e => updateVariant(variant.id, { currency: e.target.value })}
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {editingVariant === variant.id && (
              <div className="border-t pt-4">
                <h5 className="font-medium mb-3">Thuộc tính chi tiết</h5>
                {renderAttributes(variant)}
              </div>
            )}

            {variant.attributes && Object.keys(variant.attributes).length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h6 className="text-sm font-medium mb-2">Thuộc tính hiện tại:</h6>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(variant.attributes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {localVariants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
        </div>
      )}
    </div>
  );
};

export default VariantsManager;
