const { testConnection } = require('../config/database-supabase');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');
  
  try {
    // Test basic connection
    console.log('1️⃣ Testing basic connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Supabase connection failed');
      process.exit(1);
    }
    
    console.log('✅ Supabase connection successful!\n');
    
    // Test database queries
    console.log('2️⃣ Testing database queries...');
    const { query } = require('../config/database-supabase');
    
    // Test 1: Check tables exist
    console.log('   📋 Checking tables...');
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`   ✅ Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`      - ${row.table_name}`);
    });
    
    // Test 2: Check data counts
    console.log('\n   📊 Checking data counts...');
    const counts = await Promise.all([
      query('SELECT COUNT(*) as count FROM services'),
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM bookings'),
      query('SELECT COUNT(*) as count FROM parties')
    ]);
    
    console.log(`   ✅ Services: ${counts[0].rows[0].count}`);
    console.log(`   ✅ Users: ${counts[1].rows[0].count}`);
    console.log(`   ✅ Bookings: ${counts[2].rows[0].count}`);
    console.log(`   ✅ Parties: ${counts[3].rows[0].count}`);
    
    // Test 3: Test analytics queries
    console.log('\n   📈 Testing analytics queries...');
    const analyticsResult = await query(`
      SELECT 
        COUNT(*) as total_services,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_services,
        COUNT(CASE WHEN service_type = 'TOUR' THEN 1 END) as tour_count
      FROM services
    `);
    
    console.log(`   ✅ Analytics query successful:`);
    console.log(`      - Total services: ${analyticsResult.rows[0].total_services}`);
    console.log(`      - Active services: ${analyticsResult.rows[0].active_services}`);
    console.log(`      - Tour count: ${analyticsResult.rows[0].tour_count}`);
    
    // Test 4: Test transaction
    console.log('\n   🔄 Testing transaction...');
    const { getClient } = require('../config/database-supabase');
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      await client.query('SELECT 1');
      await client.query('COMMIT');
      console.log('   ✅ Transaction test successful');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
    // Test 5: Test specific HNS queries
    console.log('\n   🎯 Testing HNS-specific queries...');
    
    // Test user authentication query
    const userQuery = `
      SELECT
        u.*,
        p.full_name,
        p.email,
        array_agg(r.role_name) as roles
      FROM users u
      JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.is_active = true
      GROUP BY u.id, p.id
      LIMIT 1
    `;
    
    const userResult = await query(userQuery);
    console.log(`   ✅ User query successful: ${userResult.rows.length} users found`);
    
    // Test service query with joins
    const serviceQuery = `
      SELECT 
        s.id,
        s.name,
        s.service_type,
        s.status,
        std.duration_days,
        std.country,
        MIN(sv.price) AS min_price,
        MAX(sv.price) AS max_price
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      GROUP BY s.id, std.duration_days, std.country
      LIMIT 5
    `;
    
    const serviceResult = await query(serviceQuery);
    console.log(`   ✅ Service query successful: ${serviceResult.rows.length} services found`);
    
    console.log('\n🎉 All Supabase tests passed!');
    console.log('✅ Database is ready for production use');
    console.log('\n📋 Next steps:');
    console.log('   1. Update server.js to use Supabase config');
    console.log('   2. Test all API endpoints');
    console.log('   3. Test frontend with Supabase');
    console.log('   4. Deploy to production! 🚀');
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check SUPABASE_DB_URL in config.env');
    console.log('   2. Verify Supabase project is running');
    console.log('   3. Check network connectivity');
    console.log('   4. Verify database schema was imported');
    process.exit(1);
  }
}

// Run test
if (require.main === module) {
  testSupabaseConnection();
}

module.exports = testSupabaseConnection;
