const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 Testing Overview Queries\n');

    // Test product stats
    console.log('1. Testing product stats...');
    const productStatsQuery = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_products,
        COUNT(*) FILTER (WHERE service_type = 'TOUR') as tour_count,
        COUNT(*) FILTER (WHERE service_type = 'FLIGHT') as flight_count,
        COUNT(*) FILTER (WHERE service_type = 'HOTEL_ROOM') as hotel_count,
        COUNT(*) FILTER (WHERE service_type = 'COMBO') as combo_count
      FROM services
    `;
    const productStats = await pool.query(productStatsQuery);
    console.log('✅ Product stats:', productStats.rows[0]);

    // Test order stats
    console.log('\n2. Testing order stats...');
    const orderStatsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED') as confirmed_orders,
        COUNT(*) FILTER (WHERE status = 'PAID') as paid_orders,
        COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled_orders,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
        COALESCE(SUM(total_amount), 0) as total_order_value,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM bookings
      WHERE 1=1
    `;
    const orderStats = await pool.query(orderStatsQuery);
    console.log('✅ Order stats:', orderStats.rows[0]);

    // Test payment stats
    console.log('\n3. Testing payment stats...');
    const paymentStatsQuery = `
      SELECT 
        COUNT(*) as total_payments,
        COUNT(*) FILTER (WHERE status = 'SUCCESS') as successful_payments,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_payments,
        COUNT(*) FILTER (WHERE status = 'FAILED') as failed_payments,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as total_paid_amount,
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_payment_amount
      FROM payments
      WHERE 1=1
    `;
    const paymentStats = await pool.query(paymentStatsQuery);
    console.log('✅ Payment stats:', paymentStats.rows[0]);

    // Test unpaid orders
    console.log('\n4. Testing unpaid orders...');
    const unpaidOrdersQuery = `
      SELECT 
        COUNT(DISTINCT b.id) as unpaid_orders_count,
        COALESCE(SUM(b.total_amount), 0) as unpaid_amount
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'SUCCESS'
      WHERE p.id IS NULL
    `;
    const unpaidOrders = await pool.query(unpaidOrdersQuery);
    console.log('✅ Unpaid orders:', unpaidOrders.rows[0]);

    // Test product views
    console.log('\n5. Testing product views...');
    const productViewsQuery = `
      SELECT 
        COALESCE(SUM(view_count), 0) as total_views
      FROM (
        SELECT COUNT(*) as view_count
        FROM services
        WHERE 1=1
      ) as views
    `;
    const productViews = await pool.query(productViewsQuery);
    console.log('✅ Product views:', productViews.rows[0]);

    console.log('\n✅ All queries executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
