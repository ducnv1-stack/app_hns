import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Users, Star, Heart, ArrowRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import TourCard from '../components/tours/TourCard';
import TourFilters from '../components/tours/TourFilters';
import TourSearch from '../components/tours/TourSearch';
import { useTours, useTourMetadata } from '../hooks/useTours';

const ToursPage = () => {
  const { country: countryParam } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    continent: 'all',
    priceRange: 'all',
    duration: 'all',
    category: 'all',
    sortBy: 'popularity'
  });

  // Use API hooks with initial filters - memoized to prevent infinite loop
  const initialFilters = useMemo(() => ({
    ...(countryParam && { country: countryParam }),
    ...(searchQuery && { search: searchQuery }),
    page: 1,
    limit: 50
  }), [countryParam, searchQuery]);

  const { tours, loading, error, pagination, updateFilters } = useTours(initialFilters);
  const { countries, loading: metadataLoading } = useTourMetadata();
  const [filteredTours, setFilteredTours] = useState([]);

  // Apply filters when they change
  useEffect(() => {
    const apiFilters = {
      page: 1,
      limit: 50
    };

    // Add country filter if exists
    if (countryParam) {
      apiFilters.country = countryParam;
    }

    // Add search filter if exists
    if (searchQuery && searchQuery.trim()) {
      apiFilters.search = searchQuery.trim();
    }

    // Add price range filter
    if (activeFilters.priceRange !== 'all') {
      const ranges = {
        'under-5m': { minPrice: 0, maxPrice: 5000000 },
        '5m-15m': { minPrice: 5000000, maxPrice: 15000000 },
        '15m-30m': { minPrice: 15000000, maxPrice: 30000000 },
        'over-30m': { minPrice: 30000000 }
      };
      const range = ranges[activeFilters.priceRange];
      if (range) {
        Object.assign(apiFilters, range);
      }
    }

    updateFilters(apiFilters);
  }, [countryParam, searchQuery, activeFilters.priceRange]);

  // Add category filter
  useEffect(() => {
    if (activeFilters.category !== 'all') {
      const currentFilters = {
        ...(countryParam && { country: countryParam }),
        ...(searchQuery && { search: searchQuery }),
        category: activeFilters.category.toUpperCase(),
        page: 1,
        limit: 50
      };
      updateFilters(currentFilters);
    }
  }, [activeFilters.category, countryParam, searchQuery]);

  // Apply client-side filters for sorting and other filters
  useEffect(() => {
    let filtered = [...tours];

    // Sort
    switch (activeFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.max_price || 0) - (a.max_price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default: // popularity
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.reviews || 0) - (a.reviews || 0);
        });
    }

    setFilteredTours(filtered);
  }, [tours, activeFilters.sortBy]);

  // Remove the old filterTours function as it's now handled by API and useEffect

  const toggleFavorite = (tourId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId);
    } else {
      newFavorites.add(tourId);
    }
    setFavorites(newFavorites);
  };

  if (loading || metadataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khám Phá Thế Giới Cùng Chúng Tôi
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hơn {pagination?.totalItems || tours.length} tour du lịch đặc sắc đang chờ bạn khám phá. 
              Từ những chuyến phiêu lưu mạo hiểm đến kỳ nghỉ thư giãn sang trọng.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{pagination?.totalItems || tours.length}+</div>
                <div className="text-blue-100">Tours Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{tours.filter(t => t.metadata?.isOnSale).length}</div>
                <div className="text-blue-100">Special Offers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{tours.filter(t => t.metadata?.isPopular).length}</div>
                <div className="text-blue-100">Popular Tours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{countries.length}+</div>
                <div className="text-blue-100">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Quick Filter Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {countries.map((c) => (
              <button
                key={c.key}
                onClick={() => navigate(`/tours/country/${c.key}`)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${
                  countryParam === c.key ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => navigate('/tours')}
              className={`ml-auto px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 hover:bg-gray-200`}
            >
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <TourSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Bộ Lọc</span>
              </button>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {filteredTours.length} tours
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <TourFilters 
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>
          )}

          {/* Tours Grid/List */}
          <div className="flex-1">
            {filteredTours.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {countryParam ? 'Hiện chưa có tour cho điểm đến này' : 'Không tìm thấy tour phù hợp'}
                </h3>
                {!countryParam && (
                  <>
                    <p className="text-gray-600 mb-6">
                      Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <button
                      onClick={() => {
                        setActiveFilters({
                          continent: 'all',
                          priceRange: 'all',
                          duration: 'all',
                          category: 'all',
                          sortBy: 'popularity'
                        });
                        setSearchQuery('');
                      }}
                      className="btn-primary"
                    >
                      Xóa Bộ Lọc
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    viewMode={viewMode}
                    isFavorite={favorites.has(tour.id)}
                    onToggleFavorite={() => toggleFavorite(tour.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;