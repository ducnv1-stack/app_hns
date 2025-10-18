const { pool } = require('../config/database');

(async () => {
  try {
    console.log('📊 Viewing Users, User_Roles, and Roles tables\n');

    // Get roles table
    console.log('='.repeat(80));
    console.log('📋 ROLES TABLE');
    console.log('='.repeat(80));
    const rolesResult = await pool.query(`
      SELECT * FROM roles ORDER BY id
    `);
    console.table(rolesResult.rows);

    // Get users table
    console.log('\n' + '='.repeat(80));
    console.log('👥 USERS TABLE');
    console.log('='.repeat(80));
    const usersResult = await pool.query(`
      SELECT 
        id,
        party_id,
        username,
        auth_provider,
        is_active,
        last_login,
        created_at
      FROM users 
      ORDER BY id
      LIMIT 20
    `);
    console.table(usersResult.rows);

    // Get user_roles table (join with users and roles for readable output)
    console.log('\n' + '='.repeat(80));
    console.log('🔗 USER_ROLES TABLE (with details)');
    console.log('='.repeat(80));
    const userRolesResult = await pool.query(`
      SELECT 
        ur.user_id,
        u.username,
        ur.role_id,
        r.role_name,
        ur.assigned_at
      FROM user_roles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY ur.user_id
      LIMIT 20
    `);
    console.table(userRolesResult.rows);

    // Statistics
    console.log('\n' + '='.repeat(80));
    console.log('📈 STATISTICS');
    console.log('='.repeat(80));
    
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM roles) as total_roles,
        (SELECT COUNT(*) FROM user_roles) as total_user_roles,
        (SELECT COUNT(DISTINCT user_id) FROM user_roles) as users_with_roles
    `);
    console.table(stats.rows);

    // Role distribution
    console.log('\n' + '='.repeat(80));
    console.log('📊 ROLE DISTRIBUTION');
    console.log('='.repeat(80));
    const roleDistribution = await pool.query(`
      SELECT 
        r.role_name,
        COUNT(ur.user_id) as user_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.id, r.role_name
      ORDER BY user_count DESC
    `);
    console.table(roleDistribution.rows);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
