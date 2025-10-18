import { api } from './api';

// Tour Service - API calls for tours
export const tourService = {
  // Get all tours with filters
  getTours: async (filters = {}) => {
    try {
      const response = await api.get('/tours', filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  },

  // Get tour by ID
  getTourById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  },

  // Get available countries
  getCountries: async () => {
    try {
      const response = await api.get('/tours/meta/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  // Get available categories
  getCategories: async () => {
    try {
      const response = await api.get('/tours/meta/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Search tours
  searchTours: async (searchTerm, filters = {}) => {
    try {
      const searchFilters = {
        search: searchTerm,
        ...filters
      };
      const response = await api.get('/tours', searchFilters);
      return response.data;
    } catch (error) {
      console.error('Error searching tours:', error);
      throw error;
    }
  },

  // Get tours by country
  getToursByCountry: async (country) => {
    try {
      const response = await api.get('/tours', { country });
      return response.data;
    } catch (error) {
      console.error('Error fetching tours by country:', error);
      throw error;
    }
  },

  // Get tours by category
  getToursByCategory: async (category) => {
    try {
      const response = await api.get('/tours', { category });
      return response.data;
    } catch (error) {
      console.error('Error fetching tours by category:', error);
      throw error;
    }
  },

  // Get tours with price range
  getToursByPriceRange: async (minPrice, maxPrice, filters = {}) => {
    try {
      const priceFilters = {
        minPrice,
        maxPrice,
        ...filters
      };
      const response = await api.get('/tours', priceFilters);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours by price range:', error);
      throw error;
    }
  }
};

// Legacy compatibility - keep existing functions
export const getTours = tourService.getTours;
export const getTourById = tourService.getTourById;
export const getToursByCountry = tourService.getToursByCountry;

export default tourService;
