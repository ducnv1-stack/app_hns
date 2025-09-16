import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Users, Star, Heart, ArrowRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import TourCard from '../components/tours/TourCard';
import TourFilters from '../components/tours/TourFilters';
import TourSearch from '../components/tours/TourSearch';
import { tours as sharedTours, countries } from '../data/tours';

const ToursPage = () => {
  const { country: countryParam } = useParams();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    continent: 'all',
    priceRange: 'all',
    duration: 'all',
    category: 'all',
    sortBy: 'popularity'
  });

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setTours(sharedTours);
      setFilteredTours(sharedTours);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterTours();
  }, [activeFilters, searchQuery, tours, countryParam]);

  const filterTours = () => {
    let filtered = [...tours];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Continent filter
    if (activeFilters.continent !== 'all') {
      filtered = filtered.filter(tour => tour.continent === activeFilters.continent);
    }

    // Country route filter (if present)
    if (countryParam) {
      filtered = filtered.filter(tour => (tour.country || '').toLowerCase() === countryParam.toLowerCase());
    }

    // Price range filter
    if (activeFilters.priceRange !== 'all') {
      const ranges = {
        'under-5m': [0, 5000000],
        '5m-15m': [5000000, 15000000],
        '15m-30m': [15000000, 30000000],
        'over-30m': [30000000, Infinity]
      };
      const [min, max] = ranges[activeFilters.priceRange];
      filtered = filtered.filter(tour => tour.price >= min && tour.price <= max);
    }

    // Duration filter
    if (activeFilters.duration !== 'all') {
      const durationMap = {
        'short': ['3 ngày', '4 ngày'],
        'medium': ['5 ngày', '6 ngày', '7 ngày'],
        'long': ['8 ngày', '9 ngày', '10 ngày']
      };
      filtered = filtered.filter(tour => 
        durationMap[activeFilters.duration].some(d => tour.duration.includes(d))
      );
    }

    // Category filter
    if (activeFilters.category !== 'all') {
      filtered = filtered.filter(tour => tour.category === activeFilters.category);
    }

    // Sort
    switch (activeFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default: // popularity
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.reviews - a.reviews;
        });
    }

    setFilteredTours(filtered);
  };

  const toggleFavorite = (tourId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId);
    } else {
      newFavorites.add(tourId);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách tours...</p>
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
              Hơn {tours.length} tour du lịch đặc sắc đang chờ bạn khám phá. 
              Từ những chuyến phiêu lưu mạo hiểm đến kỳ nghỉ thư giãn sang trọng.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{tours.length}+</div>
                <div className="text-blue-100">Tours Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{tours.filter(t => t.isOnSale).length}</div>
                <div className="text-blue-100">Special Offers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{tours.filter(t => t.isPopular).length}</div>
                <div className="text-blue-100">Popular Tours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
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