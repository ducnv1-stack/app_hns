import { useState, useEffect, useRef } from 'react';
import { tourService } from '../services/tourService';
import { fallbackData } from '../services/fallbackData';

// Custom hook for managing tours
export const useTours = (initialFilters = {}) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const previousFiltersRef = useRef(null);

  const fetchTours = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 useTours: Fetching with filters:', newFilters);
      const response = await tourService.getTours(newFilters);
      console.log('📊 useTours: API response:', response);

      if (response && response.tours && Array.isArray(response.tours)) {
        console.log('✅ useTours: Using response.tours (', response.tours.length, 'tours)');
        console.log('🖼️ useTours: First tour images:', response.tours[0]?.images);
        setTours(response.tours);
        setPagination(response.pagination || null);
      } else if (response && response.data && response.data.tours) {
        console.log('✅ useTours: Using response.data.tours');
        setTours(response.data.tours);
        setPagination(response.data.pagination || null);
      } else {
        console.warn('⚠️ useTours: Using fallback data');
        setTours(fallbackData.tours);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: fallbackData.tours.length,
          itemsPerPage: fallbackData.tours.length
        });
      }
    } catch (err) {
      console.error('❌ useTours: API error, using fallback:', err.message);
      setError(err.message);
      // Use fallback data when API fails
      setTours(fallbackData.tours);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: fallbackData.tours.length,
        itemsPerPage: fallbackData.tours.length
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if filters actually changed (deep comparison)
    const filtersChanged = !previousFiltersRef.current ||
      JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged && Object.keys(filters).length > 0) {
      previousFiltersRef.current = filters;
      fetchTours(filters);
    }
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const refreshTours = () => {
    fetchTours(filters);
  };

  return {
    tours,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refreshTours
  };
};

// Custom hook for single tour
export const useTour = (tourId) => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tourId) {
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tourService.getTourById(tourId);
        setTour(response);
      } catch (err) {
        setError(err.message);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  return {
    tour,
    loading,
    error
  };
};

// Custom hook for tour metadata
export const useTourMetadata = () => {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [countriesResponse, categoriesResponse] = await Promise.all([
          tourService.getCountries(),
          tourService.getCategories()
        ]);
        
        setCountries(countriesResponse || []);
        setCategories(categoriesResponse || []);
      } catch (err) {
        console.warn('API failed, using fallback metadata:', err.message);
        setError(err.message);
        // Use fallback data
        setCountries(fallbackData.countries);
        setCategories(fallbackData.categories);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return {
    countries,
    categories,
    loading,
    error
  };
};

export default useTours;
