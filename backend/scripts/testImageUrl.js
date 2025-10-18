// Test complete image URL construction
const config = {
  API_BASE_URL: 'http://localhost:5000/api'
};

const tour = {
  id: 12,
  name: 'Đà Lạt - Nha Trang 4N3Đ',
  images: [
    {
      id: 1,
      image_url: '/uploads/tours/tour_12_1760153301889.png',
      is_primary: false,
      sort_order: 1
    }
  ]
};

// Simulate getTourImage function
const getTourImage = () => {
  if (!tour) return '/placeholder-tour.jpg';
  
  // Priority 1: primary image from DB
  if (tour.images && Array.isArray(tour.images)) {
    const primaryImg = tour.images.find(img => img.is_primary);
    if (primaryImg?.image_url) {
      const url = primaryImg.image_url.startsWith('http') 
        ? primaryImg.image_url 
        : `${config.API_BASE_URL.replace(/\/api$/, '')}${primaryImg.image_url}`;
      console.log('✅ Found primary image:', url);
      return url;
    }
    
    // Priority 2: first image
    if (tour.images[0]?.image_url) {
      const url = tour.images[0].image_url.startsWith('http') 
        ? tour.images[0].image_url 
        : `${config.API_BASE_URL.replace(/\/api$/, '')}${tour.images[0].image_url}`;
      console.log('✅ Found first image:', url);
      return url;
    }
  }
  
  // Fallback
  console.log('⚠️ No images found, using fallback');
  return tour.image || '/placeholder-tour.jpg';
};

console.log('🔍 Testing image URL construction:\n');
console.log('Tour data:', JSON.stringify(tour, null, 2));
console.log('\nResult:', getTourImage());
console.log('\n✅ Expected URL: http://localhost:5000/uploads/tours/tour_12_1760153301889.png');
