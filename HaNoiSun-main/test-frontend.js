#!/usr/bin/env node

const http = require('http');

// Test configuration
const API_BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testBackendAPI() {
  console.log('🔍 Testing Backend API...\n');
  
  try {
    // Test health check
    console.log('📊 Testing API Health...');
    const healthResponse = await makeRequest(`${API_BASE_URL}/health`);
    
    if (healthResponse.statusCode === 200) {
      console.log('✅ Backend API: RUNNING');
      const healthData = JSON.parse(healthResponse.data);
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Message: ${healthData.message}`);
    } else {
      console.log('❌ Backend API: NOT RESPONDING');
      console.log(`   Status Code: ${healthResponse.statusCode}`);
      return false;
    }

    // Test tours endpoint
    console.log('\n📦 Testing Tours Endpoint...');
    const toursResponse = await makeRequest(`${API_BASE_URL}/tours`);
    
    if (toursResponse.statusCode === 200) {
      const toursData = JSON.parse(toursResponse.data);
      console.log('✅ Tours Endpoint: WORKING');
      console.log(`   Total Tours: ${toursData.data.pagination.totalItems}`);
      console.log(`   Tours in Response: ${toursData.data.tours.length}`);
    } else {
      console.log('❌ Tours Endpoint: ERROR');
      console.log(`   Status Code: ${toursResponse.statusCode}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Backend API: CONNECTION FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testFrontendConnection() {
  console.log('\n🌐 Testing Frontend Connection...\n');
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      console.log('✅ Frontend: RUNNING');
      console.log(`   URL: ${FRONTEND_URL}`);
      return true;
    } else {
      console.log('❌ Frontend: NOT RESPONDING');
      console.log(`   Status Code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend: CONNECTION FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 HNS Booking Tour - Frontend Integration Test');
  console.log('='.repeat(60));
  
  const backendOk = await testBackendAPI();
  const frontendOk = await testFrontendConnection();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`🔧 Backend API: ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🌐 Frontend: ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Open your browser and go to: http://localhost:3000');
    console.log('2. Navigate to /tours to see the API integration');
    console.log('3. Click on any tour to see the detail page');
    console.log('4. Test the booking flow');
  } else {
    console.log('\n⚠️  Some tests failed. Please check:');
    if (!backendOk) {
      console.log('- Make sure backend is running: cd backend && node start.js');
    }
    if (!frontendOk) {
      console.log('- Make sure frontend is running: npm start');
    }
  }
  
  console.log('\n📋 Manual Test Checklist:');
  console.log('□ Tours page loads from API');
  console.log('□ Tour detail page loads from API');
  console.log('□ Search and filters work');
  console.log('□ Booking flow works');
  console.log('□ Error handling works');
}

// Run tests
runTests()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
