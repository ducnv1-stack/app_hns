import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plane, Hotel as HotelIcon, Map } from 'lucide-react';
import TourInfoSection from './components/TourInfoSection';
import HotelInfoSection from './components/HotelInfoSection';
import FlightInfoSection from './components/FlightInfoSection';
import { adminTourService } from '../../services/adminTourService';

const ServiceNew = () => {
  const navigate = useNavigate();
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
    duration_days: 1,
    country: 'Việt Nam',
    location: '',
    price: '',
    currency: 'VND',
    min_participants: 1,
    max_participants: 25,
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

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate
      if (!tourData.name.trim()) {
        setError('Vui lòng nhập tên dịch vụ');
        return;
      }

      if (!tourData.description || tourData.description.trim().length < 10) {
        setError('Mô tả phải có ít nhất 10 ký tự');
        return;
      }

      if (!tourData.location || !tourData.location.trim()) {
        setError('Vui lòng nhập địa điểm tour');
        return;
      }

      const priceValue = Number(tourData.price);
      if (Number.isNaN(priceValue) || priceValue < 0) {
        setError('Vui lòng nhập giá hợp lệ');
        return;
      }

      // Prepare payload - merge all sections
      const payload = {
        // Tour info (always include)
        name: tourData.name,
        short_description: tourData.short_description,
        description: tourData.description,
        price: priceValue,
        currency: tourData.currency || 'VND',
        service_type: tourData.service_type,
        status: tourData.status,
        duration_days: Number(tourData.duration_days) || 1,
        country: tourData.country,
        location: tourData.location,
        min_participants: Number(tourData.min_participants) || 1,
        max_participants: Number(tourData.max_participants) || 1,
      };

      // Add optional tour fields
      if (tourData.itinerary?.length > 0) payload.itinerary = JSON.stringify(tourData.itinerary);

      // Add hotel fields (only if filled)
      if (hotelData.hotel_name) payload.hotel_name = hotelData.hotel_name;
      if (hotelData.hotel_address) payload.hotel_address = hotelData.hotel_address;
      if (hotelData.star_rating) payload.star_rating = hotelData.star_rating;
      if (hotelData.room_types) payload.room_types = hotelData.room_types;
      if (hotelData.bed_types) payload.bed_types = hotelData.bed_types;
      if (hotelData.room_area) payload.room_area = hotelData.room_area;
      if (hotelData.max_occupancy) payload.max_occupancy = hotelData.max_occupancy;
      if (hotelData.check_in_time) payload.check_in_time = hotelData.check_in_time;
      if (hotelData.check_out_time) payload.check_out_time = hotelData.check_out_time;
      if (hotelData.amenities?.length > 0) payload.amenities = JSON.stringify(hotelData.amenities);

      // Add flight fields (only if filled)
      if (flightData.airline) payload.airline = flightData.airline;
      if (flightData.flight_number) payload.flight_number = flightData.flight_number;
      if (flightData.departure_airport) payload.departure_airport = flightData.departure_airport;
      if (flightData.arrival_airport) payload.arrival_airport = flightData.arrival_airport;
      if (flightData.departure_time) payload.departure_time = flightData.departure_time;
      if (flightData.arrival_time) payload.arrival_time = flightData.arrival_time;
      if (flightData.aircraft_type) payload.aircraft_type = flightData.aircraft_type;
      if (flightData.baggage_allowance) payload.baggage_allowance = flightData.baggage_allowance;
      if (flightData.cabin_class) payload.cabin_class = flightData.cabin_class;

      // Create service
      const result = await adminTourService.createTour(payload);
      
      if (!result.success) {
        throw new Error(result.error || 'Tạo dịch vụ thất bại');
      }

      setSuccess('Tạo dịch vụ thành công!');
      
      // Redirect after 1.5s
      setTimeout(() => {
        navigate(`/admin/tours/${result.data.id}/edit`);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Lưu dịch vụ thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">Thêm Dịch Vụ Mới</h1>
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

export default ServiceNew;
