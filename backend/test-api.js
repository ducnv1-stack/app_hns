#!/usr/bin/env node

const http = require('http');
const https = require('https');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
const TIMEOUT = 10000; // 10 seconds

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HNS-API-Tester/1.0'
      },
      timeout: TIMEOUT
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing Health Check...');
  try {
    const response = await makeRequest('GET', '/health');
    
    if (response.statusCode === 200) {
      console.log('✅ Health Check: PASSED');
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      console.log('❌ Health Check: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Health Check: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testGetTours() {
  console.log('\n🔍 Testing Get Tours...');
  try {
    const response = await makeRequest('GET', '/tours');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Get Tours: PASSED');
      console.log(`   Total Tours: ${response.data.data.pagination.totalItems}`);
      console.log(`   Current Page: ${response.data.data.pagination.currentPage}`);
      console.log(`   Tours in Response: ${response.data.data.tours.length}`);
      
      if (response.data.data.tours.length > 0) {
        const firstTour = response.data.data.tours[0];
        console.log(`   First Tour: ${firstTour.name}`);
        console.log(`   Service Type: ${firstTour.service_type}`);
        console.log(`   Min Price: ${firstTour.min_price}`);
        console.log(`   Max Price: ${firstTour.max_price}`);
        console.log(`   Available Keys:`, Object.keys(firstTour));
      }
      return true;
    } else {
      console.log('❌ Get Tours: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Tours: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testGetTourDetail() {
  console.log('\n🔍 Testing Get Tour Detail...');
  try {
    const response = await makeRequest('GET', '/tours/1');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Get Tour Detail: PASSED');
      const tour = response.data.data;
      console.log(`   Tour Name: ${tour.name}`);
      console.log(`   Service Type: ${tour.service_type}`);
      console.log(`   Duration: ${tour.duration_days} days`);
      console.log(`   Country: ${tour.country}`);
      console.log(`   Variants: ${tour.variants?.length || 0}`);
      console.log(`   Images: ${tour.images?.length || 0}`);
      console.log(`   Availabilities: ${tour.availabilities?.length || 0}`);
      return true;
    } else {
      console.log('❌ Get Tour Detail: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Tour Detail: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testGetCountries() {
  console.log('\n🔍 Testing Get Countries...');
  try {
    const response = await makeRequest('GET', '/tours/meta/countries');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Get Countries: PASSED');
      console.log(`   Countries Found: ${response.data.data.length}`);
      response.data.data.forEach(country => {
        console.log(`   - ${country.name} (${country.key})`);
      });
      return true;
    } else {
      console.log('❌ Get Countries: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Countries: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testGetCategories() {
  console.log('\n🔍 Testing Get Categories...');
  try {
    const response = await makeRequest('GET', '/tours/meta/categories');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Get Categories: PASSED');
      console.log(`   Categories Found: ${response.data.data.length}`);
      response.data.data.forEach(category => {
        console.log(`   - ${category.name} (${category.key})`);
      });
      return true;
    } else {
      console.log('❌ Get Categories: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Categories: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔍 Testing Login...');
  try {
    const loginData = {
      email: 'test@example.com',
      role: 'user'
    };
    
    const response = await makeRequest('POST', '/auth/login', loginData);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Login: PASSED');
      console.log(`   User: ${response.data.data.user.name}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   Role: ${response.data.data.user.role}`);
      console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
      return response.data.data.token;
    } else {
      console.log('❌ Login: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Login: ERROR');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function testGetBookings() {
  console.log('\n🔍 Testing Get Bookings...');
  try {
    const response = await makeRequest('GET', '/bookings');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Get Bookings: PASSED');
      console.log(`   Total Bookings: ${response.data.data.pagination.totalItems}`);
      console.log(`   Bookings in Response: ${response.data.data.bookings.length}`);
      return true;
    } else {
      console.log('❌ Get Bookings: FAILED');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Get Bookings: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting HNS Booking Tour API Tests...\n');
  console.log(`📍 Testing API at: ${BASE_URL}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Run all tests
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Get Tours', fn: testGetTours },
    { name: 'Get Tour Detail', fn: testGetTourDetail },
    { name: 'Get Countries', fn: testGetCountries },
    { name: 'Get Categories', fn: testGetCategories },
    { name: 'Login', fn: testLogin },
    { name: 'Get Bookings', fn: testGetBookings }
  ];

  for (const test of tests) {
    results.total++;
    try {
      const result = await test.fn();
      if (result) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      results.failed++;
      console.log(`❌ ${test.name}: UNEXPECTED ERROR`);
      console.log(`   Error: ${error.message}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.total}`);
  console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('\n🔗 You can now test the API manually:');
  console.log(`   Health: ${BASE_URL}/health`);
  console.log(`   Tours: ${BASE_URL}/tours`);
  console.log(`   Tour Detail: ${BASE_URL}/tours/1`);
  console.log(`   Countries: ${BASE_URL}/tours/meta/countries`);
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log('\n✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
