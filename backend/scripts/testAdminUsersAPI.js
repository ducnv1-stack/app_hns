const { query } = require('../config/database');

(async () => {
  try {
    console.log('🧪 Testing Admin Users API Query\n');

    // Test the main query
    console.log('='.repeat(80));
    console.log('📊 GET /api/admin/users - List all users');
    console.log('='.repeat(80));

    const usersQuery = `
      SELECT 
        u.id,
        u.party_id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.last_login,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.is_email_verified,
        p.is_phone_verified,
        p.metadata,
        r.role_name,
        COUNT(DISTINCT b.id) as booking_count,
        COALESCE(SUM(b.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN bookings b ON p.id = b.buyer_party_id
      WHERE 1=1
      GROUP BY u.id, p.id, r.role_name
      ORDER BY u.created_at DESC
      LIMIT 20
    `;

    const result = await query(usersQuery);
    console.log(`\n✅ Found ${result.rows.length} users\n`);
    console.table(result.rows.map(row => ({
      id: row.id,
      username: row.username,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone_number,
      role: row.role_name,
      active: row.is_active,
      bookings: row.booking_count,
      spent: row.total_spent
    })));

    // Test get single user
    console.log('\n' + '='.repeat(80));
    console.log('📊 GET /api/admin/users/:id - Get user by ID');
    console.log('='.repeat(80));

    const userQuery = `
      SELECT 
        u.id,
        u.party_id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.last_login,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.is_email_verified,
        p.is_phone_verified,
        p.metadata,
        r.role_name,
        r.id as role_id
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `;

    const userResult = await query(userQuery, [1]);
    console.log('\n✅ User details:\n');
    console.log(JSON.stringify(userResult.rows[0], null, 2));

    // Test stats
    console.log('\n' + '='.repeat(80));
    console.log('📊 GET /api/admin/users/stats/overview - Statistics');
    console.log('='.repeat(80));

    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.is_active = true) as active_users,
        COUNT(*) FILTER (WHERE u.is_active = false) as inactive_users,
        COUNT(*) FILTER (WHERE u.created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE p.is_email_verified = true) as verified_users
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
    `;

    const roleStatsQuery = `
      SELECT 
        r.role_name,
        COUNT(ur.user_id) as user_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.role_name
    `;

    const [statsResult, roleStatsResult] = await Promise.all([
      query(statsQuery),
      query(roleStatsQuery)
    ]);

    console.log('\n📈 Overall Statistics:');
    console.table(statsResult.rows);

    console.log('\n📊 Role Distribution:');
    console.table(roleStatsResult.rows);

    console.log('\n✅ All queries executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
