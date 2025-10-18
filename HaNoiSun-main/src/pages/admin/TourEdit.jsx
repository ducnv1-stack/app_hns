import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plane, Hotel as HotelIcon, Map } from 'lucide-react';
import TourInfoSection from './components/TourInfoSection';
import HotelInfoSection from './components/HotelInfoSection';
import FlightInfoSection from './components/FlightInfoSection';
import VariantsManager from './components/VariantsManager';
import { adminTourService } from '../../services/adminTourService';

const TourEdit = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tour data
  const [tourData, setTourData] = useState({
    name: '',
    short_description: '',
    description: '',
    service_type: 'TOUR',
    status: 'DRAFT',
    default_currency: 'VND',
    base_price: '',
    location: '',
    duration_days: 1,
    country: 'Việt Nam',
    min_participants: 1,
    max_participants: 25,
    departure_date: '',
    return_date: '',
    itinerary: []
  });

  // Hotel data
  const [hotelData, setHotelData] = useState({
    hotel_name: '',
    hotel_address: '',
    star_rating: 3,
    room_types: '',
    bed_types: '',
    room_area: '',
    max_occupancy: 2,
    check_in_time: '14:00',
    check_out_time: '12:00',
    amenities: []
  });

  // Flight data
  const [flightData, setFlightData] = useState({
    airline: '',
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_time: '',
    arrival_time: '',
    aircraft_type: '',
    baggage_allowance: '23kg',
    cabin_class: 'ECONOMY'
  });

  // Variants data
  const [variants, setVariants] = useState([]);

  // Load tour data
  useEffect(() => {
    loadTourData();
  }, [slugOrId]);

  const loadTourData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await adminTourService.getTourContent(slugOrId);
      
      // Load tour data
      setTourData({
        name: data.name || '',
        short_description: data.short_description || '',
        description: data.description || '',
        service_type: data.service_type || 'TOUR',
        status: data.status || 'DRAFT',
        default_currency: data.default_currency || 'VND',
        base_price: data.base_price || '',
        location: (data.metadata && (data.metadata.location || data.metadata?.address)) || '',
        duration_days: data.duration_days || 1,
        country: data.country || 'Việt Nam',
        min_participants: data.min_participants || 1,
        max_participants: data.max_participants || 25,
        departure_date: data.departure_date || '',
        return_date: data.return_date || '',
        itinerary: data.itinerary ? (typeof data.itinerary === 'string' ? JSON.parse(data.itinerary) : data.itinerary) : []
      });
      
      // Load hotel data
      setHotelData({
        hotel_name: data.hotel_name || '',
        hotel_address: data.hotel_address || '',
        star_rating: data.star_rating || 3,
        room_types: data.room_types || '',
        bed_types: data.bed_types || '',
        room_area: data.room_area || '',
        max_occupancy: data.max_occupancy || 2,
        check_in_time: data.check_in_time || '14:00',
        check_out_time: data.check_out_time || '12:00',
        amenities: data.amenities ? (typeof data.amenities === 'string' ? JSON.parse(data.amenities) : data.amenities) : []
      });
      
      // Load flight data
      setFlightData({
        airline: data.airline || '',
        flight_number: data.flight_number || '',
        departure_airport: data.departure_airport || '',
        arrival_airport: data.arrival_airport || '',
        departure_time: data.departure_time || '',
        arrival_time: data.arrival_time || '',
        aircraft_type: data.aircraft_type || '',
        baggage_allowance: data.baggage_allowance || '23kg',
        cabin_class: data.cabin_class || 'ECONOMY'
      });

      // Load variants data
      if (data.variants && Array.isArray(data.variants)) {
        setVariants(data.variants);
      } else {
        setVariants([]);
      }
      
    } catch (err) {
      console.error('Error loading tour:', err);
      setError('Không thể tải dữ liệu tour: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate
      if (!tourData.name.trim()) {
        setError('Vui lòng nhập tên tour');
        return;
      }

      // Prepare payload - merge all sections
      const payload = {
        // Tour info
        name: tourData.name,
        short_description: tourData.short_description,
        description: tourData.description,
        service_type: tourData.service_type,
        status: tourData.status,
        default_currency: tourData.default_currency || 'VND',
        base_price: tourData.base_price !== '' ? Number(tourData.base_price) : undefined,
        location: tourData.location || undefined,
        duration_days: Number(tourData.duration_days) || undefined,
        country: tourData.country,
        min_participants: Number(tourData.min_participants) || undefined,
        max_participants: Number(tourData.max_participants) || undefined,
      };

      // Add optional tour fields
      if (tourData.departure_date) payload.departure_date = tourData.departure_date;
      if (tourData.return_date) payload.return_date = tourData.return_date;
      if (tourData.itinerary?.length > 0) payload.itinerary = JSON.stringify(tourData.itinerary);

      // Add hotel fields (only if hotel_name is filled)
      if (hotelData.hotel_name && hotelData.hotel_name.trim()) {
        payload.hotel_name = hotelData.hotel_name;
        if (hotelData.hotel_address) payload.hotel_address = hotelData.hotel_address;
        if (hotelData.star_rating) payload.star_rating = Number(hotelData.star_rating);
        if (hotelData.room_types) payload.room_types = hotelData.room_types;
        if (hotelData.bed_types) payload.bed_types = hotelData.bed_types;
        if (hotelData.room_area) payload.room_area = parseFloat(hotelData.room_area);
        if (hotelData.max_occupancy) payload.max_occupancy = Number(hotelData.max_occupancy);
        if (hotelData.check_in_time) payload.check_in_time = hotelData.check_in_time;
        if (hotelData.check_out_time) payload.check_out_time = hotelData.check_out_time;
        if (hotelData.amenities?.length > 0) payload.amenities = JSON.stringify(hotelData.amenities);
      }

      // Add flight fields (only if airline is filled)
      if (flightData.airline && flightData.airline.trim()) {
        payload.airline = flightData.airline;
        if (flightData.flight_number) payload.flight_number = flightData.flight_number;
        if (flightData.departure_airport) payload.departure_airport = flightData.departure_airport;
        if (flightData.arrival_airport) payload.arrival_airport = flightData.arrival_airport;
        if (flightData.departure_time) payload.departure_time = flightData.departure_time;
        if (flightData.arrival_time) payload.arrival_time = flightData.arrival_time;
        if (flightData.aircraft_type) payload.aircraft_type = flightData.aircraft_type;
        if (flightData.baggage_allowance) payload.baggage_allowance = flightData.baggage_allowance;
        if (flightData.cabin_class) payload.cabin_class = flightData.cabin_class;
      }

      // Add variants data
      if (variants && variants.length > 0) {
        payload.variants = variants;
      }

      // Log payload for debugging
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
      
      // Update tour
      await adminTourService.updateBasic(slugOrId, payload);
      
      setSuccess('Cập nhật tour thành công!');
      
      // Reload data
      setTimeout(() => {
        loadTourData();
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Cập nhật tour thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">Chỉnh sửa Tour</h1>
            <span className="text-sm text-gray-500">ID: {slugOrId}</span>
          </div>
          <button 
            onClick={handleSaveAll} 
            disabled={saving}
            className="btn-primary inline-flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Section 1: Tour Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Tour</h2>
          </div>
          <TourInfoSection data={tourData} onChange={setTourData} />
        </div>

        {/* Section 2: Hotel Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <HotelIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Khách sạn</h2>
          </div>
          <HotelInfoSection data={hotelData} onChange={setHotelData} />
        </div>

        {/* Section 3: Flight Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Plane className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin Vé máy bay</h2>
          </div>
          <FlightInfoSection data={flightData} onChange={setFlightData} />
        </div>

        {/* Section 4: Variants Manager */}
        <div className="mb-8">
          <VariantsManager 
            serviceId={slugOrId}
            serviceType={tourData.service_type}
            variants={variants}
            onVariantsChange={setVariants}
          />
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSaveAll} 
            disabled={saving}
            className="btn-primary inline-flex items-center px-8 py-3 text-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả thông tin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourEdit;
