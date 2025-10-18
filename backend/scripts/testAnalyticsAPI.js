(async () => {
  try {
    console.log('🧪 Testing Analytics API\n');

    // Login as admin
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
    console.log('✅ Login successful\n');

    // Test overview endpoint
    console.log('2. Testing GET /api/admin/analytics/overview...');
    const overviewRes = await fetch('http://localhost:5000/api/admin/analytics/overview', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const overviewData = await overviewRes.json();
    console.log('✅ Overview response:\n');
    console.log(JSON.stringify(overviewData, null, 2));

    // Test products endpoint
    console.log('\n3. Testing GET /api/admin/analytics/products...');
    const productsRes = await fetch('http://localhost:5000/api/admin/analytics/products', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const productsData = await productsRes.json();
    console.log('✅ Products response:');
    console.log(`Total products: ${productsData.data?.length || 0}`);
    if (productsData.data?.length > 0) {
      console.log('Sample product:', productsData.data[0]);
    }

    // Test orders by status
    console.log('\n4. Testing GET /api/admin/analytics/orders-by-status...');
    const ordersRes = await fetch('http://localhost:5000/api/admin/analytics/orders-by-status', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const ordersData = await ordersRes.json();
    console.log('✅ Orders by status response:');
    console.log(JSON.stringify(ordersData.data, null, 2));

    // Test payment methods
    console.log('\n5. Testing GET /api/admin/analytics/payment-methods...');
    const paymentsRes = await fetch('http://localhost:5000/api/admin/analytics/payment-methods', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const paymentsData = await paymentsRes.json();
    console.log('✅ Payment methods response:');
    console.log(JSON.stringify(paymentsData.data, null, 2));

    // Test with date filter
    console.log('\n6. Testing with date filter...');
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const filteredRes = await fetch(
      `http://localhost:5000/api/admin/analytics/overview?startDate=${lastMonth}&endDate=${today}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const filteredData = await filteredRes.json();
    console.log('✅ Filtered overview (last 30 days):');
    console.log(`Orders: ${filteredData.data?.orders?.total_orders || 0}`);
    console.log(`Revenue: ${filteredData.data?.orders?.total_order_value || 0}`);

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
