import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getTourById } from '../data/tours';
import { useTours } from '../hooks/useTours';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Check, Calendar, Users, CreditCard, FileText, Download, Home, Eye } from 'lucide-react';
import BookingStep1 from '../components/booking/BookingStep1';
import BookingStep2 from '../components/booking/BookingStep2';
import BookingStep3 from '../components/booking/BookingStep3';
import BookingStep4 from '../components/booking/BookingStep4';
import BookingSummary from '../components/booking/BookingSummary';

const BookingPage = () => {
  const { tourId: slugOrId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Booking data state
  const [bookingData, setBookingData] = useState({
    // Step 1 data
    selectedDate: '',
    selectedSchedule: null,
    selectedScheduleMeta: null,
    priceOverrideAdult: null,
    passengers: {
      adults: 2,
      children: 0,
      infants: 0
    },
    
    // Step 2 data
    contactInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: ''
    },
    passengerDetails: [],
    isContactAlsoPassenger: true,
    
    // Step 3 data
    paymentMethod: 'online',
    
    // Step 4 data
    bookingId: '',
    bookingStatus: 'pending'
  });

  const steps = [
    {
      id: 1,
      title: 'Thông Tin Tour',
      subtitle: 'Chọn ngày & số lượng',
      icon: Calendar,
      description: 'Xem chi tiết tour và tùy chỉnh theo nhu cầu'
    },
    {
      id: 2,
      title: 'Thông Tin Khách',
      subtitle: 'Nhập thông tin cá nhân',
      icon: Users,
      description: 'Cung cấp thông tin liên hệ và hành khách'
    },
    {
      id: 3,
      title: 'Thanh Toán',
      subtitle: 'Chọn phương thức',
      icon: CreditCard,
      description: 'Lựa chọn cách thức thanh toán phù hợp'
    },
    {
      id: 4,
      title: 'Xác Nhận',
      subtitle: 'Hoàn tất đặt tour',
      icon: Check,
      description: 'Nhận voucher và thông tin booking'
    }
  ];

  // Load tour by id from centralized data

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundTour = getTourById(slugOrId);
      if (foundTour) {
        setTour(foundTour);
        setBookingData(prev => ({
          ...prev,
          selectedDate: (foundTour.availableDates && foundTour.availableDates[0]) || ''
        }));
      } else {
        navigate('/tours');
      }
      setLoading(false);
    }, 400);
  }, [slugOrId, navigate]);

  const updateBookingData = (stepData) => {
    setBookingData(prev => ({
      ...prev,
      ...stepData
    }));
  };

  const calculateTotalPrice = () => {
    if (!tour) return 0;
    
    const { adults, children, infants } = bookingData.passengers;
    const effectiveAdult = bookingData.priceOverrideAdult || tour.pricing.adult;
    // giữ tỉ lệ giá trẻ em/em bé theo pricing gốc
    const childRatio = tour.pricing.adult ? (tour.pricing.child / tour.pricing.adult) : 0.75;
    const infantRatio = tour.pricing.adult ? (tour.pricing.infant / tour.pricing.adult) : 0;
    const effectiveChild = Math.round(effectiveAdult * childRatio);
    const effectiveInfant = Math.round(effectiveAdult * infantRatio);

    const adultPrice = effectiveAdult * adults;
    const childPrice = effectiveChild * children;
    const infantPrice = effectiveInfant * infants;
    
    return adultPrice + childPrice + infantPrice;
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setSubmitting(true);
    try {
      const bookingPayload = {
        serviceId: tour.id,
        selectedDate: bookingData.selectedDate,
        selectedSchedule: bookingData.selectedSchedule,
        passengers: bookingData.passengers,
        contactInfo: bookingData.contactInfo,
        passengerDetails: bookingData.passengerDetails,
        paymentMethod: bookingData.paymentMethod,
        totalPrice: calculateTotalPrice(),
        status: 'pending'
      };

      const result = await bookingService.createBooking(bookingPayload);
      
      // Update booking data with server response
      setBookingData(prev => ({
        ...prev,
        bookingId: result.bookingId,
        bookingStatus: result.status
      }));
      
      // Move to confirmation step
      setCurrentStep(4);
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy tour</h2>
          <button 
            onClick={() => navigate('/tours')}
            className="btn-primary"
          >
            Quay lại danh sách tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/tours')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại Tours</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Đặt Tour</h1>
              <p className="text-gray-600">Bước {currentStep} / {steps.length}</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = currentStep >= step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isClickable && goToStep(step.id)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-200 ${
                      isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`font-medium text-sm ${
                        isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.subtitle}</p>
                    </div>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step Content */}
              {currentStep === 1 && (
                <BookingStep1
                  tour={tour}
                  bookingData={bookingData}
                  onUpdateData={updateBookingData}
                  onNext={nextStep}
                />
              )}
              
              {currentStep === 2 && (
                <BookingStep2
                  tour={tour}
                  bookingData={bookingData}
                  onUpdateData={updateBookingData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {currentStep === 3 && (
                <BookingStep3
                  tour={tour}
                  bookingData={bookingData}
                  totalPrice={calculateTotalPrice()}
                  onUpdateData={updateBookingData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {currentStep === 4 && (
                <BookingStep4
                  tour={tour}
                  bookingData={bookingData}
                  totalPrice={calculateTotalPrice()}
                  onStartOver={() => {
                    setCurrentStep(1);
                    setBookingData({
                      selectedDate: tour.availableDates[0],
                      passengers: { adults: 2, children: 0, infants: 0 },
                      contactInfo: { fullName: '', email: '', phone: '', address: '' },
                      passengerDetails: [],
                      isContactAlsoPassenger: true,
                      paymentMethod: 'online',
                      bookingId: '',
                      bookingStatus: 'pending'
                    });
                  }}
                />
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              tour={tour}
              bookingData={bookingData}
              totalPrice={calculateTotalPrice()}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;