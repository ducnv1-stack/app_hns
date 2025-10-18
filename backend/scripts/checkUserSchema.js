const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 Checking schema of users, user_roles, and roles tables\n');

    // Check users table schema
    console.log('='.repeat(80));
    console.log('📋 USERS TABLE SCHEMA');
    console.log('='.repeat(80));
    const usersSchema = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.table(usersSchema.rows);

    // Check roles table schema
    console.log('\n' + '='.repeat(80));
    console.log('📋 ROLES TABLE SCHEMA');
    console.log('='.repeat(80));
    const rolesSchema = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'roles'
      ORDER BY ordinal_position
    `);
    console.table(rolesSchema.rows);

    // Check user_roles table schema
    console.log('\n' + '='.repeat(80));
    console.log('📋 USER_ROLES TABLE SCHEMA');
    console.log('='.repeat(80));
    const userRolesSchema = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'user_roles'
      ORDER BY ordinal_position
    `);
    console.table(userRolesSchema.rows);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
