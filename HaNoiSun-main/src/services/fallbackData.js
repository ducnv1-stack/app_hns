// Fallback data khi API không hoạt động
import { tours as staticTours, countries as staticCountries } from '../data/tours';

export const fallbackData = {
  tours: staticTours.map(tour => ({
    id: tour.id,
    name: tour.title,
    service_type: 'TOUR',
    status: 'ACTIVE',
    duration_days: parseInt(tour.duration) || null,
    country: tour.country,
    min_price: tour.price,
    max_price: tour.price,
    image_count: 1,
    availability_count: tour.availableDates?.length || 0,
    metadata: {
      isPopular: tour.isPopular,
      isOnSale: tour.isOnSale,
      discount: tour.discount,
      rating: tour.rating,
      reviews: tour.reviews
    }
  })),
  
  countries: staticCountries,
  
  categories: [
    { key: 'TOUR', name: 'Tour du lịch' },
    { key: 'COMBO', name: 'Combo' },
    { key: 'CULTURAL', name: 'Văn hóa' },
    { key: 'ADVENTURE', name: 'Phiêu lưu' }
  ]
};

export default fallbackData;
