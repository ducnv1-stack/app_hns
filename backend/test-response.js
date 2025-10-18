const http = require('http');

function testAPIResponse() {
  const req = http.get('http://localhost:5000/api/tours', (res) => {
    let data = '';

    console.log(`🔍 API Response Status: ${res.statusCode}`);
    console.log(`📋 Response Headers:`, res.headers['content-type']);

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('\n📊 Parsed Response:');
        console.log('Response Keys:', Object.keys(response));

        if (response.success) {
          console.log('✅ Success:', response.success);
          console.log('📦 Data Keys:', Object.keys(response.data));

          if (response.data.tours) {
            console.log('🎯 Tours Count:', response.data.tours.length);
            console.log('📄 Pagination:', response.data.pagination);

            if (response.data.tours.length > 0) {
              console.log('\n🔍 First Tour Structure:');
              const firstTour = response.data.tours[0];
              console.log('Keys:', Object.keys(firstTour));
              console.log('Sample:', {
                id: firstTour.id,
                name: firstTour.name,
                service_type: firstTour.service_type,
                min_price: firstTour.min_price,
                max_price: firstTour.max_price,
                country: firstTour.country,
                duration_days: firstTour.duration_days
              });
            }
          }
        } else {
          console.log('❌ API Error:', response.error);
          console.log('Raw Response:', data.substring(0, 300));
        }
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
        console.log('Raw Response (first 500 chars):', data.substring(0, 500));
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ HTTP Request Error:', err.message);
  });

  req.setTimeout(5000, () => {
    console.log('❌ Request Timeout');
    req.destroy();
  });
}

console.log('🚀 Testing API Response Structure...\n');
testAPIResponse();
