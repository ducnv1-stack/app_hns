import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

// Custom hook for managing bookings
export const useBookings = (initialFilters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchBookings = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.getBookings(newFilters);
      setBookings(response.bookings || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    fetchBookings(newFilters);
  };

  const refreshBookings = () => {
    fetchBookings();
  };

  const updateBookingStatus = async (bookingId, status, note = '') => {
    try {
      await bookingService.updateBookingStatus(bookingId, status, note);
      refreshBookings(); // Refresh the list
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    bookings,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refreshBookings,
    updateBookingStatus
  };
};

// Custom hook for single booking
export const useBooking = (bookingId) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response);
      } catch (err) {
        setError(err.message);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const updateStatus = async (status, note = '') => {
    try {
      await bookingService.updateBookingStatus(bookingId, status, note);
      // Refresh booking data
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    booking,
    loading,
    error,
    updateStatus
  };
};

// Custom hook for user bookings
export const useUserBookings = (userId, initialFilters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUserBookings = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.getUserBookings(userId, newFilters);
      setBookings(response.bookings || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserBookings();
    }
  }, [userId]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    fetchUserBookings(newFilters);
  };

  const refreshBookings = () => {
    fetchUserBookings();
  };

  return {
    bookings,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refreshBookings
  };
};

export default useBookings;
