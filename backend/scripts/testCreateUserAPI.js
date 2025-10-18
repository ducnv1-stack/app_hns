/**
 * Test script for create user API
 */

const BASE_URL = 'http://localhost:5000';

async function testCreateUserAPI() {
  try {
    console.log('🧪 Testing Create User API...\n');
    
    // 1. Login as admin first
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@hanoisuntravel.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login status:', loginResponse.status);
    console.log('Login success:', loginData.success);
    
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.data.token;
    console.log('✅ Login successful, token received\n');
    
    // 2. Test create user with valid data
    console.log('2️⃣ Testing create user with valid data...');
    const createUserData = {
      email: 'testuser@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      phone: '0123456789',
      role: 'USER',
      isActive: true
    };
    
    console.log('Request data:', createUserData);
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createUserData)
    });
    
    console.log('Create user status:', createResponse.status);
    const createData = await createResponse.json();
    console.log('Create user response:', createData);
    
    if (createData.success) {
      console.log('✅ User created successfully!');
    } else {
      console.log('❌ User creation failed:', createData.error);
    }
    
    // 3. Test create user with duplicate email
    console.log('\n3️⃣ Testing create user with duplicate email...');
    const duplicateResponse = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createUserData)
    });
    
    console.log('Duplicate email status:', duplicateResponse.status);
    const duplicateData = await duplicateResponse.json();
    console.log('Duplicate email response:', duplicateData);
    
    // 4. Test create user with missing fields
    console.log('\n4️⃣ Testing create user with missing fields...');
    const invalidData = {
      email: 'invalid@example.com',
      // Missing password, firstName, lastName
      phone: '0123456789'
    };
    
    const invalidResponse = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invalidData)
    });
    
    console.log('Invalid data status:', invalidResponse.status);
    const invalidResponseData = await invalidResponse.json();
    console.log('Invalid data response:', invalidResponseData);
    
    // 5. Test create user with invalid role
    console.log('\n5️⃣ Testing create user with invalid role...');
    const invalidRoleData = {
      email: 'invalidrole@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'INVALID_ROLE',
      isActive: true
    };
    
    const invalidRoleResponse = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invalidRoleData)
    });
    
    console.log('Invalid role status:', invalidRoleResponse.status);
    const invalidRoleResponseData = await invalidRoleResponse.json();
    console.log('Invalid role response:', invalidRoleResponseData);
    
    console.log('\n✅ API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  testCreateUserAPI();
}

module.exports = testCreateUserAPI;
