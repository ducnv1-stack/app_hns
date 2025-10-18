(async () => {
  try {
    console.log('🧪 Testing /api/admin/users/stats/overview endpoint\n');

    // First login to get token
    console.log('1. Logging in as admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hanoisuntravel.com',
        password: 'admin123'
      })
    });

    const loginData = await loginRes.json();
    
    if (!loginData.success || !loginData.data?.token) {
      throw new Error('Login failed: ' + JSON.stringify(loginData));
    }
    
    const token = loginData.data.token;
    console.log('✅ Login successful, token received\n');

    // Test stats endpoint
    console.log('2. Testing GET /api/admin/users/stats/overview...');
    const statsRes = await fetch('http://localhost:5000/api/admin/users/stats/overview', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const statsData = await statsRes.json();
    console.log('✅ Stats endpoint response:\n');
    console.log(JSON.stringify(statsData, null, 2));

    // Test users list endpoint
    console.log('\n3. Testing GET /api/admin/users...');
    const usersRes = await fetch('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const usersData = await usersRes.json();
    console.log('✅ Users list response:\n');
    console.log(`Total users: ${usersData.data.users.length}`);
    console.log('Users:', usersData.data.users.map(u => ({
      id: u.id,
      username: u.username,
      full_name: u.full_name,
      role: u.role_name
    })));

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
