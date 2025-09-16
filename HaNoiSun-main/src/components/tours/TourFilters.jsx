import React from 'react';
import { X } from 'lucide-react';

const TourFilters = ({ activeFilters, onFiltersChange }) => {
  const updateFilter = (key, value) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      continent: 'all',
      priceRange: 'all',
      duration: 'all',
      category: 'all',
      sortBy: 'popularity'
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== 'all' && value !== 'popularity');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Bộ Lọc</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Sắp xếp theo
          </label>
          <select
            value={activeFilters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="popularity">Phổ biến nhất</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="discount">Giảm giá nhiều nhất</option>
          </select>
        </div>

        {/* Continent */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Khu vực
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'domestic', label: 'Trong nước' },
              { value: 'asia', label: 'Châu Á' },
              { value: 'europe', label: 'Châu Âu' },
              { value: 'america', label: 'Châu Mỹ' },
              { value: 'oceania', label: 'Châu Úc' },
              { value: 'africa', label: 'Châu Phi' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="continent"
                  value={option.value}
                  checked={activeFilters.continent === option.value}
                  onChange={(e) => updateFilter('continent', e.target.value)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Khoảng giá
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'under-5m', label: 'Dưới 5 triệu' },
              { value: '5m-15m', label: '5 - 15 triệu' },
              { value: '15m-30m', label: '15 - 30 triệu' },
              { value: 'over-30m', label: 'Trên 30 triệu' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={option.value}
                  checked={activeFilters.priceRange === option.value}
                  onChange={(e) => updateFilter('priceRange', e.target.value)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Thời gian
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'short', label: '3-4 ngày' },
              { value: 'medium', label: '5-7 ngày' },
              { value: 'long', label: '8+ ngày' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={activeFilters.duration === option.value}
                  onChange={(e) => updateFilter('duration', e.target.value)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Loại tour
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'cultural', label: 'Văn hóa' },
              { value: 'adventure', label: 'Phiêu lưu' },
              { value: 'beach', label: 'Biển đảo' },
              { value: 'city', label: 'Thành phố' },
              { value: 'luxury', label: 'Cao cấp' },
              { value: 'nature', label: 'Thiên nhiên' },
              { value: 'romantic', label: 'Lãng mạn' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={option.value}
                  checked={activeFilters.category === option.value}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourFilters;