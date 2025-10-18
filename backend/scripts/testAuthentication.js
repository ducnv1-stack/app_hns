const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

let adminToken = null;
let userToken = null;

async function testLogin() {
  log.info('Testing Login Endpoints...\n');

  try {
    // Test 1: Admin Login
    log.test('Test 1: Admin Login');
    const adminResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@hanoisuntravel.com',
      password: 'admin123'
    });

    if (adminResponse.data.success && adminResponse.data.data.token) {
      adminToken = adminResponse.data.data.token;
      const roles = adminResponse.data.data.user.roles;
      log.success(`Admin login successful. Roles: ${JSON.stringify(roles)}`);
      
      if (roles.includes('admin')) {
        log.success('Admin role verified ✓');
      } else {
        log.error('Admin role NOT found in response!');
      }
    } else {
      log.error('Admin login failed');
    }

    // Test 2: User Login
    log.test('\nTest 2: User Login');
    const userResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@demo.com',
      password: 'user123'
    });

    if (userResponse.data.success && userResponse.data.data.token) {
      userToken = userResponse.data.data.token;
      const roles = userResponse.data.data.user.roles;
      log.success(`User login successful. Roles: ${JSON.stringify(roles)}`);
      
      if (roles.includes('user') && !roles.includes('admin')) {
        log.success('User role verified ✓');
      } else {
        log.error('User role verification failed!');
      }
    } else {
      log.error('User login failed');
    }

    // Test 3: Invalid credentials
    log.test('\nTest 3: Invalid Credentials');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
      log.error('Should have failed with invalid credentials');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log.success('Invalid credentials rejected correctly ✓');
      } else {
        log.error('Unexpected error response');
      }
    }

  } catch (error) {
    log.error(`Login test failed: ${error.message}`);
  }
}

async function testProtectedRoutes() {
  log.info('\n\nTesting Protected Routes...\n');

  try {
    // Test 4: Access protected route without token
    log.test('Test 4: Access protected route WITHOUT token');
    try {
      await axios.get(`${BASE_URL}/users/profile`);
      log.error('Should have been rejected without token');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log.success('Unauthorized access rejected ✓');
      } else {
        log.error('Unexpected error response');
      }
    }

    // Test 5: Access protected route with valid token
    log.test('\nTest 5: Access protected route WITH valid token');
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        log.success('Authenticated access granted ✓');
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

    // Test 6: Access protected route with invalid token
    log.test('\nTest 6: Access protected route with INVALID token');
    try {
      await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: 'Bearer invalid_token_12345' }
      });
      log.error('Should have been rejected with invalid token');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log.success('Invalid token rejected ✓');
      } else {
        log.error('Unexpected error response');
      }
    }

  } catch (error) {
    log.error(`Protected routes test failed: ${error.message}`);
  }
}

async function testRoleBasedAccess() {
  log.info('\n\nTesting Role-Based Access Control...\n');

  try {
    // Test 7: User accessing admin route (should fail)
    log.test('Test 7: User accessing ADMIN route (should be denied)');
    try {
      await axios.get(`${BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      log.error('User should NOT have access to admin route');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        log.success('User correctly denied access to admin route ✓');
      } else {
        log.error(`Unexpected error: ${error.response?.status}`);
      }
    }

    // Test 8: Admin accessing admin route (should succeed)
    log.test('\nTest 8: Admin accessing ADMIN route (should succeed)');
    try {
      const response = await axios.get(`${BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        log.success('Admin correctly granted access to admin route ✓');
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

    // Test 9: User accessing user route (should succeed)
    log.test('\nTest 9: User accessing USER route (should succeed)');
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        log.success('User correctly granted access to user route ✓');
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

    // Test 10: Admin accessing user route (should succeed)
    log.test('\nTest 10: Admin accessing USER route (should succeed)');
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        log.success('Admin correctly granted access to user route ✓');
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

  } catch (error) {
    log.error(`Role-based access test failed: ${error.message}`);
  }
}

async function testAuthMeEndpoint() {
  log.info('\n\nTesting /api/auth/me Endpoint...\n');

  try {
    // Test 11: Check admin /me endpoint returns roles array
    log.test('Test 11: Admin /me endpoint returns roles array');
    try {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      const userData = response.data.data;
      
      if (Array.isArray(userData.roles)) {
        log.success('Response contains roles as ARRAY ✓');
        
        if (userData.roles.includes('admin')) {
          log.success('Admin role present in roles array ✓');
        } else {
          log.error('Admin role NOT found in roles array!');
        }
      } else {
        log.error(`roles is not an array! Type: ${typeof userData.roles}`);
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

    // Test 12: Check user /me endpoint returns roles array
    log.test('\nTest 12: User /me endpoint returns roles array');
    try {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      const userData = response.data.data;
      
      if (Array.isArray(userData.roles)) {
        log.success('Response contains roles as ARRAY ✓');
        
        if (userData.roles.includes('user')) {
          log.success('User role present in roles array ✓');
        } else {
          log.error('User role NOT found in roles array!');
        }
      } else {
        log.error(`roles is not an array! Type: ${typeof userData.roles}`);
      }
    } catch (error) {
      log.error(`Failed: ${error.response?.data?.error || error.message}`);
    }

  } catch (error) {
    log.error(`/auth/me test failed: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 AUTHENTICATION & AUTHORIZATION TEST SUITE');
  console.log('='.repeat(60) + '\n');

  log.warn('Make sure the backend server is running on http://localhost:5000');
  log.warn('Make sure demo users exist (run createUserData.js if needed)\n');

  await testLogin();
  await testProtectedRoutes();
  await testRoleBasedAccess();
  await testAuthMeEndpoint();

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS COMPLETED');
  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
