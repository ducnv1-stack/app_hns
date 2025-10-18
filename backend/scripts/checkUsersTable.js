const { query } = require('../config/database');

/**
 * Script để kiểm tra cấu trúc bảng users
 */
async function checkUsersTableStructure() {
  try {
    console.log('🔍 Checking users table structure...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ users table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    console.log('\n📊 Sample data from users:');
    const sampleResult = await query('SELECT * FROM users LIMIT 3');
    
    if (sampleResult.rows.length > 0) {
      console.log('Columns:', Object.keys(sampleResult.rows[0]));
      console.log('\nSample records:');
      sampleResult.rows.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        Object.entries(user).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    } else {
      console.log('No users found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUsersTableStructure();