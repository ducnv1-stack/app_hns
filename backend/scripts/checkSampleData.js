const { pool } = require('../config/database');

async function checkSampleData() {
  console.log('🔍 KIỂM TRA DỮ LIỆU MẪU TRONG DATABASE...\n');

  try {
    // 1. Kiểm tra tours/services
    console.log('🎯 KIỂM TRA TOURS/SERVICES:');
    const servicesQuery = `
      SELECT id, name, service_type, status, created_at
      FROM services 
      WHERE service_type = 'TOUR'
      ORDER BY id
      LIMIT 5;
    `;
    const servicesResult = await pool.query(servicesQuery);
    
    if (servicesResult.rows.length > 0) {
      console.log(`✅ Có ${servicesResult.rows.length} tours trong database:`);
      servicesResult.rows.forEach(service => {
        console.log(`   - ID: ${service.id}, Name: ${service.name}, Type: ${service.service_type}, Status: ${service.status}`);
      });
    } else {
      console.log('❌ Không có tours nào trong database');
    }

    // 2. Kiểm tra users
    console.log('\n👤 KIỂM TRA USERS:');
    const usersQuery = `
      SELECT u.id, u.username, u.is_active, p.full_name, p.email, p.phone_number
      FROM users u
      JOIN parties p ON u.party_id = p.id
      ORDER BY u.id
      LIMIT 5;
    `;
    const usersResult = await pool.query(usersQuery);
    
    if (usersResult.rows.length > 0) {
      console.log(`✅ Có ${usersResult.rows.length} users trong database:`);
      usersResult.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Name: ${user.full_name}, Email: ${user.email}, Active: ${user.is_active}`);
      });
    } else {
      console.log('❌ Không có users nào trong database');
    }

    // 3. Kiểm tra roles
    console.log('\n🔐 KIỂM TRA ROLES:');
    const rolesQuery = `
      SELECT id, role_name, description
      FROM roles
      ORDER BY id;
    `;
    const rolesResult = await pool.query(rolesQuery);
    
    if (rolesResult.rows.length > 0) {
      console.log(`✅ Có ${rolesResult.rows.length} roles trong database:`);
      rolesResult.rows.forEach(role => {
        console.log(`   - ID: ${role.id}, Name: ${role.role_name}, Description: ${role.description}`);
      });
    } else {
      console.log('❌ Không có roles nào trong database');
    }

    // 4. Kiểm tra user_roles
    console.log('\n🔗 KIỂM TRA USER_ROLES:');
    const userRolesQuery = `
      SELECT ur.user_id, ur.role_id, r.role_name, p.full_name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      JOIN users u ON ur.user_id = u.id
      JOIN parties p ON u.party_id = p.id
      ORDER BY ur.user_id;
    `;
    const userRolesResult = await pool.query(userRolesQuery);
    
    if (userRolesResult.rows.length > 0) {
      console.log(`✅ Có ${userRolesResult.rows.length} user-role assignments:`);
      userRolesResult.rows.forEach(ur => {
        console.log(`   - User: ${ur.full_name} (ID: ${ur.user_id}) → Role: ${ur.role_name} (ID: ${ur.role_id})`);
      });
    } else {
      console.log('❌ Không có user-role assignments nào');
    }

    // 5. Kiểm tra bookings
    console.log('\n📋 KIỂM TRA BOOKINGS:');
    const bookingsQuery = `
      SELECT id, booking_code, total_amount, currency, status, created_at
      FROM bookings
      ORDER BY id
      LIMIT 5;
    `;
    const bookingsResult = await pool.query(bookingsQuery);
    
    if (bookingsResult.rows.length > 0) {
      console.log(`✅ Có ${bookingsResult.rows.length} bookings trong database:`);
      bookingsResult.rows.forEach(booking => {
        console.log(`   - ID: ${booking.id}, Code: ${booking.booking_code}, Amount: ${booking.total_amount} ${booking.currency}, Status: ${booking.status}`);
      });
    } else {
      console.log('❌ Không có bookings nào trong database');
    }

    // 6. Kiểm tra payments
    console.log('\n💳 KIỂM TRA PAYMENTS:');
    const paymentsQuery = `
      SELECT id, booking_id, payment_method, amount, currency, status, created_at
      FROM payments
      ORDER BY id
      LIMIT 5;
    `;
    const paymentsResult = await pool.query(paymentsQuery);
    
    if (paymentsResult.rows.length > 0) {
      console.log(`✅ Có ${paymentsResult.rows.length} payments trong database:`);
      paymentsResult.rows.forEach(payment => {
        console.log(`   - ID: ${payment.id}, Booking: ${payment.booking_id}, Method: ${payment.payment_method}, Amount: ${payment.amount} ${payment.currency}, Status: ${payment.status}`);
      });
    } else {
      console.log('❌ Không có payments nào trong database');
    }

    // 7. Tổng kết
    console.log('\n📊 TỔNG KẾT:');
    const summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM services) as services_count,
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM roles) as roles_count,
        (SELECT COUNT(*) FROM user_roles) as user_roles_count,
        (SELECT COUNT(*) FROM bookings) as bookings_count,
        (SELECT COUNT(*) FROM payments) as payments_count,
        (SELECT COUNT(*) FROM parties) as parties_count;
    `;
    const summaryResult = await pool.query(summaryQuery);
    const summary = summaryResult.rows[0];
    
    console.log(`   - Services: ${summary.services_count}`);
    console.log(`   - Users: ${summary.users_count}`);
    console.log(`   - Roles: ${summary.roles_count}`);
    console.log(`   - User-Role assignments: ${summary.user_roles_count}`);
    console.log(`   - Bookings: ${summary.bookings_count}`);
    console.log(`   - Payments: ${summary.payments_count}`);
    console.log(`   - Parties: ${summary.parties_count}`);

    console.log('\n✅ KIỂM TRA DỮ LIỆU MẪU HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra dữ liệu mẫu:', error);
  }
}

// Chạy kiểm tra
checkSampleData();
